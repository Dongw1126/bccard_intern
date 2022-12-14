import React from "react";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";

function KanbanSaveProgress(props) {
  return (
    <CircularProgress
      variant="indeterminate"
      disableShrink
      sx={{
        color: (theme) => theme.palette.grey[500],
        animationDuration: "550ms",
        left: 0,
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: "round",
        },
      }}
      size={20}
      thickness={6}
      {...props}
    />
  );
}

export default KanbanSaveProgress;
