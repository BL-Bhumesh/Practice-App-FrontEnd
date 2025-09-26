import { Box, CircularProgress, Divider, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getQuestions } from '../services/questionService';
import ReactMarkdown from 'react-markdown';

function ProblemPanel() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

     useEffect(() => {
    getQuestions('ASSIGNMENT', 0, 1)
      .then((res) => {
        if (res.data?.payload?.length) {
          setQuestion(res.data.payload[0]);
        } else {
          setError('No question found.');
        }
      })
      .catch((err) => setError(err.message || 'Error fetching question'))
      .finally(() => setLoading(false));
  }, []);


    return (
        <Box sx={{
            width: '20%', height: '84%', border: '1px solid #ccc', borderRadius: '6px', margin: 2,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            backgroundColor: '#fafafa'
        }}>
            <Typography variant="h6" fontWeight="bold">
                Problem Statement
            </Typography>
            <Divider />

            {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
          {/* stem_md from API */}
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-line', mb: 1 }}
          >
            <ReactMarkdown>{question.stem_md}</ReactMarkdown>
          </Typography>

          <Divider />

          <Typography variant="subtitle1" fontWeight="bold" mt={1}>
            Hint
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            <ReactMarkdown>{question.solution_md}</ReactMarkdown>
          </Typography>
        </>
      )}

        </Box>
    )
}

export default ProblemPanel
