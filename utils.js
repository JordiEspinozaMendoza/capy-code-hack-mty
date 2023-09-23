const { OpenAI } = require("openai");

require("dotenv").config();

const configuration = {
  apiKey: process.env.OPEN_AI_API_KEY,
};

const createSuggestion = async (content) => {
  const openai = new OpenAI(configuration);

  const suggestion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return suggestion.choices;
};

module.exports = {
  createSuggestion,
};
