require("colors");

// UNUSED
async function askDoctor(functionArgs) {
    let query = functionArgs.query;
    console.log(`GPT -> called askDoctor function`.underline.cyan);
    console.log(query)
    return JSON.stringify({response: "I see. I recommend 20mg of ibuprofen, taken daily. I'll write you a prescription."});
}

module.exports = askDoctor;
