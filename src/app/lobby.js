/* eslint-disable @next/next/no-img-element */
"use client";
import "./globals.css";
import { useState, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import io from "socket.io-client";
import { Lobby } from "./lobby.js";

function landing() {
  <body>
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
  </body>;
}

export default landing;
