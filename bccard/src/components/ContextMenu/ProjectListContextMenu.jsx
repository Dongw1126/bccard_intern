import React from "react";
import { Menu, Item, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./ContextMenu.css";

import useDialog from "../../hooks/useDialog";

import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";

import ProjectRenameModal from "../Modal/Project/ProjectRenameModal";
import ProjectDeleteModal from "../Modal/Project/ProjectDeleteModal";
import * as Constants from "../../constants";

const iconSx = {
  marginRight: 10,
};

/**
 * 프로젝트 목록 ContextMenu
 * 이름 바꾸기, 초대하기, 프로젝트 삭제 (+ 소유자 체크)
 */
function ProjectListContextMenu(props) {
  const { project, setRefresh } = props;

  const [renameModalOpen, handleRenameModalOpen, handleRenameModalClose] =
    useDialog();
  const [deleteModalOpen, handleDeleteModalOpen, handleDeleteModalClose] =
    useDialog();

  return (
    <>
      <div>
        <Menu
          id={project.id}
          style={{ zIndex: Constants.CONTEXT_MENU_Z_INDEX }}
          animation={{ enter: animation.scale, exit: false }}
        >
          <Item onClick={handleRenameModalOpen}>
            <EditIcon style={iconSx} />
            편집하기
          </Item>
          <Item onClick={handleDeleteModalOpen}>
            <LogoutIcon style={iconSx} />
            나가기
          </Item>
        </Menu>
      </div>
      <ProjectDeleteModal
        project={project}
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        setRefresh={setRefresh}
      />
      <ProjectRenameModal
        project={project}
        open={renameModalOpen}
        onClose={handleRenameModalClose}
        setRefresh={setRefresh}
      />
    </>
  );
}

export default ProjectListContextMenu;
