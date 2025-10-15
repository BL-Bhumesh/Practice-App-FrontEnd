import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, IconButton, Stack, Typography, TextField } from '@mui/material';
import SaButton from '../SaButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { submitAnswer } from '../../services/solutionServices';

const generateRandomUserId = () => {
  return 'Rj' + Math.floor(10000000 + Math.random() * 90000000);
};

const CodeEditor = ({ onRun, onReviewGenerated, question, prompt,answerType,questionType }) => {
  console.log(answerType,"Answer Type")
  console.log(questionType,"questionType ")
  const [code, setCode] = useState(
    'public class Main {\n    public static void main(String[] args) {\n           }\n}'
  );

  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutputTerminal, setShowOutputTerminal] = useState(false);
  const [userId] = useState(generateRandomUserId);

  // --- WebSocket related states ---
  const wsRef = useRef(null);
  const [output, setOutput] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);


  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  // Append output safely
  const appendOutput = (text) => {
    setOutput((prev) => prev + text);
  };

  // Run Code: open WS, send code, handle input/output
 const handleRunClick = () => {
  if (!code.trim()) {
    alert('No code to run!');
    return;
  }

  // 🧹 1. Reset previous output
  setOutput('');

  // 🧹 2. Close old WebSocket if still open
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.close();
  }

  // 🖥️ 3. Show the terminal
  setShowOutputTerminal(true);
  setIsRunning(true);

  // 🌐 4. Create new WebSocket connection
  wsRef.current = new WebSocket('ws://52.66.201.120:8000/ws/execute_java/');

  wsRef.current.onopen = () => {
    wsRef.current.send(JSON.stringify({ code }));
    setWsConnected(true);
  };

  wsRef.current.onmessage = (event) => {
    appendOutput(event.data);
  };
 
  wsRef.current.onclose = () => {
    // appendOutput('\n🔌 Connection closed.\n');
    setWsConnected(false);
    setIsRunning(false);
  };

  wsRef.current.onerror = (error) => {
    // appendOutput(`\n❌ WebSocket error occurred\n`);
    setWsConnected(false);
    setIsRunning(false);
  };
};


  // Handle input text change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Send input to WS on Enter key
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && wsConnected && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(inputValue);
      setInputValue('');
    }
  };

  // Close WS connection when Exit clicked
  const handleExitClick = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('exit');
      wsRef.current.close();
      setShowOutputTerminal(false);
    }
  };

  // Cleanup WS on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSaveClick = () => {
    alert('Saved code:\n' + code);
  };

  const escapeCodeForJSON = (str) => {
    return JSON.stringify(str).slice(1, -1);
  };

  const handleSubmitClick = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const payload = {
      prompt: prompt,
      question_text: question?.stem_md,
      question_type: questionType,
      answer_text: escapeCodeForJSON(code),
      answer_type:answerType,
      question_id: question?.id,
      coe_name: 'SRM',
      program_name: 'STEP',
      semester: '3',
      user_id: userId,
      module: 'OOPS',
    };

    console.log(payload,"Payload Submitting")

    submitAnswer(payload)
      .then((res) => {
        if (onReviewGenerated) {
          onReviewGenerated(res.data.payload.review_generated);
        }
      })
      .catch(() => {
        // error handling
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const toggleTheme = () => {
    setEditorTheme((prev) => (prev === 'vs-dark' ? 'vs-light' : 'vs-dark'));
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: 1,
        bgcolor: '#f9f9f9',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          borderBottom: '1px solid #ccc',
          p: 1,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="h6" fontWeight="italic">
          Code Editor
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleTheme} size="small">
            {editorTheme === 'vs-dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
          <SaButton width="100px" onClick={handleRunClick} disabled={isRunning}>
            Run Code
          </SaButton>
          {/* <Button
            variant="outlined"
            color="error"
            onClick={handleExitClick}
            disabled={!wsConnected}
            sx={{ height: 36 }}
          >
            Exit
          </Button> */}
        </Box>
      </Stack>

<Box
  sx={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '500px', // or 100% of parent container (adjust as needed)
    gap: 1,
  }}
>
  <Box
    sx={{
      flex: showOutputTerminal ? 1 : 1, // full height when no terminal, half height when terminal shown
      minHeight: 0, // important for flex child scroll behavior
      overflow: 'hidden',
    }}
  >
    <Editor
      language="java"
      theme={editorTheme}
      value={code}
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
      }}
      height="100%" // fill container height
    />
  </Box>

  {showOutputTerminal && (
    <Box
      sx={{
        flex: 1,
        bgcolor: '#000',
        color: '#0f0',
        p: 1,
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        border: '1px solid #555',
        fontFamily: 'monospace',
        fontSize: 14,
        mt: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
  <Box
  sx={{
    flex: 1,
    bgcolor: '#000',
    color: '#0f0',
    p: 1,
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    // border: '1px solid #555',
    fontFamily: 'monospace',
    fontSize: 14,
    // mt: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  }}
>
  {/* 🔸 Exit button aligned to top right */}
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0 }}>
    <Button
      variant="outlined"
      color="error"
      onClick={handleExitClick}
      disabled={!wsConnected}
      sx={{ height: 36 }}
    >
      Exit
    </Button>
  </Box>

  {/* 🔸 Terminal output below */}
  <Box sx={{ flex: 1, overflowY: 'auto' }}>
    {output}
  </Box>
</Box>


      <TextField
        disabled={!wsConnected}
        placeholder="Type input here and press Enter"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        variant="outlined"
        size="small"
        sx={{
          bgcolor: '#2e2e2e',
          mt: 1,
          borderRadius: 1,
          '& .MuiInputBase-input': {
            color: '#f5f5f5',
            fontFamily: 'monospace',
          },
          border: '1px solid #555',
        }}
        fullWidth
      />
    </Box>
  )}
</Box>


      <Stack
        direction="row"
        spacing={6}
        sx={{
          borderTop: '1px solid #ccc',
          p: 1,
          backgroundColor: '#f5f5f5',
          justifyContent: 'center',
          mt: 1,
        }}
      >
        <SaButton onClick={handleSaveClick}>Save</SaButton>
        <SaButton
          disabled={isSubmitting}
          variant="contained"
          size="small"
          onClick={handleSubmitClick}
          sx={{
            '&.Mui-disabled': {
              cursor: 'default', // override default not-allowed cursor
            },
          }}
        >
          Submit
        </SaButton>
      </Stack>
    </Box>
  );
};

export default CodeEditor;
