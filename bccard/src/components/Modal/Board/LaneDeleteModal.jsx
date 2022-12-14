import React from "react";
import { LoadingButton } from "@mui/lab";
import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * 컨테이너 삭제 모달창
 */

function LaneDeleteModal(props) {
  const { title, onDelete, open, onClose } = props;
  const handleOnClick = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>컨테이너 삭제</DialogTitle>
      <DialogContent>정말 "{title}" 컨테이너를 삭제하시겠습니까?</DialogContent>
      <DialogActions>
        <LoadingButton onClick={handleOnClick} variant="contained">
          삭제
        </LoadingButton>
        <Button variant="outlined" onClick={onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LaneDeleteModal;
