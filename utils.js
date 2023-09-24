const { OpenAI } = require("openai");
const chance = require("chance").Chance();

require("dotenv").config();

const configuration = {
  apiKey: process.env.OPEN_AI_API_KEY,
};

function getPrompts(code) {
  return  `
  This is a technical interview and you are the interviewer. Please find any issues/errors (syntax [this goes in "syntaxIssues"]/logic[this goes in "logicIssues"]) in the following code, if you cant find any give a suggestion to the user on how to optimize the code [this goes in "suggest"] (note: do not send me any code snippet, just natural language).
  If you cant find any issues or improvement send back a positive feedback message [this goes in feedback].
  
  Code starts here
  ${code}
    Code ends here.
  
    Give your suggestion in this format:
    {
      "suggest": yourSuggestions,
      "logicIssues": yourLogicIssues,
      "syntaxIssues": yourSyntaxIssues
      "feedback": yourFeedback
    }
  }
  
  `; 
}

const createSuggestion = async (content, testData) => {
  if (testData) {
    return [
      {
        suggest: "Test suggest data",
        logicIssues: "Test logic issues",
        syntaxIssues: "Test syntax issues",
        feedback: "test feedback",
        timeFrame: new Date(),
        logicCount: chance.integer({ min: 0, max: 10 }),
        syntaxCount: chance.integer({ min: 0, max: 10 }),
      },
    ];
  }

  const openai = new OpenAI(configuration);

  const suggestion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: getPrompts(content),
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return suggestion.choices;
};

module.exports = {
  createSuggestion,
};
