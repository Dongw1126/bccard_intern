import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { DataStore, SortDirection } from "aws-amplify";
import { useAtom } from "jotai";
import { userAtom } from "../../../stores/userStore";
import { manageRefreshAtom } from "../../../stores/manageRefreshStore";

import { User, MyProject, Project } from "../../../models";

import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";

import AlertModal from "./../AlertModal";
import useDialog from "../../../hooks/useDialog";
import styles from "./ProjectInviteModal.module.css";

import * as nt from "../../../notification/notification";
import * as Constants from "../../../constants";

/**
 * 프로젝트 초대 Modal 창
 */
function ProjectInviteModal(props) {
  const { participants, project, open, onClose } = props;
  const [currentUser] = useAtom(userAtom);
  const { user } = currentUser;

  const [refresh, setRefresh] = useAtom(manageRefreshAtom);

  const currUserIdMap = participants.reduce((accumulator, value) => {
    return { ...accumulator, [value.userId]: true };
  }, {});

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(null);
  const [userArray, setUserArray] = useState([]);

  const [alertOpen, handleAlertOpen, handleAlertClose] = useDialog();

  // 검색 모달 닫기
  const handleClose = () => {
    onClose();
    setUserArray([]);
  };

  // 사용자 검색
  const searchUser = async (_query) => {
    let result = [];
    if (_query) {
      result = await DataStore.query(
        User,
        (c) => c.nickname("contains", _query),
        {
          sort: (s) => s.createdAt(SortDirection.ASCENDING),
          limit: 1,
        }
      );
    }

    return result;
  };

  // 사용자 추가 쓰로틀링
  let inviteTimer;
  const inviteUser = async (_user, _project) => {
    if (!inviteTimer) {
      inviteTimer = setTimeout(async function () {
        inviteTimer = null;

        const original = await DataStore.query(Project, _project.id);
        await DataStore.save(
          Project.copyOf(original, (updated) => {
            updated.users = [...updated.users, _user.userId];
          })
        );

        await DataStore.save(
          new MyProject({
            userId: _user.userId,
            project: _project.id,
          })
        );

        await nt.saveDBNotification(
          user.username,
          _user.userId,
          `${user?.attributes.nickname}님이 ${project.title} 프로젝트에 초대했습니다.`
        );

        setRefresh((prev) => !prev);
        setLoading(false);
        handleAlertClose();
      }, 1000);
    }
  };

  // 초대 이벤트
  // const handleEvent = async (targetUser) => {
  //   if (targetUser !== undefined) {
  //     await inviteUser(targetUser.userId, project.id);
  //   }
  //   // handleClose();
  // };

  // 초대 확인 이벤트
  const handleInviteConfirm = async () => {
    if (target) {
      setLoading(true);
      await inviteUser(target, project);
    }
  };

  // 초대 버튼 클릭 이벤트
  const handleOnClick = (targetUser) => {
    setTarget(targetUser);
    handleAlertOpen();
  };

  // 사용자 검색 디바운싱
  let onChangeTimer;
  const handleOnChange = (event) => {
    if (onChangeTimer) {
      clearTimeout(onChangeTimer);
    }
    onChangeTimer = setTimeout(function () {
      searchUser(event.target?.value).then((res) => {
        const arr = res.map((r) => {
          return {
            userId: r.userId,
            nickname: r.nickname,
            email: r.email,
          };
        });

        setUserArray(arr);
      });
    }, 300);
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>사용자 검색하기</DialogTitle>
        <DialogContent>
          <TextField
            InputProps={{
              onChange: handleOnChange,
            }}
            inputProps={{
              maxLength: Constants.MAX_USER_NICKNAME,
            }}
            autoFocus
            id="name"
            label="닉네임"
            type="text"
            fullWidth
            variant="standard"
          />

          <div className={styles.searchRoot}>
            {userArray.length !== 0 ? (
              userArray.map((x) => {
                return (
                  <div key={x.userId} className={styles.searchContent}>
                    <div>
                      <div className={styles.searchUserName}>{x.nickname}</div>
                      <div className={styles.searchEmail}>{x.email}</div>
                    </div>
                    <div className={styles.inviteButton}>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={currUserIdMap[x.userId]}
                        onClick={() => handleOnClick(x)}
                      >
                        {currUserIdMap[x.userId] ? "초대됨" : "초대하기"}
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>결과 없음</div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
        </DialogActions>
      </Dialog>
      <AlertModal
        title=""
        content={`"${target?.nickname}" 님을 초대합니다`}
        buttonText="확인"
        buttonOnClick={handleInviteConfirm}
        loading={loading}
        open={alertOpen}
        onClose={handleAlertClose}
      />
    </div>
  );
}

export default ProjectInviteModal;
