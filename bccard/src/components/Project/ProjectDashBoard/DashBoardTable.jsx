import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./ProjectDashBoard.module.css";
import * as ku from "../../Board/KanbanBoardUtils";
import * as pu from "../projectUtils";
import * as nt from "../../../notification/notification";

const getProjectStatus = (deadline) => {
  const [flag, diff] = pu.checkDeadlineComing(deadline);
  if (diff >= 0) {
    if (diff <= 7 && flag) {
      return "곧 마감됨";
    }
    return "진행중";
  } else {
    return "종료됨";
  }
};

function DashBoardTable(props) {
  const { projects, user, notifications } = props;
  console.log(notifications);

  const getMyCards = (project) => {
    if (project) {
      const ret = ku.countMyCards(project.kanban, user.username);
      return ret;
    }

    return null;
  };

  const projectColumns = [
    { field: "title", headerName: "타이틀", width: 180 },
    { field: "status", headerName: "상태", width: 120 },
    { field: "deadline", headerName: "마감기한", width: 150 },
    { field: "myCards", headerName: "배정된 카드", width: 200 },
    { field: "users", headerName: "참여인원" },
  ];

  const projectRows = projects.map((p) => ({
    ...p,
    users: p.users.length,
    status: getProjectStatus(p.deadline),
    myCards: getMyCards(p),
  }));

  const notificationColumns = [
    { field: "date", headerName: "날짜", width: 150 },
    { field: "content", headerName: "내용", width: 500 },
  ];

  const notificationRows = notifications.map((n) => ({
    ...n,
    date: nt.getYYYYMMDD(n.createdAt),
  }));

  return (
    <>
      <div>
        <div className={styles.projectTable}>
          <div className={styles.tableTitle}>내 프로젝트 통계</div>
          <DataGrid rows={projectRows} columns={projectColumns} />
        </div>

        <div className={styles.projectTable}>
          <div className={styles.tableTitle}>최근 100개 알림</div>
          <DataGrid rows={notificationRows} columns={notificationColumns} />
        </div>
      </div>
    </>
  );
}

export default DashBoardTable;
