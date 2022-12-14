import React, { useState, useEffect } from "react";
import UserAvatar from "../Auth/UserAvatar";
import { v4 as uuidv4 } from "uuid";
import { useContextMenu } from "react-contexify";

import ParticipantsContextMenu from "../ContextMenu/ParticipantsContextMenu";
import styles from "./Participants.module.css";
import * as Constants from "../../constants";

const leftStart = 18;

function Participants(props) {
  const { project, participants } = props;

  const { show } = useContextMenu({
    id: Constants.PARTICIPANTS_LIST_CONTEXT_MENU_ID,
  });

  const displayMenu = (e) => {
    show(e);
  };

  const renderNumberAtLast = (dataLength) => {
    return (
      <span
        onClick={displayMenu}
        className={styles.more}
        style={{ left: "40px" }}
      >
        {dataLength <= 3 && `${dataLength}명`}
        {dataLength > 3 && `+ ${dataLength - 3}명`}
      </span>
    );
  };

  return (
    <div className={styles.circleOverlapping}>
      {participants.slice(0, Math.min(3, participants.length)).map((x, idx) => {
        const offset = leftStart + idx * 25;

        return (
          <div
            key={uuidv4()}
            className={styles.circle}
            style={{ left: offset + "px" }}
          >
            <UserAvatar
              avatarSrc={x.avatar}
              nickname={x.nickname}
              size="35px"
              fontSize="1.2rem"
              borderSize="1px"
            />
            {idx === Math.min(3, participants.length) - 1 &&
              renderNumberAtLast(participants.length)}
          </div>
        );
      })}
      <ParticipantsContextMenu
        participants={participants}
        project={project[0]}
      />
    </div>
  );
}

export default Participants;
