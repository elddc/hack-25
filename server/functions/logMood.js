require("colors");

async function logMood(functionArgs) {
    let happiness = functionArgs.happiness;
    console.log(`GPT -> called logMood function`.underline.cyan);
    console.log(happiness)
    // todo send data to doctor
    /*
    {
        patient: "Jane Doe",
        mood: happiness, // int
    }
     */
    return "Mood logged.";
}

module.exports = logMood;
