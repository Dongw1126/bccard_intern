import React, { useState, useEffect } from "react";
import { ButtonGroup, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserAvatar from "../../../Auth/UserAvatar";

import { useContextMenu } from "react-contexify";
import AssigneesContextMenu from "../../../ContextMenu/AssigneesContextMenu";

import * as Constants from "../../../../constants";
import styles from "./AssigneesForm.module.css";

const iconSx = {
  width: 20,
  height: 20,
};

function AssigneesForm(props) {
  const { participants, newAssignees, setNewAssignees } = props;

  const { show } = useContextMenu({
    id: Constants.ASSINGEES_CONTETX_MENU_ID,
  });

  const displayMenu = (e) => {
    show(e);
  };

  const handleOnDelete = (userId) => {
    setNewAssignees((prev) => [...prev].filter((x) => x.userId !== userId));
  };

  return (
    <>
      <div>
        <div className={styles.formLabel}>배정 받은 사람</div>
        <div>
          <IconButton onClick={displayMenu} sx={{ ...iconSx, mt: 1 }}>
            <AddIcon sx={iconSx} />
          </IconButton>
        </div>
        <div className={styles.assignees}>
          {newAssignees &&
            newAssignees.map((x) => (
              <div
                key={x.userId}
                className={styles.assignedUser}
                onClick={() => handleOnDelete(x.userId)}
              >
                <UserAvatar
                  avatarSrc={x.avatar}
                  nickname={x.nickname}
                  size="30px"
                  borderSize="0.5px"
                />
                <div className={styles.nickname}>{x.nickname}</div>
              </div>
            ))}
        </div>
      </div>
      <AssigneesContextMenu
        participants={participants}
        newAssignees={newAssignees}
        setNewAssignees={setNewAssignees}
      />
    </>
  );
}

export default AssigneesForm;
