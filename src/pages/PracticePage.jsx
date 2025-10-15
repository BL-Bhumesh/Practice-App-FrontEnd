import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SaButton from "../components/SaButton";
import ProblemPanel from "../components/ProblemPanel";
import CodeEditor from "../components/Editor/CodeEditor";
import SolutionPanel from "../components/SolutionPanel";
import { getQuestions } from "../services/questionService";
import { getPrompt } from "../services/promptServices";
import PromptDialog from "../components/PromptDialog";

function PracticePage() {
  const [answerType, setAnswerType] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [programOutput, setProgramOutput] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [question, setQuestion] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);

  const handleRunCode = (code) => setProgramOutput("Running...\n\n" + code);
  const handleReviewGenerated = (review) => setReviewData(review);

  const openPromptDialog = () => setShowPromptDialog(true);
  const closePromptDialog = () => setShowPromptDialog(false);
  const updatePrompt = (val) => setPrompt(val);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const answer = Math.random() < 0.5 ? "CODE" : "TEXT";
    setAnswerType(answer);
    // console.log("Selected answer type:", answer);

    Promise.all([getQuestions(answer, 0, 1), getPrompt(answer)])
      .then(([qRes, pRes]) => {
        
        const questionData = qRes.data?.payload?.[0];
         let answerType = qRes.data.payload[0].answer_type || "";
         let questionType = qRes.data.payload[0].question_type || "";
        setAnswerType(answerType);
        setQuestionType(questionType);
        let promptData = "";

        if (answer === "CODE") {
          promptData = pRes.data?.payload?.default_code_check_prompt || "";
        } else {
          promptData = pRes.data?.payload?.default_theory_check_prompt || "";
        }

        if (!questionData) setError("No question found.");
        if (!promptData) setError("No prompt found.");


        setQuestion(questionData || null);
        setPrompt(promptData || "");
        localStorage.setItem('promptData', JSON.stringify(promptData));
      })
      .catch((e) => setError(e.message || "Error fetching data"))
      .finally(() => setLoading(false));
  }, []); // run only on refresh

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <ProblemPanel
        question={question}
        loading={loading}
        error={error}
        openPromptDialog={openPromptDialog}
      />

      <Box sx={{ marginTop: "16px", width: "50%", height: "87%" }}>
        <CodeEditor
          onRun={handleRunCode}
          onReviewGenerated={handleReviewGenerated}
          question={question}
          prompt={prompt}
          answerType={answerType}
          questionType={questionType}
        />
      </Box>
      <SolutionPanel output={programOutput} review={reviewData} />

      <PromptDialog
        open={showPromptDialog}
        onClose={closePromptDialog}
        prompt={prompt}
        updatePrompt={updatePrompt}
      />
    </Box>
  );
}

export default PracticePage;
