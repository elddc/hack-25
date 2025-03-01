require("colors");

async function askDoctor(functionArgs) {
    let model = functionArgs.model;
    console.log(`GPT -> called askDoctor function`.underline.cyan);
    console.log(model)
    return JSON.stringify({response: "No worries, I can prescribe you some medical marijuana to help with that."});
}

module.exports = askDoctor;
