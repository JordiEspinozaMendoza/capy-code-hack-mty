/* eslint-disable @next/next/no-img-element */
"use client";
import "./globals.css";
import { useState, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import io from "socket.io-client";

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET);
import { MessageBox, Avatar } from "react-chat-elements";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function Editor() {
  const [value, setValue] = useState("console.log('hello world!');");
  const [messages, setMessages] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const onChange = useCallback((val, viewUpdate) => {
    console.log("val:", val);
    socket.emit("user-update-code", {
      code: val,
    });
    setValue(val);
  }, []);

  useEffect(() => {
    const handleGetSuggestion = () => {
      socket.emit("get-suggestion", {
        code: value,
        id_user: 2,
      });
    };

    const interval = setInterval(() => {
      if (interviewStarted) {
        handleGetSuggestion();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [value, interviewStarted]);

  useEffect(() => {
    socket.on("suggestion", (data) => {
      console.log(data);
      Object.keys(data.suggestion).map((key) => {
        setMessages((messages) => [...messages, data.suggestion[key]]);
      });
    });
  }, []);

  if (!interviewStarted) {
    return (
      <div className="InterviewLobby">
        <h2>Welcome to your interview</h2>
        <button
          onClick={() => {
            setInterviewStarted(true);
            socket.emit("user-start-interview");
          }}
        >
          Start Interview
        </button>
      </div>
    );
  }
  return (
    <>
      <header>
        <img className="Logo" src="capybara.png" />
        <p id="CompanyName">CapyCode</p>
        <IconButton sx={{ color: "black" }}>
          <HelpOutlineIcon />
        </IconButton>
      </header>
      <div className="MainContent">
        <div className="Editor">
          <CodeMirror
            value={value}
            height="800px"
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
            theme={vscodeDark}
          />
        </div>

        <div className="Chat">
          {messages.map((message, key) => (
            <MessageBox
              key={key}
              position={"rights"}
              type={"text"}
              text={message}
              title={"CapyCode"}
              dateString={new Date()}
              avatar="capybara.png"
            />
          ))}
        </div>
      </div>
    </>
  );
}
export default Editor;
