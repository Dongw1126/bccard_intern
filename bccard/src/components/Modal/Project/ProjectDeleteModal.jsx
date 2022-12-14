import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { DataStore } from "aws-amplify";
import { Project, MyProject } from "../../../models";

import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";

import { useAtom } from "jotai";
import { userAtom } from "../../../stores/userStore";

/**
 * 프로젝트 나가기 Modal 창
 */
function ProjectDeleteModal(props) {
  const [currentUser] = useAtom(userAtom);
  const { user } = currentUser;

  const { project, open, onClose, setRefresh } = props;

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };

  // 프로젝트 나가기 ->
  const deleteProject = async () => {
    const userId = user.username;
    const projectId = project.id;

    await DataStore.delete(MyProject, (c) =>
      c.userId("eq", userId).project("eq", projectId)
    );

    // 프로젝트 데이터 업데이트
    const original = await DataStore.query(Project, projectId);
    await DataStore.save(
      Project.copyOf(original, (updated) => {
        updated.users = original.users.filter((x) => x !== userId);
      })
    );

    if (project.users.length === 1 && project.users[0] === userId) {
      console.log("delete project");
      await DataStore.delete(Project, (c) => c.id("eq", projectId));
    }

    setLoading(false);
    setRefresh((prev) => !prev);
  };

  const handleEvent = async () => {
    setLoading(true);
    await deleteProject();
    handleClose();
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>프로젝트 나가기</DialogTitle>
        <DialogContent>
          정말 <b>{project.title}</b> 에서 나가시겠습니까?
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            disabled={loading}
            variant="contained"
            onClick={handleEvent}
          >
            나가기
          </LoadingButton>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProjectDeleteModal;
