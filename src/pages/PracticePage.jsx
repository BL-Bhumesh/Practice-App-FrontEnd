import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SaButton from '../components/SaButton'
import ProblemPanel from '../components/ProblemPanel'
import CodeEditor from '../components/Editor/CodeEditor'
import SolutionPanel from '../components/SolutionPanel'
import { getQuestions } from '../services/questionService'



function PracticePage() {
  const [programOutput, setProgramOutput] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState("");
  

  const handleRunCode = (code) => {
    setProgramOutput("Running...\n\n" + code);
  };

  // Called when submitAnswer returns review_generated in editor
  const handleReviewGenerated = (review) => {
    setReviewData(review);
  };
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
    console.log(question);

  return (
    <Box sx={{width:'100vw',height:'100vh',display:'flex',
        alignItems: 'flex-start',}}>
      <ProblemPanel question={question} />
      <Box sx={{ marginTop: '16px', width:'50%',height:"87%" }}>
      <CodeEditor
          onRun={handleRunCode}
          onReviewGenerated={handleReviewGenerated} // pass callback down
          question={question}
        />
      </Box>
      <SolutionPanel output={programOutput} review={reviewData}  />
    
    </Box>
    
    
  )
}

export default PracticePage
