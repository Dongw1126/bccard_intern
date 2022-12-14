import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TaskProgressBar from "../../../Progress/TaskProgressBar";
import TextField from "@mui/material/TextField";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { Button, IconButton } from "@mui/material";
import styles from "./TaskCheckBoxForm.module.css";

import { Box } from "@mui/material";

const iconSx = { width: 20, height: 20 };

function TaskCheckBoxForm(props) {
  const { newTasks, setNewTasks } = props;
  const [adding, setAdding] = useState(false);

  const handleCheckDelete = (taskId) => {
    setNewTasks(newTasks.filter((task) => task.id !== taskId));
  };

  const handleCheck = (taskId) => {
    setNewTasks(
      newTasks.map((x) => {
        if (x.id === taskId) {
          return {
            ...x,
            complete: !x.complete,
          };
        } else {
          return x;
        }
      })
    );
  };

  return (
    <FormControl
      sx={{ mt: 4, width: "100%" }}
      component="fieldset"
      variant="standard"
    >
      <FormLabel component="legend">할 일</FormLabel>
      {newTasks && (
        <Box sx={{ my: 1 }}>
          <TaskProgressBar
            progress={
              (newTasks.filter((x) => x.complete).length / newTasks.length) *
              100
            }
          />
        </Box>
      )}
      <FormGroup>
        {newTasks.map((task) => (
          <div className={styles.checkBoxContainer} key={task.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={task.complete}
                  onChange={() => handleCheck(task.id)}
                  name={task.id}
                />
              }
              label={<>{task.title}</>}
            />
            <IconButton
              onClick={() => handleCheckDelete(task.id)}
              sx={{ ...iconSx, mr: 1 }}
            >
              <ClearIcon sx={{ ...iconSx }} />
            </IconButton>
          </div>
        ))}
        {adding ? (
          <div>
            <InlineTaskForm setNewTasks={setNewTasks} setAdding={setAdding} />
          </div>
        ) : (
          <div className={styles.addButton}>
            <Button
              onClick={() => setAdding(true)}
              variant="outlined"
              size="small"
            >
              <AddIcon sx={{ ...iconSx, mr: 1 }} />할 일 추가하기
            </Button>
          </div>
        )}
      </FormGroup>
    </FormControl>
  );
}

function InlineTaskForm(props) {
  const { setNewTasks, setAdding } = props;
  const inputRef = useRef(null);

  const handleOnClick = () => {
    setNewTasks((prev) => [
      ...prev,
      { id: uuidv4(), title: inputRef?.current.value, complete: false },
    ]);
    setAdding(false);
  };

  return (
    <span>
      <TextField
        inputRef={inputRef}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleOnClick();
        }}
        size="small"
        autoFocus
      />
      <Button onClick={handleOnClick}>저장</Button>
      <Button onClick={() => setAdding(false)}>취소</Button>
    </span>
  );
}

export default TaskCheckBoxForm;
