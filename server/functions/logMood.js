require("colors");

async function logMood(functionArgs) {
    let happiness = functionArgs.happiness;
    console.log(`GPT -> called logMood function`.underline.cyan);
    console.log(happiness) // todo
    return "Mood logged.";
}

module.exports = logMood;
