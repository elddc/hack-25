require("colors");
const EventEmitter = require("events");
const OpenAI = require("openai");
const tools = require("../functions/function-manifest");
const user = require("../config/user");
const systemPrompt = require("../config/system");
const axios = require("axios");

// Import all functions included in function manifest
// Note: the function name and file name must be the same
const availableFunctions = {};
tools.forEach((tool) => {
    let functionName = tool.function.name;
    availableFunctions[functionName] = require(`../functions/${functionName}`);
});

class GptService extends EventEmitter {
    constructor() {
        super();
        this.openai = new OpenAI();
        this.model = "gpt-4o-mini-2024-07-18";
        this.userContext = [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "assistant",
                "content": `Hello ${user.name}! How are you doing today?`
            },
        ];
        this.partialResponseIndex = 0;

        // call data
        this.callType = "";
        this.mood = [];
    }

    // Add the callSid to the chat context in case
    // ChatGPT decides to transfer the call.
    setCallSid(callSid) {
        this.userContext.push({"role": "system", "content": `callSid: ${callSid}`});
    }

    validateFunctionArgs(args) {
        try {
            return JSON.parse(args);
        } catch (error) {
            console.log("Warning: Double function arguments returned by OpenAI:", args);
            // Seeing an error where sometimes we have two sets of args
            if (args.indexOf("{") !== args.lastIndexOf("{")) {
                return JSON.parse(args.substring(args.indexOf(""), args.indexOf("}") + 1));
            }
        }
    }

    updateUserContext(name, role, text) {
        if (name !== "user") {
            this.userContext.push({"role": role, "name": name, "content": text});
        } else {
            this.userContext.push({"role": role, "content": text});
        }
    }

    async completion(text, interactionCount, role = "user", name = "user") {
        this.updateUserContext(name, role, text);
        // todo send data to doctor
        axios.post(`${process.env.SOLANA}/messages`, {
            // patient: "Jane Doe",
            text: text,
            sender: "user",
            mid: 0
        });

        // Step 1: Send user transcription to Chat GPT
        const stream = await this.openai.chat.completions.create({
            model: this.model,
            messages: this.userContext,
            tools: tools,
            stream: true,
        });

        let completeResponse = "";
        let partialResponse = "";
        let functionName = "";
        let functionArgs = "";
        let finishReason = "";

        function collectToolInformation(deltas) {
            let name = deltas.tool_calls[0]?.function?.name || "";
            if (name !== "") {
                functionName = name;
            }
            let args = deltas.tool_calls[0]?.function?.arguments || "";
            if (args !== "") {
                // args are streamed as JSON string so we need to concatenate all chunks
                functionArgs += args;
            }
        }

        for await (const chunk of stream) {
            let content = chunk.choices[0]?.delta?.content || "";
            let deltas = chunk.choices[0].delta;
            finishReason = chunk.choices[0].finish_reason;

            // Step 2: check if GPT wanted to call a function
            if (deltas.tool_calls) {
                // Step 3: Collect the tokens containing function data
                collectToolInformation(deltas);
            }

            // need to call function on behalf of Chat GPT with the arguments it parsed from the conversation
            if (finishReason === "tool_calls") {
                // parse JSON string of args into JSON object

                const functionToCall = availableFunctions[functionName];
                const validatedArgs = this.validateFunctionArgs(functionArgs);

                // Say a pre-configured message from the function manifest
                // before running the function.
                const toolData = tools.find(tool => tool.function.name === functionName);
                // const say = toolData.function.say;

                // this.emit("gptreply", {
                //     partialResponseIndex: null,
                //     partialResponse: say
                // }, interactionCount);

                let functionResponse = await functionToCall(validatedArgs);

                // only ever use mood func so
                this.mood.push(functionResponse);

                // Step 4: send the info on the function call and function response to GPT
                this.updateUserContext(functionName, "function", functionResponse);

                // call the completion function again but pass in the function response to have OpenAI generate a new assistant response
                await this.completion(functionResponse, interactionCount, "function", functionName);
            } else {
                // We use completeResponse for userContext
                completeResponse += content;
                // We use partialResponse to provide a chunk for TTS
                partialResponse += content;
                // Emit last partial response and add complete response to userContext
                if (content.trim().slice(-1) === "•" || finishReason === "stop") {
                    const gptReply = {
                        partialResponseIndex: this.partialResponseIndex,
                        partialResponse
                    };

                    this.emit("gptreply", gptReply, interactionCount);
                    this.partialResponseIndex++;
                    partialResponse = "";
                }
            }
        }
        this.userContext.push({"role": "assistant", "content": completeResponse});
        console.log(`GPT -> user context length: ${this.userContext.length}`.green);

        // todo send data to doctor
        axios.post(`${process.env.SOLANA}/messages`, {
            // patient: "Jane Doe",
            text: completeResponse,
            sender: "bot",
            mid: 0
        });
    }

    async summarize(call_type) {
        console.log("summarizing...");
        // not this sometimes misbehaves
        this.updateUserContext("admin", "user", "Please summarize the conversation so far in 10 words or less.");

        // Step 1: Send user transcription to Chat GPT
        const res = await this.openai.chat.completions.create({
            model: this.model,
            messages: this.userContext,
            stream: false,
        });

        try {
            axios.post(`${process.env.SOLANA}/chat`, {
                patient: "Jane Doe",
                summary: res.choices[0].message.content,
                mood: this.mood.toString(),
                type: call_type
            })
        } catch (e) {

        }

        console.log(this.mood);
        console.log({
            patient: "Jane Doe",
            summary: res.choices[0].message,
            mood: this.mood.toString(),
            type: call_type
        })
    }
}

module.exports = {GptService};
