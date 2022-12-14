import React, { useEffect, useState } from "react";
import { Menu, Item, animation } from "react-contexify";

import "react-contexify/dist/ReactContexify.css";
import "./ContextMenu.css";

import * as Constants from "../../constants";
import UserAvatar from "../Auth/UserAvatar";

function AssigneesContextMenu(props) {
  const { participants, newAssignees, setNewAssignees } = props;
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    if (newAssignees && participants) {
      const a_map = newAssignees.reduce((acc, value) => {
        return { ...acc, [value.userId]: true };
      }, {});

      const newMenuList = participants.map((x) => {
        if (a_map[x.userId]) {
          return {
            ...x,
            flag: true,
          };
        }
        return {
          ...x,
          flag: false,
        };
      });
      setMenuList(newMenuList);
    }
  }, [participants, newAssignees]);

  const handleOnAdd = (user) => {
    setNewAssignees((prev) => [...prev, user]);
  };

  return (
    <>
      <div style={{ fontSize: "1rem" }}>
        <Menu
          id={Constants.ASSINGEES_CONTETX_MENU_ID}
          animation={{ enter: animation.slide, exit: false }}
        >
          {menuList.map((x) => {
            if (x.flag) return;
            return (
              <Item onClick={() => handleOnAdd(x)} key={x.userId}>
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

export default AssigneesContextMenu;
