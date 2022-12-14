import * as React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function ContainerProgressBar({ progress }) {
  const CustomProgress = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#EAEAEA",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "var(--main-color)",
    },
  }));

  return (
    <>
      {!isNaN(progress) && (
        <Box sx={{ width: "100%", my: 0.5 }}>
          <CustomProgress variant="determinate" value={progress} />
        </Box>
      )}
    </>
  );
}

export default ContainerProgressBar;
