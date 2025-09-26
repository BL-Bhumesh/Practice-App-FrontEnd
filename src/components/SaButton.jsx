import React from "react";

const SaButton = ({
  width = "150px",
  height = "40px",
  fontSize = "18px",
  onClick,
  children,
  style = {}
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width,
        height,
        // backgroundColor: "#90EE90", 
      backgroundColor: "#43a047",
        color: "#fff",              
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize,
        // fontWeight: "bold",
        
        ...style 
      }}
    >
      {children}
    </button>
  );
};

export default SaButton;
