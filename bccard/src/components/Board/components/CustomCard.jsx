import React from "react";
import CustomTag from "./CustomTag";

import { v4 as uuidv4 } from "uuid";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

import UserAvatar from "../../Auth/UserAvatar";
import TaskProgressBar from "../../Progress/TaskProgressBar";
import styles from "./CustomCard.module.css";

function CustomCard(props) {
  const {
    title,
    cover,
    description,
    tags,
    tasks,
    attatchments,
    assignees,
    cardStyle,
    onClick,
    onDelete,
    editable,
    p_map,
  } = props;

  const handleDeleteClick = (e) => {
    onDelete();
    e.stopPropagation();
  };

  const renderTasks = () => {
    if (tasks?.length > 0) {
      const completeNum = tasks.filter((x) => x.complete).length;
      const totalNum = tasks.length;
      const progress = (completeNum / totalNum) * 100;
      // console.log(progress);

      return (
        <div className={styles.tasks}>
          <details onClick={(e) => e.stopPropagation()}>
            <summary>
              할 일 ({completeNum}/{totalNum})
              <div className={styles.progress}>
                <TaskProgressBar progress={progress} />
              </div>
            </summary>
            {tasks.map((task) => {
              return (
                <div
                  key={task.id}
                  style={{
                    textDecoration: task?.complete ? "line-through" : "",
                  }}
                  className={styles.taskTitle}
                >
                  {task.title}
                </div>
              );
            })}
          </details>
          <div className={styles.progress}></div>
        </div>
      );
    }
    return <div></div>;
  };

  return (
    <>
      <div onClick={onClick} className={styles.root} style={cardStyle}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.title}>{title}</div>

            {editable && (
              <div className={styles.deleteButton} onClick={handleDeleteClick}>
                <IconButton sx={{ p: 0, m: 0, width: 15, height: 15 }}>
                  <ClearIcon sx={{ width: 15, height: 15 }} />
                </IconButton>
              </div>
            )}
          </div>
          {cover && (
            <div className={styles.cover}>
              <img width="240px" src={cover} alt="" />
            </div>
          )}
          <div className={styles.tag}>
            {tags?.length > 0 &&
              tags.map((tag) => <CustomTag key={uuidv4()} {...tag} />)}
          </div>
        </header>
        <div className={styles.content}>
          {renderTasks()}
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.footer}>
          <div>
            {attatchments && attatchments.length > 0 && (
              <div className={styles.attatchments}>
                <AttachFileIcon fontSize="small" />
                {attatchments.length}
              </div>
            )}
          </div>
          <div className={styles.assignees}>
            {assignees &&
              assignees.map((x) => {
                const key = x.userId;
                if (!p_map[key]) return;
                return (
                  <div key={p_map[key].userId}>
                    <UserAvatar
                      avatarSrc={p_map[key].avatar}
                      nickname={p_map[key].nickname}
                      size="30px"
                      borderSize="0.5px"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomCard;
