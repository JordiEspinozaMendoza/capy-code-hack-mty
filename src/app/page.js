/* eslint-disable @next/next/no-img-element */
"use client";
import "./globals.css";
import { useState, useCallback, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import io from "socket.io-client";

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET);
import { MessageBox, Avatar } from "react-chat-elements";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Countdown from "react-countdown";
import { problemStatements } from "@/utils/utils";

const selectedProblemStatement =
  problemStatements[Math.floor(Math.random() * problemStatements.length)];

function Editor() {
  const [value, setValue] = useState("console.log('hello world!');");
  const [messages, setMessages] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const dateStarted = useRef(Date.now());

  const onChange = useCallback((val, z) => {
    socket.emit("user-update-code", {
      code: val,
    });
    setValue(val);
  }, []);

  useEffect(() => {
    const handleGetSuggestion = () => {
      setIsLoadingSuggestions(true);
      socket.emit("get-suggestion", {
        code: value,
        id_user: 5,
        problem: selectedProblemStatement,
      });
    };

    const interval = setInterval(() => {
      if (interviewStarted && !isLoadingSuggestions) {
        handleGetSuggestion();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [value, interviewStarted, isLoadingSuggestions]);

  useEffect(() => {
    socket.on("suggestion", (data) => {
      console.log(data.suggestion);
      setIsLoadingSuggestions(false);
      setMessages((messages) => [...messages, data.suggestion.message]);
    });

    return () => {
      socket.off("suggestion");
    };
  }, []);

  if (!interviewStarted) {
    return (
      <body>
        <div className="InterviewLobby">
          <img className="LobbyLogo" src="capybara.png" />
          <h2>Welcome to your interview!</h2>
          <p>Navigating Interviews with Confidence</p>
          <button
            className="startBtn"
            onClick={() => {
              setInterviewStarted(true);
              socket.emit("user-start-interview");
            }}
          >
            Start Interview
          </button>
        </div>
      </body>
    );
  }
  return (
    <>
      <header>
        <div className="HeaderLogo">
          <img className="Logo" src="capybara.png" />
          <p id="CompanyName">CapyCode</p>
        </div>
        <div className="HelpButton">
          <Countdown
            date={dateStarted.current + 60000 * 30}
            className="Countdown"
          />
          <IconButton sx={{ color: "black" }}>
            <HelpOutlineIcon />
          </IconButton>
        </div>
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
          <div className="ProblemStatement">
            <h2>Problem Statement</h2>
            <p>{selectedProblemStatement}</p>
          </div>
          {isLoadingSuggestions && <p>CapyCode is writing...</p>}
          {messages.slice(0, 10).map((message, key) => (
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
