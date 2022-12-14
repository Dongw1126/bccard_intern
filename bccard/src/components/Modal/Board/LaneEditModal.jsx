import React, { useRef } from "react";
import { LoadingButton } from "@mui/lab";
import TextField from "@mui/material/TextField";
import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * 컨테이너 편집 모달창
 */

function LaneEditModal(props) {
  const { title, updateTitle, open, onClose } = props;
  const inputRef = useRef(null);
  const handleOnClick = () => {
    const newTitle = inputRef?.current.value;
    updateTitle(newTitle);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>컨테이너 편집</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={inputRef}
          autoFocus
          id="name"
          label="컨테이너 이름"
          type="text"
          defaultValue={title}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={handleOnClick} variant="contained">
          확인
        </LoadingButton>
        <Button variant="outlined" onClick={onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LaneEditModal;
