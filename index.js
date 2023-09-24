const express = require("express");
const { createServer, get } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { createSuggestion, sendFinal } = require("./utils");
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
const { send } = require("node:process");
const client = createClient({
  url: process.env.REDIS_URL,
});
client.on("connect", () => console.log("Connected to Redis!"));
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/api/applicants", async (req, res) => {
  const applicants = await client.keys("applicant_*");
  return res.json(applicants);
});

app.get("/api/applicants/:id", async (req, res) => {
  const { id } = req.params;
  const applicant = await client.get(id);
  return res.json(JSON.parse(applicant));
});

app.get("/api/applicants/feedback/:id", async (req, res) => {
  const { id } = req.params;
  const applicant = await client.get(`${id}_feedback`);
  return res.json(JSON.parse(applicant));
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

  socket.on("get-suggestion", async ({ code, id_user, problem }) => {
    try {
      const testData = true;

      const suggestion = await createSuggestion(code, problem, testData);

      const userSession = await client.get(`applicant_${id_user}`);

      if (userSession) {
        const newData = JSON.parse(userSession);
        newData.push(suggestion);

        client.set(`applicant_${id_user}`, JSON.stringify(newData));
      } else {
        client.set(`applicant_${id_user}`, JSON.stringify([suggestion]));
      }

      let suggestionResponse = "";

      let logic = "";
      let syntax = "";

      if (testData) {
        suggestionResponse = "Test suggest data";
      } else {
        const message = JSON.parse(suggestion[0].message.content);

        if (!message["logicIssues"].length) {
          logic = `Logic issues\n${message["logicIssues"]}\n`;
        }
        if (message["syntaxIssues"].length) {
          syntax = `Syntax issues\n${message["syntaxIssues"]}\n`;
        }

        suggestionResponse = `${logic}${syntax}\n${message["feedback"]}`;
      }

      socket.emit("suggestion", {
        suggestion: {
          message: suggestionResponse,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("user-submit-code", async ({ code, id_user, problem }) => {
    try {
      console.log("Submitting code");
      const testData = false;

      const suggestion = await sendFinal(code, problem, testData);

      const userSession = await client.get(`applicant_${id_user}`);

      if (userSession) {
        const newData = JSON.parse(userSession);
        newData.push(suggestion);

        client.set(`applicant_${id_user}`, JSON.stringify(newData));
      } else {
        client.set(`applicant_${id_user}`, JSON.stringify([suggestion]));
      }

      let answerResponse = "";

      const message = JSON.parse(suggestion[0].message.content);

      answerResponse = message["answer"];

      client.set(
        `applicant_${id_user}_feedback`,
        JSON.stringify(answerResponse)
      );

      socket.emit("submit_answer", {
        suggestion: {
          message: answerResponse,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(process.env.PORT, async () => {
  await client.connect();

  console.log("server running on port", process.env.PORT);
});
