import React from "react";
import { Menu, Item, animation } from "react-contexify";
import { v4 as uuidv4 } from "uuid";
import "react-contexify/dist/ReactContexify.css";
import "./ContextMenu.css";
import AddIcon from "@mui/icons-material/Add";

import ProjectInviteModal from "../Modal/Project/ProjectInviteModal";
import useDialog from "../../hooks/useDialog";

import * as Constants from "../../constants";
import UserAvatar from "../Auth/UserAvatar";

function ParticipantsContextMenu(props) {
  const { participants, project } = props;
  const [inviteModalOpen, handleInviteModalOpen, handleInviteModalClose] =
    useDialog();

  return (
    <>
      <div style={{ fontSize: "1rem" }}>
        <Menu
          id={Constants.PARTICIPANTS_LIST_CONTEXT_MENU_ID}
          style={{ zIndex: Constants.CONTEXT_MENU_Z_INDEX }}
          animation={{ enter: animation.slide, exit: false }}
        >
          <Item onClick={handleInviteModalOpen}>
            <AddIcon sx={{ ml: 0.4, mr: 1.3 }} />
            사용자 추가하기
          </Item>
          {participants.map((x, idx) => {
            return (
              <Item key={uuidv4()}>
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
      <ProjectInviteModal
        participants={participants}
        project={project}
        open={inviteModalOpen}
        onClose={handleInviteModalClose}
      />
    </>
  );
}

export default ParticipantsContextMenu;
