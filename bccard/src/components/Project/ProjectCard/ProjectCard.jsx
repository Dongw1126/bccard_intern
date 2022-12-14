import React from "react";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useContextMenu } from "react-contexify";

import ErrorIcon from "@mui/icons-material/Error";
import PeopleIcon from "@mui/icons-material/People";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ProjectProgressBar from "../../Progress/ProjectProgressBar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import ProjectListContextMenu from "../../ContextMenu/ProjectListContextMenu";
import styles from "./ProjectCard.module.css";

import * as pu from "../projectUtils";
import * as Constants from "../../../constants";

/**
 * 프로젝트 카드
 */
function ProjectCard(props) {
  const { data, setRefresh } = props;
  const { id, emoji, title, users, description, deadline, kanban } = data;

  const overview = pu.getOverview(kanban);

  const progress = overview ? (overview[0] / overview[1]) * 100 : NaN;
  const hideProgress = isNaN(progress) || !isFinite(progress);

  const [isDeadlineComing, deadlineDateDiff] = pu.checkDeadlineComing(deadline);

  const { show } = useContextMenu({
    id: id,
  });

  const displayMenu = (e) => {
    show(e);
  };

  return (
    <>
      <div className={`${styles.root}`}>
        <div
          className={`${styles.card}`}
          style={{
            border:
              isDeadlineComing && deadlineDateDiff >= 0 && "2px solid red",
          }}
        >
          <div className={styles.cardBody}>
            <div>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <Link to={`${Constants.PATH.MANAGE_PAGE}/${id}`}>
                    {emoji ? emoji : ""} {title}
                  </Link>
                </div>
                <div>
                  <IconButton onClick={displayMenu}>
                    <MoreHorizIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardDescription}>{description}</div>
              <div className={styles.cardParticipants}>
                <PeopleIcon sx={{ pb: 0.25 }} /> {users.length}명
              </div>
              {!hideProgress && (
                <div className={styles.cardProgress}>
                  <ProjectProgressBar
                    progress={(overview[0] / overview[1]) * 100}
                  />
                </div>
              )}
              <div className={styles.cardFooter}>
                <div className={styles.cardOverview}>
                  <PlaylistAddCheckIcon sx={{ mr: 0.5 }} />
                  {hideProgress ? "-/-" : overview[0] + "/" + overview[1]}
                </div>
                <div className={styles.cardDeadline}>
                  {isDeadlineComing && deadlineDateDiff >= 0 && (
                    <ErrorIcon sx={{ color: "red", mr: 0.5, mb: 0.2 }} />
                  )}
                  <CalendarMonthIcon sx={{ width: 20, mr: 1, mb: 0.3 }} />
                  {pu.getDeadlineText(deadline)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProjectListContextMenu project={data} setRefresh={setRefresh} />
    </>
  );
}

export default ProjectCard;
