require("dotenv").config();
require("colors");

const express = require("express");
const ExpressWs = require("express-ws");

const {GptService} = require("./services/gpt-service");
const {StreamService} = require("./services/stream-service");
const {TranscriptionService} = require("./services/transcription-service");
const {TextToSpeechService} = require("./services/tts-service");
const {recordingService} = require("./services/recording-service");

const {makeOutBoundCall} = require("./scripts/outbound-call");
const user = require("./config/user");

const VoiceResponse = require("twilio").twiml.VoiceResponse;
const client = require("twilio").calls;

const app = express();
ExpressWs(app);

const PORT = process.env.PORT || 3000;

app.get("/status", (req, res) => {
    console.log("status check");
    res.send("app is running");
});

app.get("/outgoing", (req, res) => {
    console.log("outgoing call");
    res.send("call in progress");
    makeOutBoundCall();
})

app.post("/incoming", (req, res) => {
    try {
        console.log("incoming call");

        const response = new VoiceResponse();
        const connect = response.connect();
        connect.stream({url: `wss://${process.env.SERVER}/connection`});

        res.type("text/xml");
        res.end(response.toString());
    } catch (err) {
        console.log(err);
    }
});

// todo increase duration before sending user message? sometimes gets double response
app.ws("/connection", (ws) => {
    try {
        ws.on("error", console.error);
        // Filled in from start message
        let streamSid;
        let callSid;

        const gptService = new GptService();
        const streamService = new StreamService(ws);
        const transcriptionService = new TranscriptionService();
        const ttsService = new TextToSpeechService({});

        let marks = [];
        let interactionCount = 0;

        // Incoming from MediaStream
        ws.on("message", function message(data) {
            const msg = JSON.parse(data);

            if (msg.event === "start") {
                streamSid = msg.start.streamSid;
                callSid = msg.start.callSid;

                streamService.setStreamSid(streamSid);
                gptService.setCallSid(callSid);

                // Set RECORDING_ENABLED="true" in .env to record calls
                recordingService(ttsService, callSid).then(() => {
                    console.log(`Twilio -> Starting Media Stream for ${streamSid}`.underline.red);
                    ttsService.generate({
                        partialResponseIndex: null,
                        partialResponse: `Hello ${user.name}! How are you doing today?`,
                    }, 0);
                });
            } else if (msg.event === "media") {
                transcriptionService.send(msg.media.payload);
            } else if (msg.event === "mark") {
                const label = msg.mark.name;
                console.log(`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red);
                marks = marks.filter(m => m !== msg.mark.name);
            } else if (msg.event === "stop") {
                console.log(`Twilio -> Media stream ${streamSid} ended.`.underline.red);

                // end of convo, summarize and send data to doctor
                gptService.summarize();
            }
        });

        transcriptionService.on("utterance", async (text) => {
            // This is a bit of a hack to filter out empty utterances
            if (marks.length > 0 && text?.length > 5) {
                console.log("Twilio -> Interruption, Clearing stream".red);
                ws.send(
                    JSON.stringify({
                        streamSid,
                        event: "clear",
                    })
                );
            }
        });

        transcriptionService.on("transcription", async (text) => {
            if (!text) {
                return;
            }
            console.log(`Interaction ${interactionCount} – STT -> GPT: ${text}`.yellow);
            gptService.completion(text, interactionCount);
            interactionCount += 1;

            // todo send data to doctor
            /*
            {
                patient: "Jane Doe",
                type: "outgoing",
                msg: "...",
                sender: "patient"
            }
             */
        });

        gptService.on("gptreply", async (gptReply, icount) => {
            console.log(`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`.green);
            ttsService.generate(gptReply, icount);

            // todo send data to doctor
            /*
            {
                patient: "Jane Doe",
                type: "outgoing",
                msg: "...",
                sender: "bot"
            }
             */
        });

        ttsService.on("speech", (responseIndex, audio, label, icount) => {
            console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);

            streamService.buffer(responseIndex, audio);
        });

        streamService.on("audiosent", (markLabel) => {
            marks.push(markLabel);
        });
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
