import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import SaButton from '../SaButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { submitAnswer } from '../../services/solutionServices';

const generateRandomUserId = () => {
  return 'Rj' + Math.floor(10000000 + Math.random() * 90000000);
};

const CodeEditor = ({ onRun, onReviewGenerated, question }) => {
  const [code, setCode] = useState('public class MyClass {\n    public static void main(String[] args) {\n           }\n}');
   const [editorTheme, setEditorTheme] = useState('vs-dark');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [userId] = useState(generateRandomUserId);


  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  const handleRunClick = () => {
    
    if (onRun) onRun(code);
  };

  
  const handleSaveClick = () => {
    
    alert("Saved code:\n" + code);
  };

  // const handleSubmitClick = () => {
    
  //   alert("Submitted code:\n" + code);
  // };

  const escapeCodeForJSON = (str) => {
    return JSON.stringify(str).slice(1, -1); 
  };


  
const handleSubmitClick = () => {
  setIsSubmitting(true);
    const payload = {
      question_text: question?.stem_md,
      answer_text: escapeCodeForJSON(code),
      question_id: question?.id,
      coe_name: 'SRM',
      program_name: 'STEP',
      semester: '3',
      // user_id: 'Rj1234111145',
      user_id: userId,
      module: 'OOPS',
    };

    submitAnswer(payload)
      .then((res) => {
        console.log('Response:', res.data);
        // call back up to parent
        if (onReviewGenerated) {
          onReviewGenerated(res.data.payload.review_generated);
        }
      })
      .catch((err) => {
      console.error('Error submitting answer:', err);
      // if you want to re-enable on error:
      setIsSubmitting(false);
    });
  };

  const toggleTheme = () => {
    setEditorTheme((prev) => (prev === 'vs-dark' ? 'vs-light' : 'vs-dark'));
  };

  return (
  
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          borderBottom: "1px solid #ccc",
          p: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
         <Typography variant="h6" fontWeight="italic">
          Code Editor
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleTheme} size="small">
            {editorTheme === 'vs-dark' ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>
           <SaButton width='100px'  onClick={handleRunClick}>
          Run Code
        </SaButton>
        </Box>
       
      </Stack>
      <Box sx={{ flex: 1 }}>
        <Editor
          language="java"
          theme={editorTheme} 
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </Box>

      <Stack
        direction="row"
        spacing={6}
        sx={{
          borderTop: "1px solid #ccc",
          p: 1,
          backgroundColor: "#f5f5f5",
          display:'flex',
          justifyContent:'center'
        }}
      >
        <SaButton  onClick={handleSaveClick}>
          Save
        </SaButton>
        <SaButton  disabled={isSubmitting} variant="contained" size="small" onClick={handleSubmitClick}>
          Submit
        </SaButton>
      </Stack>
    </Box>

  );
};

export default CodeEditor;