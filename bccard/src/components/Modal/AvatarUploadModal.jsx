import React, { useEffect, useState } from "react";
import { DataStore, Storage } from "aws-amplify";
import { User } from "../../models";
import { LoadingButton } from "@mui/lab";
import {
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";
import { Input } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { v4 as uuidv4 } from "uuid";

import * as ku from "../Board/KanbanBoardUtils";
import * as Constants from "../../constants";

/**
 * 아바타 이미지 업로드 Modal 창
 */

function AvatarUploadModal(props) {
  const [loading, setLoading] = useState(false);
  const [currFile, setCurrFile] = useState(null);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState(
    "파일이 없으면 기본 이미지로 대체됩니다."
  );

  const fileValidation = (_file) => {
    // console.log(_file);
    if (typeof _file === "undefined") {
      setCurrFile(null);
      setError(false);
      setErrMsg("파일이 없으면 기본 프로필로 대체됩니다.");
    } else if (!_file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setCurrFile(null);
      setError(true);
      setErrMsg("이미지가 아닙니다. (jpg, jpeg, png, gif)");
    } else if (_file.size > Constants.AVATAR_IMAGE_SIZE_LIMIT) {
      setCurrFile(null);
      setError(true);
      setErrMsg("파일이 너무 큽니다. (30KB 초과)");
    } else {
      // 정상 파일 업로드
      setCurrFile(_file);
      setError(false);
      setErrMsg("");
    }
  };

  const fileUploadS3 = async () => {
    setLoading(true);
    if (!error && props.userInfo) {
      let srcUrl = null;

      if (currFile) {
        // console.log("clicked with file");
        const newKey = Constants.AVATAR_IMAGE_PATH + uuidv4();
        const result = await Storage.put(newKey, currFile, {
          contentType: currFile.type,
        });

        srcUrl = await ku.getAvatarSrc(result.key);
      } else {
        // 파일 없으면 기본 이미지로
        srcUrl = null;
      }

      // 이미 이미지가 있는 경우 삭제
      if (props.userInfo.avatar) {
        await Storage.remove(ku.getS3Key(props.userInfo.avatar));
      }

      await DataStore.save(
        User.copyOf(props.userInfo, (updated) => {
          updated.avatar = srcUrl;
        })
      );
    }
    setLoading(false);
  };

  const handleFileOnChange = (e) => {
    const file = e.target.files[0];
    fileValidation(file);
  };

  const handleUpload = () => {
    if (props.userInfo) {
      fileUploadS3()
        .then(() => props.setRefresh((prev) => !prev))
        .then(() => props.onClose())
        .catch(() => alert("프로필 변경 중 오류가 발생했습니다."));
    }
  };

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>프로필 이미지 변경</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "black", fontSize: "small" }}>
          권장 크기: 80 x 80 px
        </DialogContentText>
        <FormControl error={error}>
          <Input
            type="file"
            inputProps={{ accept: ".gif, .jpg, .jpeg, .png" }}
            onChange={handleFileOnChange}
          />
          <FormHelperText>{errMsg}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          disabled={error}
          loading={loading}
          variant="contained"
          onClick={handleUpload}
        >
          저장
        </LoadingButton>
        <Button variant="outlined" onClick={props.onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AvatarUploadModal;
