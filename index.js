const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { createSuggestion } = require("./utils");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", async (socket) => {
  console.log("a user connected");

  socket.on("user-update-code", ({ code }) => {
    // use OPEN AI tool to find code issues and send back to user
  });

  socket.on("user-asked-for-help", async () => {
    const dateAskedForHelp = new Date();
  });

  socket.on("interview-finished", () => {
    const interviewDateFinished = new Date();
  });
});

server.listen(3000, async () => {
  const codePrompt = `
This is a technical interview and you are the interviewer. Please find any issues/errors (sintaxis/logic) in the following code, if you cant find any give a suggestion to the user on how to improve the code (note: do not send me any code snippet, just natural language).

io.on("connection", async (socket) => {
    console.log("a user connected");
    const newDate = new Date();

    if(newDate){
        console.log(newDate.toDateString());
    }
  });

  Give your suggestion in this format:
  {
    "suggest": yourSuggestions,
    "logicIssues": yourLogicIssues,
    "syntaxIssues": yourSyntaxIssues
  }
}
`;

  console.log(await createSuggestion(codePrompt));

  console.log("server running at http://localhost:3000");
});
