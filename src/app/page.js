/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import "./globals.css";
import { useState, useCallback, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import io from "socket.io-client";
import Modal from "@mui/material/Modal";

import { MessageBox, Avatar } from "react-chat-elements";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Countdown from "react-countdown";
import { problemStatements } from "@/utils/utils";
import Typography from "@mui/material/Typography";

const selectedProblemStatement =
  problemStatements[Math.floor(Math.random() * problemStatements.length)];

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Editor() {
  const [value, setValue] = useState("console.log('hello world!');");
  const [messages, setMessages] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const dateStarted = useRef(Date.now());
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    console.log("open");
  };
  const handleClose = () => setOpen(false);

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
          <button className="infoBtn" onClick={handleOpen}>
            How it works
          </button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                How it works
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                1. Start the interview
                <br q />
                2. Write your code in the editor
                <br />
                3. Get suggestions from our AI
                <br />
                4. Get the job!
              </Typography>
            </Box>
          </Modal>
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
              className="MessageBox"
              key={key}
              position={"rights"}
              type={"text"}
              text={message}
              title={"CapyCode"}
              titleColor="#054A91"
              avatar="capybara.png"
              date={new Date()}
            />
          ))}
        </div>
      </div>
    </>
  );
}
export default Editor;
