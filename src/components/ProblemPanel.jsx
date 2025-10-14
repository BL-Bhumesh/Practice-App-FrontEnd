import {
  Box,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import SaButton from "./SaButton";

function ProblemPanel({ question, loading, error, openPromptDialog }) {
  return (
    <Box
      sx={{
        width: "20%",
        height: "84%",
        border: "1px solid #ccc",
        borderRadius: "6px",
        margin: 2,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1,
        backgroundColor: "#fafafa",
        overflowY: 'auto',
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Problem Statement
        </Typography>
        <Divider />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && !loading && (
          <Typography variant="body2" color="error">
            {error} 
          </Typography>
        )}

        {!loading && question && (
          <>
            <Typography variant="subtitle1" fontWeight="bold">
              Question:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 1 }}>
              <ReactMarkdown>{question.stem_md}</ReactMarkdown>
            </Typography>

            <Divider />

            <Typography variant="subtitle1" fontWeight="bold" mt={1}>
              Hint
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              <ReactMarkdown>{question.solution_md}</ReactMarkdown>
            </Typography>
          </>
        )}
      </Box>

      <Box>
        <SaButton onClick={openPromptDialog}>Show Prompt</SaButton>
      </Box>
    </Box>
  );
}

export default ProblemPanel;
