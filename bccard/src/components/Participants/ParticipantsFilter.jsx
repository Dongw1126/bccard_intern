import React, { useState, useEffect } from "react";
import UserAvatar from "../Auth/UserAvatar";
import { v4 as uuidv4 } from "uuid";
import { Menu, Item, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "../ContextMenu/ContextMenu.css";
import { useContextMenu } from "react-contexify";

import PersonIcon from "@mui/icons-material/Person";
import styles from "./ParticipantsFilter.module.css";
import * as Constants from "../../constants";

const contextMenuId = "participants-filter";
const leftStart = 18;

function ParticipantsFilter(props) {
  const { participants, userFilter, setUserFilter } = props;

  const { show } = useContextMenu({
    id: contextMenuId,
  });

  const displayMenu = (e) => {
    show(e);
  };

  return (
    <>
      <div className={styles.filter} onClick={displayMenu}>
        <PersonIcon /> 필터 : {userFilter ? userFilter.nickname : "모두"}
      </div>
      <ParticipantsFilterContextMenu
        participants={participants}
        setUserFilter={setUserFilter}
      />
    </>
  );
}

export default ParticipantsFilter;

function ParticipantsFilterContextMenu(props) {
  const { participants, setUserFilter } = props;

  const handleClear = () => {
    setUserFilter(null);
  };

  const handleOnClick = (p) => {
    setUserFilter(p);
  };

  return (
    <>
      <div style={{ fontSize: "1rem" }}>
        <Menu
          id={contextMenuId}
          style={{ zIndex: Constants.CONTEXT_MENU_Z_INDEX }}
          animation={{ enter: animation.slide, exit: false }}
        >
          <Item key={uuidv4()} onClick={handleClear}>
            <span style={{ marginLeft: "10px" }}>모두</span>
          </Item>
          {participants.map((x, idx) => {
            return (
              <Item key={uuidv4()} onClick={() => handleOnClick(x)}>
                <UserAvatar
                  avatarSrc={x.avatar}
                  nickname={x.nickname}
                  size="30px"
                  borderSize="0.5px"
                />
                <span style={{ marginLeft: "10px" }}>{x.nickname}</span>
              </Item>
            );
          })}
        </Menu>
      </div>
    </>
  );
}
