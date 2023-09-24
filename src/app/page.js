/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import "./globals.css";
import { useState, useCallback, useEffect } from "react";
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
import Typography from "@mui/material/Typography";

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET);

function Editor() {
  const [value, setValue] = useState("console.log('hello world!');");
  const [messages, setMessages] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        id_user: 4,
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

          <Modal open={open} onClose={handleClose}>
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
          <IconButton onClick={handleOpen} sx={{ color: "black" }}>
            <HelpOutlineIcon />
          </IconButton>
          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Need assistance?
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                If you need help, please contact us at:
              </Typography>
            </Box>
          </Modal>
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
