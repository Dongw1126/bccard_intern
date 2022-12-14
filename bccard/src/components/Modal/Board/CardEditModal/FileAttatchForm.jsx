import React, { useEffect, useState } from "react";
import { DataStore, Storage } from "aws-amplify";
import { LoadingButton } from "@mui/lab";
import { Button, IconButton } from "@mui/material";
import { Input } from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";

import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import useDialog from "../../../../hooks/useDialog";

import { v4 as uuidv4 } from "uuid";

import * as ku from "../../../Board/KanbanBoardUtils";
import styles from "./FileAttatchForm.module.css";
import * as Constants from "../../../../constants";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener("click", clickHandler);
    }, 150);
  };
  a.addEventListener("click", clickHandler, false);
  a.click();
  return a;
}

function FileAttatchForm(props) {
  const { newAttatchments, setNewAttatchments, handleFileUpdateEvent } = props;
  useEffect(() => {
    handleFileUpdateEvent();
  }, [newAttatchments]);

  const [loading, setLoading] = useState(false);
  const [currFile, setCurrFile] = useState(null);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("파일이 없습니다.");
  const [adding, setAdding] = useState(false);

  const fileValidation = (_file) => {
    // console.log(_file);
    if (typeof _file === "undefined") {
      setCurrFile(null);
      setError(false);
      setErrMsg("파일이 없습니다");
    } else if (_file.size > Constants.ATTATCHMENT_SIZE_LIMIT) {
      setCurrFile(null);
      setError(true);
      setErrMsg("파일이 너무 큽니다. (30MB 초과)");
    } else {
      // 정상 파일 업로드
      setCurrFile(_file);
      setError(false);
      setErrMsg("");
    }
  };

  const fileUploadS3 = async (filename) => {
    setLoading(true);
    const fileId = uuidv4();
    let srcUrl = null;
    if (!error) {
      if (currFile) {
        // console.log("clicked with file");
        const newKey = Constants.ATTATCHMENT_PATH + fileId;
        const result = await Storage.put(newKey, currFile, {
          contentType: currFile.type,
        });

        srcUrl = await ku.getAvatarSrc(result.key);
      }
    }
    setLoading(false);

    return {
      id: fileId,
      filename: filename,
      fileSrc: srcUrl,
    };
  };

  const handleFileOnChange = (e) => {
    const file = e.target.files[0];
    fileValidation(file);
  };

  const handleUpload = () => {
    fileUploadS3(currFile.name).then((res) =>
      setNewAttatchments((prev) => [...prev, res])
    );

    handleCancel();
  };

  const handleFileDelete = async (file) => {
    setLoading(true);
    await Storage.remove(ku.getS3Key(file.fileSrc));
    setNewAttatchments((prev) => prev.filter((x) => x.id !== file.id));
    setLoading(false);
  };

  const handleFileDownload = async (file) => {
    const s3Key = ku.getS3Key(file.fileSrc);
    const result = await Storage.get(s3Key, { download: true });
    downloadBlob(result.Body, file.filename);
  };

  const handleCancel = () => {
    setAdding(false);
    setCurrFile(null);
    setError(false);
  };

  return (
    <>
      <div className={styles.root}>
        <FormLabel component="legend">첨부 파일</FormLabel>
        <div className={styles.attatchmentsContainer}>
          {newAttatchments.map((x) => (
            <div key={x.id} className={styles.attatchments}>
              <div>
                <AttachFileIcon sx={{ mr: 0.5 }} fontSize="small" />
                <span>{x.filename}</span>
              </div>
              <div>
                <IconButton onClick={() => handleFileDownload(x)}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleFileDelete(x)}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        {adding ? (
          <div className={styles.formContainer}>
            <FormControl error={error}>
              <Input type="file" onChange={handleFileOnChange} />
              <FormHelperText>{errMsg}</FormHelperText>
            </FormControl>
            <div className={styles.formButtonContainer}>
              <LoadingButton
                size="small"
                disabled={error || currFile === null}
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
            <FileUploadIcon fontSize="small" sx={{ mr: 0.5 }} />
            파일 첨부하기
          </Button>
        )}
      </div>
    </>
  );
}

export default FileAttatchForm;
