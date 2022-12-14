import React, { useState, useRef } from "react";
import { LoadingButton } from "@mui/lab";
import { DataStore } from "aws-amplify";
import { Project } from "../../../models";

import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import useDialog from "../../../hooks/useDialog";
import EmojiPickerModal from "../EmojiPickerModal";

import styles from "./ProjectCreateModal.module.css";
import * as Constants from "../../../constants";

/**
 * 프로젝트 내용 편집 Modal 창
 */
function ProjectRenameModal(props) {
  const { project, open, onClose, setRefresh } = props;

  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const [inputDate, setInputDate] = useState(project.deadline);

  const [chosenEmoji, setChosenEmoji] = useState(project.emoji);
  const [emojiOpen, handleEmojiOpen, handleEmojiClose] = useDialog();

  const handleAddEmoji = () => {
    setChosenEmoji(null);
    handleEmojiOpen();
  };

  const handleClose = () => {
    setInputDate(project.deadline);
    onClose();
  };

  // 프로젝트 저장
  const updateProject = async () => {
    setLoading(true);
    try {
      // 프로젝트 데이터 업데이트
      const original = await DataStore.query(Project, project.id);
      await DataStore.save(
        Project.copyOf(original, (updated) => {
          updated.emoji = chosenEmoji;
          updated.title = titleRef?.current.value;
          updated.description = descRef?.current.value;
          updated.deadline = inputDate
            ? new Date(inputDate).toISOString().split("T")[0]
            : null;
        })
      );
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
    setRefresh((prev) => !prev);
  };

  const handleEvent = async () => {
    await updateProject();
    handleClose();
  };

  return (
    <>
      <div>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>프로젝트 내용 변경</DialogTitle>
          <DialogContent>
            <div>
              <div
                style={{
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                아이콘 추가하기
              </div>
              {chosenEmoji ? (
                <div className={styles.emojiIcon} onClick={handleAddEmoji}>
                  {chosenEmoji}
                </div>
              ) : (
                <IconButton onClick={handleAddEmoji}>
                  <AddIcon />
                </IconButton>
              )}
            </div>
            <TextField
              inputRef={titleRef}
              inputProps={{
                maxLength: Constants.MAX_PROJECT_NAME,
              }}
              autoFocus
              id="name"
              label="프로젝트 이름"
              type="text"
              defaultValue={project.title}
              fullWidth
              variant="standard"
            />
            <TextField
              inputRef={descRef}
              inputProps={{
                maxLength: Constants.MAX_PROJECT_DESCRIPTION,
              }}
              sx={{ mt: 5 }}
              rows={5}
              id="description"
              label="프로젝트 설명"
              type="text"
              defaultValue={project.description}
              fullWidth
              multiline
              variant="outlined"
            />
            <Box sx={{ mt: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="데드라인 설정"
                  mask="____/__/__"
                  inputFormat="yyyy/MM/dd"
                  value={inputDate}
                  onChange={(newDate) => setInputDate(newDate)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={loading}
              disabled={loading}
              variant="contained"
              onClick={handleEvent}
            >
              추가
            </LoadingButton>
            <Button variant="outlined" onClick={handleClose}>
              취소
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <EmojiPickerModal
        open={emojiOpen}
        onClose={handleEmojiClose}
        setChosenEmoji={setChosenEmoji}
      />
    </>
  );
}

export default ProjectRenameModal;
