import React, { useState, useEffect } from "react";
import { DataStore, SortDirection } from "aws-amplify";
import { User } from "../models";

import { useAtom } from "jotai";
import { userAtom } from "../stores/userStore";
import { notificationChangeFlagAtom } from "../stores/notificationStore";

import useDialog from "../hooks/useDialog";
import SideBarLayout from "./layouts/SideBarLayout";
import ProjectDashBoard from "../components/Project/ProjectDashBoard";
import UserAvatar from "../components/Auth/UserAvatar";
import AvatarUploadModal from "../components/Modal/AvatarUploadModal";
import CircularLoadingProgress from "../components/Progress/CircularLoadingProgress";
import NotificationAccordian from "../notification/NotificationAccordian";

import styles from "./MyPage.module.css";
import * as pu from "../components/Project/projectUtils";
import * as nt from "../notification/notification";
import * as Constants from "../constants";

function MyPage() {
  const [currentUser] = useAtom(userAtom);
  const [notifyFlag, setNotifyFlag] = useAtom(notificationChangeFlagAtom);

  const { user } = currentUser;

  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState(Constants.QUERY_LOADING);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [refresh, setRefresh] = useState(false);
  const [avatarOpen, handleAvatarOpen, handleAvatarClose] = useDialog();

  // useEffect(() => {
  //   console.log(projects);
  // }, [projects]);

  useEffect(() => {
    setStatus(Constants.QUERY_LOADING);
    DataStore.start().then(() => setStatus(Constants.QUERY_COMPLETE));
  }, []);

  useEffect(() => {
    if (user) {
      setStatus(Constants.QUERY_LOADING);
      pu.getProjectIds(user.username)
        .then((res) => pu.getProjects(res))
        .then((res) => setProjects(res))
        .then(() => {
          setStatus(Constants.QUERY_COMPLETE);
        });

      DataStore.query(User, (c) => c.userId("eq", user.username), {
        sort: (s) => s.createdAt(SortDirection.ASCENDING),
      }).then((res) => {
        if (res.length > 0) {
          setUserInfo(res[0]);
        }
      });

      nt.getDBNotification(user.username).then((res) => setNotifications(res));
    }
  }, [refresh, user]);

  useEffect(() => {
    nt.getDBNotification(user.username).then((res) => setNotifications(res));
  }, [notifyFlag]);

  if (user === undefined || status === Constants.QUERY_LOADING) {
    return (
      <SideBarLayout>
        <div className={styles.root}>
          <div style={{ textAlign: "center", marginTop: "130px" }}>
            <CircularLoadingProgress />
          </div>
        </div>
      </SideBarLayout>
    );
  }

  return (
    <>
      <SideBarLayout>
        <div className={styles.root}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.displayUser}>
                <div className={styles.avatar} onClick={handleAvatarOpen}>
                  <UserAvatar
                    size="80px"
                    fontSize="2.5rem"
                    nickname={user.attributes.nickname}
                    avatarSrc={userInfo?.avatar}
                  />
                </div>
                <div className={styles.username}>
                  {user.attributes.nickname}
                </div>
                님
              </div>
              <div className={styles.userInfo}>{user.attributes.email}</div>
              <div className={styles.notifications}>
                <span>알림</span>
                <NotificationAccordian
                  user={user}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              </div>
              <div className={styles.dashBoard}>
                대시보드
                <ProjectDashBoard user={user} projects={projects} />
              </div>
            </div>
          </div>
        </div>
      </SideBarLayout>
      <AvatarUploadModal
        open={avatarOpen}
        onClose={handleAvatarClose}
        userInfo={userInfo}
        setRefresh={setRefresh}
      />
    </>
  );
}

export default MyPage;
