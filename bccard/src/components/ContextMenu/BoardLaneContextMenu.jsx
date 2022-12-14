import React from "react";
import { Menu, Item, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./ContextMenu.css";

import useDialog from "../../hooks/useDialog";
import LaneEditModal from "../Modal/Board/LaneEditModal";
import LaneDeleteModal from "../Modal/Board/LaneDeleteModal";

import * as Constants from "../../constants";

const iconSx = {
  marginRight: 10,
};

/**
 * 칸반보드 Lane ContextMenu
 */
function BoardLaneContextMenu(props) {
  const { id, title, onDelete, updateTitle } = props;

  const [editModalOpen, handleEditModalOpen, handleEditModalClose] =
    useDialog();
  const [deleteModalOpen, handleDeleteModalOpen, handleDeleteModalClose] =
    useDialog();

  return (
    <>
      <div>
        <Menu id={id} animation={{ enter: animation.scale, exit: false }}>
          <Item onClick={handleEditModalOpen}>편집하기</Item>
          <Item onClick={handleDeleteModalOpen}>삭제하기</Item>
        </Menu>
      </div>
      <LaneEditModal
        title={title}
        updateTitle={updateTitle}
        open={editModalOpen}
        onClose={handleEditModalClose}
      />
      <LaneDeleteModal
        title={title}
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={onDelete}
      />
    </>
  );
}

export default BoardLaneContextMenu;
