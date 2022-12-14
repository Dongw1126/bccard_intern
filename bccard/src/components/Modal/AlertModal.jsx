import React from "react";
import { LoadingButton } from "@mui/lab";
import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";
import * as Constants from "../../constants";

/**
 * 알림창 Modal 창
 */

function AlertModal(props) {
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.content}</DialogContent>
      <DialogActions>
        <LoadingButton
          loading={props.loading}
          variant="contained"
          onClick={props.buttonOnClick}
        >
          {props.buttonText}
        </LoadingButton>
        <Button variant="outlined" onClick={props.onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertModal;
