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
  const [programOutput, setProgramOutput] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [question, setQuestion] = useState(null);
  const [prompt, setPrompt] = useState("\nYou are a code quality reviewer. Analyze the following {language} code in the context of the given question and return ONLY valid JSON in the format below:\n\n{{\n    \"Question\": \"{question}\",\n    \"Code_Analysis\": {{\n        \"What_worked_well\": \"<text>\",\n        \"What_can_be_improved\": \"<text>\"\n    }},\n    \"Code_Quality_Qualitative\": {{\n        \"Correctness\": \"<text>\",\n        \"Readability\": \"<text>\",\n        \"Maintainability\": \"<text>\",\n        \"Design\": \"<text>\",\n        \"Scalability\": \"<text>\"\n    }},\n    \"Code_Quality_Quantitative\": {{\n        \"Correctness\": <1-10>,\n        \"Readability\": <1-10>,\n        \"Maintainability\": <1-10>,\n        \"Design\": <1-10>,\n        \"Scalability\": <1-10>,\n        \"Overall\": <1-10>\n    }}\n}}\n\nQuestion:\n{question}\n\nCode:\n{code}\nx`");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState("");
  const [showPromptDialog, setShowPromptDialog] = useState(false);

  const handleRunCode = (code) => {
    setProgramOutput("Running...\n\n" + code);
  };

  const openPromptDialog = () => {
  setShowPromptDialog(true);
};

const closePromptDialog = () => {
  setShowPromptDialog(false);
};

const updatePrompt=(prompt)=>{
setPrompt(prompt)
console.log("Updated Prompt ",prompt);
}

  const handleReviewGenerated = (review) => {
    setReviewData(review);
  };
  useEffect(() => {
    getQuestions("ASSIGNMENT", 0, 1)
      .then((res) => {
        if (res.data?.payload?.length) {
          setQuestion(res.data.payload[0]);
        } else {
          setError("No question found.");
        }
      })
      .catch((err) => setError(err.message || "Error fetching question"))
      .finally(() => setLoading(false));

    getPrompt()
      .then((res) => {
        const prompt =
          res.data?.default_prompt ||
          res.data?.payload?.[0]?.default_prompt || null;
     
        if (prompt) {
          setPrompt(prompt);
        } else {
          setError("No Prompt found.");
        }
      })
      .catch((err) => setError(err.message || "Error fetching Prompt"))
      .finally(() => setLoading(false));
  }, []);
  // console.log(question);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <ProblemPanel question={question}  openPromptDialog={openPromptDialog}/>
      <Box sx={{ marginTop: "16px", width: "50%", height: "87%" }}>
        <CodeEditor
          onRun={handleRunCode}
          onReviewGenerated={handleReviewGenerated}
          question={question}
          prompt={prompt}  
        />
      </Box>
      <SolutionPanel output={programOutput} review={reviewData} />
      <PromptDialog open={showPromptDialog} onClose={closePromptDialog} prompt={prompt} updatePrompt={updatePrompt}/>
    </Box>
  );
}

export default PracticePage;
