import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import "./NewLaneForm.css";
import styles from "./NewLaneForm.module.css";

function NewLaneForm(props) {
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef(null);
  const { onCancel, t } = props;

  const handleAdd = () => {
    if (inputRef?.current.value.length === 0) {
      setInvalid(true);
      return;
    }
    props.onAdd({ id: uuidv4(), title: inputRef.current.value });
  };

  return (
    <div className={styles.root}>
      <TextField
        inputRef={inputRef}
        error={invalid}
        helperText={invalid ? "타이틀을 입력해주세요" : ""}
        label={t("placeholder.title")}
        size="small"
        variant="filled"
        autoFocus
      />
      <div className={styles.buttonGroup}>
        <ButtonGroup fullWidth variant="contained">
          <Button sx={{ width: "180%" }} onClick={handleAdd}>
            {t("button.Add lane")}
          </Button>
          <Button onClick={onCancel}>{t("button.Cancel")}</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
export default NewLaneForm;
