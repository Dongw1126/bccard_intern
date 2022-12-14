import React from "react";
import { useContextMenu } from "react-contexify";
import DashBoardContextMenu from "../../ContextMenu/DashBoardContextMenu";

import styles from "./DashBoardCard.module.css";

function DashBoardCard(props) {
  const { title, data, label } = props;
  const { show } = useContextMenu({
    id: title,
  });

  const displayMenu = (e) => {
    if (data && data.length > 0) {
      show(e);
    }
  };

  return (
    <>
      <div onClick={displayMenu} className={styles.root}>
        <div className={styles.icon}>{props.icon}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.number}>{data.length}</div>
      </div>
      <DashBoardContextMenu contextId={title} data={data} />
    </>
  );
}

export default DashBoardCard;
