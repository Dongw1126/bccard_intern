import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import DashBoardCard from "./DashBoardCard";

import ProgressIcon from "@mui/icons-material/Forward";
import DeadlineIcon from "@mui/icons-material/LocalFireDepartment";
import FinishIcon from "@mui/icons-material/TaskAlt";

import DashBoardGraph from "./DashBoardGraph";
import DashBoardTable from "./DashBoardTable";

import * as pu from "../projectUtils";
import * as ku from "../../Board/KanbanBoardUtils";
import * as nt from "../../../notification/notification";
import * as Constants from "../../../constants";
import styles from "./ProjectDashBoard.module.css";

const iconSx = { width: 40, height: 40 };

const getDoughnutChartData = (data) => {
  let _data = data;
  if (data.every((item) => item === 0)) {
    _data = [];
  }

  return {
    labels: [
      Constants.DASHBOARD_INPROGRESS_TITLE,
      Constants.DASHBOARD_FINISH_TITLE,
      Constants.DASHBOARD_COMING_TITLE,
    ],
    datasets: [
      {
        data: _data,
        backgroundColor: Constants.PIE_CHART_BGCOLOR,
        borderColor: Constants.PIE_CHART_BORDERCOLOR,
        borderWidth: 1,
      },
    ],
  };
};

const CenterdTabs = styled(Tabs)(({ theme }) => ({
  [`& .MuiTabs-flexContainer`]: {
    justifyContent: "center",
  },
}));

function ProjectDashBoard(props) {
  const { projects, user } = props;
  const [value, setValue] = useState(0);

  const barCharData = ku.countByDefaultTag(projects);

  const [notifications, setNotifications] = useState([]);
  const [notiStatistics, setNotiStatistics] = useState({
    labels: [],
    datasets: [
      {
        label: "받은 알람 수",
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (user) {
      nt.getDBNotificationLastN(user.username, 100).then((res) => {
        setNotifications(res);
        setNotiStatistics(nt.getStatistics(res));
      });
    }
  }, [user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let inProgress = [];
  let coming = [];
  let finished = [];

  for (const p of projects) {
    const [flag, diff] = pu.checkDeadlineComing(p.deadline);
    if (diff >= 0) {
      inProgress.push(p);
      if (diff <= 7 && flag) coming.push(p);
    } else {
      finished.push(p);
    }
  }

  const renderStastics = (value) => {
    if (value === 0) {
      return (
        <DashBoardGraph
          projects={projects}
          user={user}
          doughnutChartData={getDoughnutChartData([
            inProgress.length,
            finished.length,
            coming.length,
          ])}
          barCharData={barCharData}
          lineChartData={notiStatistics}
        />
      );
    } else {
      return (
        <DashBoardTable
          projects={projects}
          user={user}
          notifications={notifications}
        />
      );
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.cards}>
        <DashBoardCard
          icon={
            <ProgressIcon
              sx={{ ...iconSx, color: Constants.PIE_CHART_BORDERCOLOR[0] }}
            />
          }
          title={Constants.DASHBOARD_INPROGRESS_TITLE}
          data={inProgress}
        />
        <DashBoardCard
          icon={
            <DeadlineIcon
              sx={{ ...iconSx, color: Constants.PIE_CHART_BORDERCOLOR[2] }}
            />
          }
          title={Constants.DASHBOARD_COMING_TITLE}
          data={coming}
        />
        <DashBoardCard
          icon={
            <FinishIcon
              sx={{ ...iconSx, color: Constants.PIE_CHART_BORDERCOLOR[1] }}
            />
          }
          title={Constants.DASHBOARD_FINISH_TITLE}
          data={finished}
        />
      </div>
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <CenterdTabs value={value} onChange={handleChange}>
            <Tab sx={{ fontSize: "1.1rem" }} label="그래프" />
            <Tab sx={{ fontSize: "1.1rem" }} label="표" />
          </CenterdTabs>
        </Box>
        {renderStastics(value)}
      </Box>
    </div>
  );
}

export default ProjectDashBoard;
