import React, { useState, useEffect } from "react";

import SortIcon from "@mui/icons-material/Sort";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";

import { useAtom } from "jotai";
import { userAtom } from "../stores/userStore";

import { useContextMenu } from "react-contexify";
import ProjectFilterContextMenu from "../components/ContextMenu/ProjectFilterContextMenu";

import useDialog from "../hooks/useDialog";
import ProjectCreateModal from "../components/Modal/Project/ProjectCreateModal";
import SideBarLayout from "./layouts/SideBarLayout";

import CircularLoadingProgress from "../components/Progress/CircularLoadingProgress";
import ProjectList from "../components/Project/ProjectList";
import styles from "./MyProjectPage.module.css";

import * as pu from "../components/Project/projectUtils";
import * as Constants from "../constants";

const buttonTheme = createTheme({
  palette: {
    primary: {
      main: grey[900],
      dark: grey[800],
    },
  },
});

const projectListRender = (projects, setRefresh) => {
  if (projects.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          marginTop: "160px",
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "400",
          userSelect: "none",
        }}
      >
        프로젝트가 없습니다 😲
      </div>
    );
  }

  return (
    <div style={{ marginLeft: "25px" }}>
      <ProjectList projects={projects} setRefresh={setRefresh} />
    </div>
  );
};

function MyProjectPage() {
  const [currentUser] = useAtom(userAtom);
  const { user } = currentUser;

  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState(Constants.QUERY_LOADING);
  const [open, handleOpen, handleClose] = useDialog();
  const [projects, setProjects] = useState([]);
  const [filterIdx, setFilterIdx] = useState(0);

  useEffect(() => {
    if (user) {
      setStatus(Constants.QUERY_LOADING);
      pu.getProjectIds(user.username)
        .then((res) => pu.getProjects(res))
        .then((res) => setProjects(res))
        .then(() => {
          setStatus(Constants.QUERY_COMPLETE);
        });
    }
  }, [refresh, user]);

  const { show } = useContextMenu({
    id: Constants.PROJECT_FILTER_CONTEXT_MENU_ID,
  });

  const displayMenu = (e) => {
    show(e);
  };

  if (user === undefined) {
    console.log("user loading");
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
          <div className={styles.header}>
            <div className={styles.displayUser}>
              <div className={styles.username}>{user.attributes.nickname}</div>{" "}
              님의 프로젝트
            </div>
            <ThemeProvider theme={buttonTheme}>
              <Button
                sx={{ fontSize: 20, borderRadius: 30, mt: 1.75 }}
                variant="contained"
                onClick={handleOpen}
              >
                새 프로젝트 생성
              </Button>
            </ThemeProvider>
            <div className={styles.filterContainer}>
              <div className={styles.filter} onClick={displayMenu}>
                <SortIcon /> 필터 : {Constants.FILTER_METHOD[filterIdx].name}
              </div>
            </div>
          </div>

          {status === Constants.QUERY_COMPLETE ? (
            projectListRender(
              Constants.FILTER_METHOD[filterIdx].callback(projects),
              setRefresh
            )
          ) : (
            <div style={{ textAlign: "center", marginTop: "130px" }}>
              <CircularLoadingProgress />
            </div>
          )}
        </div>
      </SideBarLayout>
      <ProjectCreateModal
        title="새 프로젝트 생성"
        open={open}
        onClose={handleClose}
        setRefresh={setRefresh}
      />
      <ProjectFilterContextMenu setFilterIdx={setFilterIdx} />
    </>
  );
}

export default MyProjectPage;
