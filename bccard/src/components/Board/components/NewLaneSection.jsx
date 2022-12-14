import React from "react";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material";
import styles from "./NewLaneSection.module.css";

function NewLaneSection(props) {
  const { t, onClick } = props;
  return (
    <div className={styles.root}>
      <Button variant="contained" onClick={onClick}>
        {t("Add another lane")}
      </Button>
    </div>
  );
}

export default NewLaneSection;
