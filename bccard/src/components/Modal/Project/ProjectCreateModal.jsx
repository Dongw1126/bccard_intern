import React, { useEffect, useState, useRef } from "react";
import { LoadingButton } from "@mui/lab";
import { DataStore } from "aws-amplify";
import { Project, MyProject } from "../../../models";

import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import useDialog from "../../../hooks/useDialog";
import EmojiPickerModal from "../EmojiPickerModal";

import { useAtom } from "jotai";
import { userAtom } from "../../../stores/userStore";

import styles from "./ProjectCreateModal.module.css";
import * as Constants from "../../../constants";

/**
 * 프로젝트 생성 Modal 창
 */
function ProjectCreateModal(props) {
  const [currentUser] = useAtom(userAtom);
  const { user } = currentUser;

  const { title, open, onClose, setRefresh } = props;
  const userId = user.username;

  const [loading, setLoading] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const titleRef = useRef(null);
  const descRef = useRef(null);
  const [inputDate, setInputDate] = useState(null);

  const [emojiOpen, handleEmojiOpen, handleEmojiClose] = useDialog();

  const handleAddEmoji = () => {
    setChosenEmoji(null);
    handleEmojiOpen();
  };

  const handleClose = () => {
    onClose();
    setChosenEmoji(null);
    setInputDate(null);
  };

  // 프로젝트 저장
  const saveProject = async () => {
    setLoading(true);

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      // 프로젝트 데이터 저장
      const p = await DataStore.save(
        new Project({
          users: [userId],
          emoji: chosenEmoji,
          title: titleRef?.current.value,
          description: descRef?.current.value,
          deadline: inputDate ? inputDate.toISOString().split("T")[0] : null,
        })
      );

      // 마이 프로젝트 업데이트
      await DataStore.save(
        new MyProject({
          userId: userId,
          project: p.id,
        })
      );
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
    setRefresh((prev) => !prev);
  };

  const handleEvent = async () => {
    await saveProject();
    handleClose();
  };

  return (
    <>
      <div>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>{title}</DialogTitle>
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
              fullWidth
              variant="standard"
            />
            <TextField
              inputRef={descRef}
              sx={{ mt: 5 }}
              rows={5}
              id="description"
              label="프로젝트 설명"
              type="text"
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

export default ProjectCreateModal;
