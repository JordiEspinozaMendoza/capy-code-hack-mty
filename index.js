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

app.get("/api/applicants", async (req, res) => {
  const applicants = await client.keys("applicant_*");
  return res.json(applicants);
});

app.get("/api/applicants/:id", async (req, res) => {
  const { id } = req.params;
  const applicant = await client.get(id);
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

  socket.on("get-suggestion", async ({ code, id_user }) => {
    const suggestion = await createSuggestion(code, true);
    const userSession = await client.get(`applicant_${id_user}`);

    if (userSession) {
      const newData = JSON.parse(userSession);
      newData.push(suggestion);

      console.log(newData);

      client.set(`applicant_${id_user}`, JSON.stringify(newData));
    } else {
      client.set(`applicant_${id_user}`, JSON.stringify([suggestion]));
    }

    socket.emit("suggestion", {
      suggestion: {
        suggest: suggestion[0].suggest,
        logicIssues: suggestion[0].logicIssues,
        syntaxIssues: suggestion[0].syntaxIssues,
        feedback: suggestion[0].feedback,
      },
      userSession,
    });
  });
});

server.listen(3001, async () => {
  await client.connect();

  console.log("server running at http://localhost:3000");
});
