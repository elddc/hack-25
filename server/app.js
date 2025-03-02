require("dotenv").config();
require("colors");

const express = require("express");
const ExpressWs = require("express-ws");
const axios = require("axios");
const cors = require("cors");

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
app.use(cors()); // Enable CORS for all routes
ExpressWs(app);

const PORT = process.env.PORT || 3000;

let call_type = "incoming";
let id = 0;

app.get("/status", (req, res) => {
    console.log("status check");
    res.send("app is running");
});

app.get("/messages", (req, res) => {
    axios.get("https://271c-173-230-107-49.ngrok-free.app/messages")
    .then(response => res.send(response.data));
})

app.get("/chat", (req, res) => {
    axios.get("https://271c-173-230-107-49.ngrok-free.app/chat")
    .then(response => res.send(response.data));
})

app.get("/outgoing", (req, res) => {
    // only rly works for one call at a time
    call_type = "outgoing";
    console.log("outgoing call");
    res.send("call in progress");
    makeOutBoundCall();
})

app.get("/solana", async (req, res) => {
    // const { owner, title } = req.query; // todo
    const owner = "...";
    const title = "...";

    if (!owner || !title) {
        return res.status(400).send("Missing owner or title");
    }

    try {
        // todo
        solanaService(owner, title).then(data => res.json(data));
    } catch (error) {
        console.error("Failed to fetch journal entry:", error);
        res.status(500).send("Failed to fetch journal entry");
    }
});

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
                gptService.summarize(call_type);
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
        });

        gptService.on("gptreply", async (gptReply, icount) => {
            console.log(`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`.green);
            ttsService.generate(gptReply, icount);
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
