const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

// const { OpenAIApi, Configuration } = require("openai");

// const configuration = new Configuration({
//   apiKey: "test",
// });

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", async (socket) => {
  console.log("a user connected");

  //   const openai = new OpenAIApi(configuration);

  //   // save the metrics of the user and send to the admin
  //   const response = await openai.complete({
  //     engine: "gpt-4",
  //     messages: [],
  //     temperature: 0,
  //     max_tokens: 1024,
  //   });

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

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
