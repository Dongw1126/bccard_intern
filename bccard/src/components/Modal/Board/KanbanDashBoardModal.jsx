import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { DialogContent, DialogTitle, Dialog } from "@mui/material";

import * as ku from "../../Board/KanbanBoardUtils";

/**
 * 카드 삭제 모달창
 */

function KanbanDashBoardModal(props) {
  const { open, onClose, boardData, participants } = props;

  const columns = [
    { field: "nickname", headerName: "닉네임", width: 130 },
    { field: "number", headerName: "배정된 카드 수", width: 180 },
  ];
  const rows = ku.getCardCountData(boardData, participants);
  // console.log(rows);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <div style={{ width: "500px", height: "500px" }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KanbanDashBoardModal;
