import React, { useState, useEffect } from "react";

import { useAtom } from "jotai";
import { userAtom } from "../stores/userStore";
import { manageRefreshAtom } from "../stores/manageRefreshStore";
import { useParams } from "react-router-dom";

import { DataStore } from "aws-amplify";
import { Project } from "../models";

import { LoadingButton } from "@mui/lab";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material";

import Board from "../components/Board";
import Participants from "../components/Participants";
import ParticipantsFilter from "../components/Participants/ParticipantsFilter";
import CircularLoadingProgress from "../components/Progress/CircularLoadingProgress";
import CopyLinkButton from "../components/Button/CopyLinkButton";
import NavBarLayout from "./layouts/NavBarLayout";

import KanbanDashBoardModal from "../components/Modal/Board/KanbanDashBoardModal";
import useDialog from "../hooks/useDialog";

import * as pa from "../components/Auth/projectAuth";
import * as ku from "../components/Board/KanbanBoardUtils";
import * as Constants from "../constants";
import styles from "./ManagePage.module.css";

const saveButtonTheme = createTheme({
  palette: {
    primary: {
      main: "#2C3639",
      dark: "#3F4E4F",
    },
  },
});

const getProject = async (projectId) => {
  const ret = await DataStore.query(Project, (c) => c.id("eq", projectId));
  return ret;
};

function ManagePage() {
  const { projectId } = useParams();

  const [status, setStatus] = useState(Constants.QUERY_LOADING);
  const [boardData, setBoardData] = useState({ lanes: [] });
  const [filterdData, setFilterdData] = useState({ lanes: [] });
  const [loading, setLoading] = useState(false);
  const [openPublic, setOpenPublic] = useState(false);

  const [projectReadable, setProjectReadable] = useState(false);
  const [projectEditable, setProjectEditable] = useState(false);
  const [userFilter, setUserFilter] = useState(null);

  const [dashOpen, handleDashOpen, handleDashClose] = useDialog();

  const [refresh] = useAtom(manageRefreshAtom);
  const [currentUser] = useAtom(userAtom);
  const { user } = currentUser;

  const [project, setProject] = useState([]);
  const [participants, setParticipants] = useState([]);

  // 초기 DataStore 준비
  useEffect(() => {
    setStatus(Constants.QUERY_LOADING);
    DataStore.start().then(() => setStatus(Constants.QUERY_COMPLETE));
  }, []);

  // 프로젝트 바뀌면 옵저빙 수정
  useEffect(() => {
    const subscription = DataStore.observe(Project, (c) =>
      c.id("eq", projectId)
    ).subscribe((msg) => {
      if (msg.opType === "UPDATE") {
        getProject(projectId).then((res) => setProject(res));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  // 새로고침 되면 프로젝트 다시 로드
  useEffect(() => {
    getProject(projectId).then((res) => setProject(res));
  }, [refresh]);

  // 프로젝트 바뀌면 참여자 정보 다시 로드
  useEffect(() => {
    ku.getUserById(project.length > 0 ? project[0].users : []).then((res) => {
      setParticipants(res);
    });
    console.log("Manage Page :", project);

    if (project && project.length > 0 && project[0].kanban) {
      setBoardData(JSON.parse(project[0].kanban));
    } else {
      setBoardData({ lanes: [] });
    }
    if (project && project.length > 0 && project[0].openPublic) {
      setOpenPublic(project[0].openPublic);
    } else {
      setOpenPublic(false);
    }

    setProjectReadable(pa.canReadable(project, user));
    setProjectEditable(pa.canEditable(project, user));
  }, [project]);

  useEffect(() => {
    if (project && project.length > 0 && project[0].kanban) {
      setBoardData(JSON.parse(project[0].kanban));
    } else {
      setBoardData({ lanes: [] });
    }

    if (userFilter) {
      setProjectEditable(false);
      setFilterdData(ku.filterById(boardData, userFilter));
    } else {
      setProjectEditable(pa.canEditable(project, user));
    }
  }, [userFilter]);

  // 데이터 저장
  const saveKanban = async (newKanban) => {
    let result;
    setLoading(true);
    if (project && project.length > 0) {
      console.log("save kanban: ", newKanban);
      const original = await DataStore.query(Project, project[0].id);
      result = await DataStore.save(
        Project.copyOf(original, (updated) => {
          updated.kanban = JSON.stringify(newKanban);
        })
      );
    }

    return result;
  };

  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const handleSave = () => {
    // 최소 delay만큼은 돔
    Promise.all([delay(700), saveKanban(boardData)]).then(() =>
      setLoading(false)
    );
  };

  const handleSwitch = async (e, flag) => {
    if (project && project.length > 0) {
      await pa.changePublic(project, flag);
    }
  };

  if (!(project && project.length > 0) || status === Constants.QUERY_LOADING) {
    return (
      <NavBarLayout>
        <div className={styles.root}>
          <div style={{ textAlign: "center", marginTop: "130px" }}>
            <CircularLoadingProgress />
          </div>
        </div>
      </NavBarLayout>
    );
  }

  if (!projectReadable) {
    return (
      <NavBarLayout>
        <div className={styles.root}>
          <div className={styles.forbidden}>⚠ 열람 권한이 없습니다.</div>
        </div>
      </NavBarLayout>
    );
  }

  return (
    <>
      <NavBarLayout>
        <div className={styles.root}>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div className={styles.projectName}>
                <span className={styles.emoji}>
                  {project.length > 0 && project[0].emoji}
                </span>
                {project.length > 0 && project[0].title}
                <CopyLinkButton />
                {projectEditable && (
                  <ThemeProvider theme={saveButtonTheme}>
                    <LoadingButton
                      loading={loading}
                      sx={{ ml: 2, borderRadius: 10 }}
                      size="small"
                      variant="contained"
                      onClick={handleSave}
                    >
                      저장하기
                    </LoadingButton>
                  </ThemeProvider>
                )}
              </div>

              <div>
                {projectEditable && (
                  <div className={styles.participants}>
                    <Participants
                      project={project}
                      participants={participants}
                    />
                  </div>
                )}

                {projectEditable && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography>비공개</Typography>
                          <Switch
                            checked={openPublic}
                            onChange={handleSwitch}
                          />
                          <Typography>공개</Typography>
                        </Stack>
                      }
                    />
                  </FormGroup>
                )}
              </div>
            </div>
          </div>
          <div className={styles.infoGroup}>
            <div onClick={handleDashOpen} className={styles.tableButton}>
              배정 현황
            </div>
            <ParticipantsFilter
              participants={participants}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
            />
          </div>

          <Board
            project={project}
            boardData={userFilter ? filterdData : boardData}
            projectEditable={projectEditable}
            setBoardData={userFilter ? setFilterdData : setBoardData}
            participants={participants}
          />
        </div>
      </NavBarLayout>
      <KanbanDashBoardModal
        open={dashOpen}
        onClose={handleDashClose}
        boardData={boardData}
        participants={participants}
      />
    </>
  );
}

export default ManagePage;
