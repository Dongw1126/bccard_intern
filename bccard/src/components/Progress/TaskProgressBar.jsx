import * as React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TaskProgressBar({ progress }) {
  const CustomProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    padding: 0,
    margin: 0,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#c2c2c2",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "var(--main-color)",
    },
  }));

  return (
    <>
      {!isNaN(progress) && (
        <Box sx={{ width: "100%" }}>
          <CustomProgress variant="determinate" value={progress} />
        </Box>
      )}
    </>
  );
}

export default TaskProgressBar;
