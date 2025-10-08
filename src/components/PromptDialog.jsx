import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function PromptDialog({ open, onClose, prompt,updatePrompt }) {
  const [mode, setMode] = React.useState("default");
  const [textValue, setTextValue] = React.useState(prompt || "");
  console.log("Initial Prompt",prompt)
  console.log("Initial textValue",textValue)


  // Update text when prompt prop changes
  React.useEffect(() => {
    setTextValue(prompt || "");
  }, []);

  const handleSave = () => {
    console.log("Saved prompt:", textValue);
    updatePrompt(textValue)
    onClose();
  };

   const handleClose = () => {
    // console.log("Saved prompt:", textValue);
    setTextValue(prompt)
    onClose();
  };


  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Prompt Editor
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            minHeight: "400px",
          }}
        >
          {/* Left side: select */}
          <Box sx={{ width: "25%", display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Select Prompt Type
            </Typography>
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              size="small"
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </Box>

          {/* Right side: text area */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Prompt Content
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={20}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              InputProps={{
                readOnly: mode === "default",
              }}
              sx={{
                fontFamily: "monospace",
                backgroundColor:
                  mode === "default" ? "#f5f5f5" : "background.paper",
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="success">
          Save
        </Button>
        <Button onClick={handleClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
