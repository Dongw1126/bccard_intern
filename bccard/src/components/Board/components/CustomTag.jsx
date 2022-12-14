import React from "react";
import Chip from "@mui/material/Chip";

function CustomTag(props) {
  const { title, color, bgColor } = props;
  return (
    <div>
      <Chip
        label={title}
        size="small"
        sx={{
          color: color,
          userSelect: "none",
          backgroundColor: bgColor,
          marginRight: 0.3,
          marginBottom: 0.3,
        }}
      />
    </div>
  );
}

export default CustomTag;
