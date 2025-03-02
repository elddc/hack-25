require("colors");

async function logMood(functionArgs) {
    let happiness = functionArgs.happiness;
    console.log(`GPT -> called logMood function`.underline.cyan);
    console.log(happiness)
    return happiness;
}

module.exports = logMood;
