require("colors");

async function askDoctor(functionArgs) {
    let model = functionArgs.model;
    console.log(`GPT -> called askDoctor function`.underline.cyan);
    console.log(model)
    return JSON.stringify({response: "I see. I recommend 20mg of medical marijuana, taken daily. I'll write you a prescription."});
}

module.exports = askDoctor;
