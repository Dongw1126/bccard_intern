import React, { useEffect, useState, useRef } from "react";
import { LoadingButton } from "@mui/lab";

import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";

import CoverImageForm from "./CoverImageForm";
import TagAddForm from "./TagAddForm";
import TaskCheckBoxForm from "./TaskCheckBoxForm";
import AssigneesForm from "./AssigneesForm";
import FileAttatchForm from "./FileAttatchForm";

import { useAtom } from "jotai";
import { userAtom } from "../../../../stores/userStore";

import * as nt from "../../../../notification/notification";
import styles from "./CardEditModal.module.css";
import * as Constants from "../../../../constants";

// 새로 배정된 유저id 가져옴
const getAddedAssignees = (curr, next) => {
  if (!curr) {
    curr = [];
  }
  if (!next) {
    next = [];
  }
  // console.log(curr, next);
  const currSet = new Set(curr.map((x) => x.userId));
  const nextSet = new Set(next.map((x) => x.userId));

  const added = [...next].filter((x) => !currSet.has(x.userId));
  // console.log(added);

  return added;
};

/**
 * 카드 편집 Modal 창
 */
function CardEditModal(props) {
  const [currentUser] = useAtom(userAtom);
  const { user } = currentUser;

  const { project, editProps, open, onClose } = props;

  const titleRef = useRef(null);
  const descRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [newTags, setNewTags] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [newAssignees, setNewAssignees] = useState([]);
  const [newAttatchments, setNewAttatchments] = useState([]);
  const [newCover, setNewCover] = useState(null);

  useEffect(() => {
    setNewTasks(editProps?.card?.tasks ? editProps?.card?.tasks : []);
    setNewTags(editProps?.card?.tags ? editProps?.card?.tags : []);
    setNewAssignees(
      editProps?.card?.assignees ? editProps?.card?.assignees : []
    );
    setNewAttatchments(
      editProps?.card?.attatchments ? editProps?.card?.attatchments : []
    );
    setNewCover(editProps?.card?.cover ? editProps?.card?.cover : null);
  }, [editProps]);

  const handleClose = () => {
    onClose();
  };

  const handleCoverUpdateEvent = () => {
    editProps?.eventBus.publish({
      type: "UPDATE_CARD",
      laneId: editProps?.laneId,
      card: {
        ...editProps?.card,
        cover: newCover,
      },
    });
  };

  const handleFileUpdateEvent = () => {
    editProps?.eventBus.publish({
      type: "UPDATE_CARD",
      laneId: editProps?.laneId,
      card: {
        ...editProps?.card,
        attatchments: newAttatchments,
      },
    });
  };

  // 저장
  const handleEvent = () => {
    editProps?.eventBus.publish({
      type: "UPDATE_CARD",
      laneId: editProps?.laneId,
      card: {
        ...editProps?.card,
        id: editProps?.card?.id,
        title: titleRef?.current.value,
        description: descRef?.current.value,
        tasks: newTasks,
        tags: newTags,
        assignees: newAssignees,
        attatchments: newAttatchments,
        cover: newCover,
      },
    });

    getAddedAssignees(editProps?.card?.assignees, newAssignees).map((x) => {
      nt.saveDBNotification(
        user.username,
        x.userId,
        `${user.attributes.nickname}님이 ${x.nickname}님을 ${project[0].title}의 ${editProps?.card?.title} 카드에 배정했습니다.`
      );
    });

    handleClose();
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>{editProps?.card?.title}</DialogTitle>
        <DialogContent sx={{ width: "600px", height: "800px" }}>
          <TextField
            inputRef={titleRef}
            autoFocus
            id="name"
            label="타이틀"
            defaultValue={editProps?.card?.title}
            type="text"
            fullWidth
            variant="standard"
          />
          <CoverImageForm
            newCover={newCover}
            setNewCover={setNewCover}
            handleCoverUpdateEvent={handleCoverUpdateEvent}
          />
          <TagAddForm newTags={newTags} setNewTags={setNewTags} />
          <TaskCheckBoxForm newTasks={newTasks} setNewTasks={setNewTasks} />
          <TextField
            inputRef={descRef}
            sx={{ mt: 5 }}
            rows={5}
            id="description"
            label="내용"
            defaultValue={editProps?.card?.description}
            type="text"
            fullWidth
            multiline
            variant="outlined"
          />
          <FileAttatchForm
            newAttatchments={newAttatchments}
            setNewAttatchments={setNewAttatchments}
            handleFileUpdateEvent={handleFileUpdateEvent}
          />

          <AssigneesForm
            participants={editProps?.participants}
            newAssignees={newAssignees}
            setNewAssignees={setNewAssignees}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            disabled={loading}
            variant="contained"
            onClick={handleEvent}
          >
            저장
          </LoadingButton>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CardEditModal;
