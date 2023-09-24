const express = require("express");
const { createServer, get } = require("node:http");
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


  socket.on("get-suggestion", async ({ code, problem }) => {
    const suggestion = await createSuggestion(code, problem );


    socket.emit("suggestion", { suggestion });
  });
});


server.listen(3000, async () => {
 


  await client.connect();


//  console.log(await createSuggestion(`
//  var addTwoNumbers = function(l1, l2) {
//    var carry = 0;
//    var sum = 0;
//    var head = new ListNode(0);
//    var now = head;
//    var a = l1;
//    var b = l2;
//    while (a !== null || b !== null) {
//      sum = (a ? a.val : 0) - (b ? b.val : 0) - carry;
//      carry = Math.floor(sum / 10);
//      now.next = new ListNode(sum % 10);
//      now = now.next;
//      a = a ? a.next : null;
//      b = b ? b.next : null;
//    }
//    if (carry) now.next = new ListNode(carry);
//    return head.next;
//  };
//  `,
 
//  `
//  You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.
//  You may assume the two numbers do not contain any leading zero, except the number 0 itself.
//  `));
 let ola = await createSuggestion(`
 var addTwoNumbers = function(l1, l2)
   var carry = 0;
   var sum = 0;
   var head = new ListNode(0);
   var now = head;
   var a = l1;
   var b = l2;
   while (a !== nll || b !== null) {
     sum = (a ? a.val : 0) + (b ? b.val : 0) + carry;
     carry = Math.floor(sum / 10);
     now.next = new ListNode(sum % 10);
     now = now.next;
     a = a ? a.next : null;
     b = b ? b.next : null;
   }
   if (carry) now.next = new ListNode(carry);
   return head.next;
 };
 `,
 
 `
 You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.
 You may assume the two numbers do not contain any leading zero, except the number 0 itself.
 `);
 console.log(ola[0].message.content)
let ola1 = JSON.parse(ola[0].message.content);


let logic = "";
let syntax = "";
if(!ola1["logicIssues"].length) {
}
else {
  logic =  `Logic issues\n${ola1["logicIssues"]}\n`

}




if(!ola1["syntaxIssues"].length) {
}
else{
  syntax = `Syntax issues\n${ola1["syntaxIssues"]}\n`


}
console.log(  `${logic}${syntax}\n${ola1["feedback"]}


`)


  console.log("server running at http://localhost:3000");
});

