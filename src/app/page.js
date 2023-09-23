'use client';
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark, vscodeDarkInit } from '@uiw/codemirror-theme-vscode';

function Editor() {
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return <CodeMirror value={value} height="800px" width="100" extensions={[javascript({ jsx: true })]} onChange={onChange} theme={vscodeDark} />;
}
export default Editor;