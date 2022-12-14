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
 * 카드 삭제 모달창
 */

function CardDeleteModal(props) {
  const { editProps, open, onClose } = props;
  const handleOnClick = () => {
    if (editProps?.callback) {
      editProps.callback();
    }
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>카드 삭제</DialogTitle>
      <DialogContent>정말 삭제하시겠습니까?</DialogContent>
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

export default CardDeleteModal;
