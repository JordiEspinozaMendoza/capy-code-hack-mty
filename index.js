const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { createSuggestion } = require("./utils");
const http = require("http");
const cors = require("cors");

const app = express();
const server = createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    transports: ["websocket", "polling"],
  },
  "force new connection": true,
  timeout: 10000,
  allowEIO3: true,
});

app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  })
);

// TODO: Replace the following with your app's Firebase project configuration
const { createClient } = require("redis");
const client = createClient({
  url: process.env.REDIS_URL,
});
client.on("connect", () => console.log("Connected to Redis!"));
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", async (socket) => {
  console.log("a user connected");

  socket.on("user-start-interview", () => {});

  socket.on("user-update-code", ({ code }) => {
    // use OPEN AI tool to find code issues and send back to user
  });

  socket.on("user-asked-for-help", async () => {
    const dateAskedForHelp = new Date();
  });

  socket.on("interview-finished", () => {
    const interviewDateFinished = new Date();
  });

  socket.on("get-suggestion", async ({ code }) => {
    const suggestion = await createSuggestion(code);

    socket.emit("suggestion", { suggestion });
  });
});

server.listen(3000, async () => {
  let logic = "";
  const codePrompt = `
This is a technical interview and you are the interviewer. Please find any issues/errors (syntax [this goes in "syntaxIssues"]/logic[this goes in "logicIssues"]) in the following code, if you cant find any give a suggestion to the user on how to optimize the code [this goes in "suggest"] (note: do not send me any code snippet, just natural language).
If you cant find any issues or improvement send back a positive feedback message [this goes in feedback].

Code starts here
io.on("connection", async (socket) => {
    console.log("a user connected");

    
    const newDate = new Date();

    if(newDate){
        console.log(newDate.toDateString());
    }
  

  });

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

  //   const response = await createSuggestion(codePrompt);
  let suggestion = [];
  suggestion.push(JSON.parse(response[0].message.content)["suggest"]);

  // logic

  await client.connect();
  const idTemp = "1";
  await client.hSet(idTemp, {
    logic: [JSON.parse(response[0].message.content)["logicIssues"]],
    logicCount: 1,
  });
  // await client.hSet(idTemp, {
  //   logic: 'John',
  //   logicCount: 1,

  //   syntax: 'Smith',
  //   syntaxCount: 1,

  //   suggestion: 'Redis',
  //   suggestionCount: 1,

  //   feedback: '29',

  // })

  // let userSession = await client.hGetAll(idTemp);
  // console.log(JSON.stringify(userSession, null, 2));

  console.log("server running at http://localhost:3000");
});
