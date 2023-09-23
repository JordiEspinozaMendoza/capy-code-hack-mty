"use client";
import "./globals.css";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import "react-chat-elements/dist/main.css";
import { MessageBox } from "react-chat-elements";

function Editor() {
  //Code Editor
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log("val:", val);
    setValue(val);
  }, []);
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
