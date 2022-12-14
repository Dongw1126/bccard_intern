import React, { useEffect, useState } from "react";
import { DataStore, Storage } from "aws-amplify";
import { LoadingButton } from "@mui/lab";
import { Button, IconButton } from "@mui/material";
import { Input } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import { v4 as uuidv4 } from "uuid";

import * as ku from "../../../Board/KanbanBoardUtils";
import styles from "./FileAttatchForm.module.css";
import * as Constants from "../../../../constants";

function CoverImageForm(props) {
  const { newCover, setNewCover, handleCoverUpdateEvent } = props;

  const [loading, setLoading] = useState(false);
  const [currFile, setCurrFile] = useState(null);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState(
    "파일이 없으면 커버 이미지가 제거됩니다."
  );
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    console.log(newCover);
    handleCoverUpdateEvent();
  }, [newCover]);

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
    } else if (_file.size > Constants.COVER_SIZE_LIMIT) {
      setCurrFile(null);
      setError(true);
      setErrMsg("파일이 너무 큽니다. (3MB 초과)");
    } else {
      // 정상 파일 업로드
      setCurrFile(_file);
      setError(false);
      setErrMsg("");
    }
  };

  const fileUploadS3 = async () => {
    setLoading(true);
    let srcUrl = null;
    if (!error) {
      if (currFile) {
        // console.log("clicked with file");
        const newKey = Constants.COVER_PATH + uuidv4();
        const result = await Storage.put(newKey, currFile, {
          contentType: currFile.type,
        });

        srcUrl = await ku.getAvatarSrc(result.key);
      } else {
        // 파일 없으면 기본 이미지로
        srcUrl = null;
      }

      // 이미 이미지가 있는 경우 삭제
      if (newCover) {
        await Storage.remove(ku.getS3Key(newCover));
      }
    }

    setLoading(false);
    return srcUrl;
  };

  const handleFileOnChange = (e) => {
    const file = e.target.files[0];
    fileValidation(file);
  };

  const handleUpload = () => {
    fileUploadS3().then((res) => setNewCover(res));
    handleCancel();
  };

  const handleCancel = () => {
    setAdding(false);
    setCurrFile(null);
    setError(false);
  };

  return (
    <>
      <div className={styles.root}>
        <FormLabel component="legend">커버 이미지</FormLabel>
        {newCover && (
          <div>
            <img
              style={{
                maxWidth: "400px",
                maxHeight: "300px",
                objectFit: "contain",
              }}
              src={newCover}
              alt=""
            />
          </div>
        )}

        {adding ? (
          <div className={styles.formContainer}>
            <FormControl error={error}>
              <Input type="file" onChange={handleFileOnChange} />
              <FormHelperText>{errMsg}</FormHelperText>
            </FormControl>
            <div className={styles.formButtonContainer}>
              <LoadingButton
                size="small"
                disabled={error}
                loading={loading}
                variant="outlined"
                onClick={handleUpload}
              >
                추가
              </LoadingButton>
              <Button size="small" variant="standard" onClick={handleCancel}>
                취소
              </Button>
            </div>
          </div>
        ) : (
          <Button
            sx={{ mt: "15px" }}
            onClick={() => setAdding(true)}
            variant="outlined"
            size="small"
          >
            <AddIcon fontSize="small" sx={{ mr: 0.5 }} />
            {newCover ? "커버 바꾸기" : "커버 추가하기"}
          </Button>
        )}
      </div>
    </>
  );
}

export default CoverImageForm;
