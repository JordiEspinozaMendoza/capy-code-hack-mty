/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import io from "socket.io-client";
import Modal from "@mui/material/Modal";
import { useSearchParams } from "next/navigation";
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
  // get user_id from query param
  const searchParams = useSearchParams();

  const id_user =
    searchParams.get("id_user") || Math.floor(Math.random() * 100);

  const [value, setValue] = useState("console.log('hello world!');");
  const [messages, setMessages] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openSubmission, setOpenSubmission] = React.useState(false);
  const dateStarted = useRef(Date.now());

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onChange = useCallback((val) => {
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
        id_user: id_user,
        problem: selectedProblemStatement,
      });
    };

    const interval = setInterval(() => {
      if (
        interviewStarted &&
        !isLoadingSuggestions &&
        !isSubmitting &&
        !feedbackMessage
      ) {
        handleGetSuggestion();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [
    value,
    interviewStarted,
    isLoadingSuggestions,
    isSubmitting,
    feedbackMessage,
    id_user,
  ]);

  useEffect(() => {
    socket.on("suggestion", (data) => {
      setIsLoadingSuggestions(false);
      setMessages((messages) => [...messages, data.suggestion.message]);
    });

    socket.on("submit_answer", (data) => {
      setIsSubmitting(false);
      setOpenSubmission(false);
      setFeedbackMessage(data.suggestion.message);
    });

    return () => {
      socket.off("suggestion");
      socket.off("submit_answer");
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
          <Countdown
            date={dateStarted.current + 60000 * 30}
            className="Countdown"
          />

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
          <div className="ProblemStatement">
            <h2>Problem Statement</h2>
            <p>{selectedProblemStatement}</p>
          </div>
          {isLoadingSuggestions && (
            <p className="loadingMessage">CapyCode is writing...</p>
          )}
          <div className="ChatContent">
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
      </div>

      <div className="SubmissionButton">
        <button
          className="startBtn"
          onClick={() => setOpenSubmission(true)}
          disabled={isLoadingSuggestions}
        >
          Submit my solution
        </button>
      </div>
      <Modal
        open={openSubmission}
        onClose={() => setOpenSubmission(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!isSubmitting ? (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to submit?
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                CapyCode will evaluate your code and give you a feedback
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Good luck!
              </Typography>
              <button
                className="startBtn"
                onClick={() => {
                  socket.emit("user-submit-code", {
                    code: value,
                    id_user: id_user,
                    problem: selectedProblemStatement,
                  });
                  setIsSubmitting(true);
                }}
              >
                Submit my solution
              </button>
            </>
          ) : (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              CapyCode is evaluating your code...
            </Typography>
          )}
        </Box>
      </Modal>
      <Modal open={feedbackMessage} onClose={() => window.location.reload()}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Feedback
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {feedbackMessage}
          </Typography>
          <button className="startBtn" onClick={() => window.location.reload()}>
            Close this window
          </button>
        </Box>
      </Modal>
    </>
  );
}

export default Editor;
