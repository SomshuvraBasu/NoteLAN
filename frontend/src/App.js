import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "react-monaco-editor";

function App() {
  const [code, setCode] = useState("// Start editing...");
  const socket = useRef(null);

  // WebSocket connection to the Go backend
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080/ws");

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCode(data);
    };

    return () => socket.current.close();
  }, []);

  const handleEditorChange = (newValue) => {
    setCode(newValue);
    if (socket.current) {
      socket.current.send(JSON.stringify(newValue));
    }
  };

  // Options for Monaco Editor
  const editorOptions = {
    fontFamily: "Fira Code, monospace", // Customize font
    fontSize: 16,                      // Customize font size
    lineNumbers: "on",                 // Show line numbers (can be "off", "relative", etc.)
    automaticLayout: true,             // Ensures the editor resizes automatically
    minimap: {
      enabled: true,                   // Enable/disable minimap on the right side
    },
    cursorStyle: "line",               // Cursor style (can be "block", "underline", etc.)
    wordWrap: "on",                    // Enable word wrapping
    theme: "vs-dark",                  // Set theme to dark
  };

  return (
    <div style={{ height: "100vh" }}>
      <MonacoEditor
        width="100%"
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={editorOptions}   // Pass the options to the editor
      />
    </div>
  );
}

export default App;
