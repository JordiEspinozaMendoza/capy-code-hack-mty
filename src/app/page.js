"use client";
import "./globals.css";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import { MessageBox, Avatar } from "react-chat-elements";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function Editor() {
  //Code Editor
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log("val:", val);
    setValue(val);
  }, []);
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
          <MessageBox
            position={"rights"}
            type={"text"}
            text={"Hello user"}
            title={"CapyCode"}
            dateString={"Fri May 08 2020"}
            avatar="capybara.png"
          />
        </div>
      </div>
    </>
  );
}
export default Editor;
