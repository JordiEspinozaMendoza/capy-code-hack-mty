const { OpenAI } = require("openai");
const chance = require("chance").Chance();

require("dotenv").config();

const configuration = {
  apiKey: process.env.OPEN_AI_API_KEY,
};
const submitPrompt = (code, problem) => {
  return `
 This is a problem that needs to be solved with a language of your choice.
  PROBLEM STARTS HERE
  ${problem}
  PROBLEM END HERE

  Check if this code will run correctly, if not, give suggestions on how to fix it in a natural language (no code snippet)
  Code starts here
  ${code}
  Code ends here.
  Return ONLY this json object with the values filled in:
    { 
      "answer": yourSummaryAnswer,
    }
  }
  
  `;
};

const sendFinal = async (content, problem) => {
  const openai = new OpenAI(configuration);

  const suggestion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: submitPrompt(content, problem),
      },
    ],
    model: "gpt-4",
  });

  console.log(suggestion.choices);

  return suggestion.choices;
};

const getPrompts = (code, problem) => {
  return `
  This is a technical interview and you are the interviewer. 
  The candidate is trying to solve the following problem with a language of their choice:
  problem start
  ${problem}
  problem end 

  Please find any syntax(this goes in "syntaxIssues") and logic(this goes in "logicIssues") issues/errors in the following code, also give suggestions on how to optimize the code without mentioning the issues again [this goes in "suggest"] (note: do not send me any code snippet).
  send a positive message to put after the issues [this goes in feedback].
  Also send the number of issues you found in the code [this goes in "logicCount" and "syntaxCount"].
  Code starts here
  ${code}
    Code ends here.
   If logicIssues and syntaxIssues are empty, send [] in their respective fields.
    Give your suggestion in this json format (issues should be in the same string and line, leave a space after the comma

    Return ONLY this json object with the values filled in:
    { 
      "suggest": yourSuggestions,
      "logicIssues": yourLogicIssues,
      "logicCount": yourLogicCount,
      "syntaxIssues": yourSyntaxIssues
      "syntaxCount": yourSyntaxCount,
      "feedback": yourFeedback,
      "summaryMessage": yourSummaryMessage
    }
  `;
};

const createSuggestion = async (content, problem, testData) => {
  if (testData) {
    return [
      {
        message: {
          content: {
            suggest: "Test suggest data",
            logicIssues: "Test logic issues",
            syntaxIssues: "Test syntax issues",
            feedback: "test feedback",
            timeFrame: new Date(),
            logicCount: chance.integer({ min: 0, max: 10 }),
            syntaxCount: chance.integer({ min: 0, max: 10 }),
          },
        },
      },
    ];
  }

  const openai = new OpenAI(configuration);

  const suggestion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: getPrompts(content, problem),
      },
    ],
    model: process.env.OPEN_AI_MODEL,
  });

  return suggestion.choices;
};

module.exports = {
  createSuggestion,
  sendFinal,
};
