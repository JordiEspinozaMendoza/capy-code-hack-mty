"use client";
import "./globals.css";
import { useState, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import { MessageBox } from "react-chat-elements";
import io from "socket.io-client";

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET);

function Editor() {
  const [value, setValue] = useState("console.log('hello world!');");
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
    }, 1000);

    return () => clearInterval(interval);
  }, [value, interviewStarted]);

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
        <MessageBox
          position={"rights"}
          type={"text"}
          text={"Hello world"}
          title={"John Doe"}
          dateString={"Fri May 08 2020"}
        />
      </div>
    </div>
  );
}
export default Editor;
