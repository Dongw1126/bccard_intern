import React from "react";

import { useContextMenu } from "react-contexify";

import BoardLaneContextMenu from "../../ContextMenu/BoardLaneContextMenu";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function LaneHeader(props) {
  const { id, title, onDelete, updateTitle, editable } = props;

  const { show } = useContextMenu({
    id: id,
  });

  const displayMenu = (e) => {
    show(e);
  };

  // console.log(props);
  return (
    <>
      <div>
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: "bold" }}>{title}</div>

          {editable && (
            <div style={{ width: "30%", textAlign: "right", fontSize: 13 }}>
              <IconButton onClick={displayMenu} sx={{ padding: 0.3 }}>
                <EditIcon sx={{ width: 17, height: 17 }} />
              </IconButton>
            </div>
          )}
        </header>
      </div>
      <BoardLaneContextMenu
        id={id}
        updateTitle={updateTitle}
        onDelete={onDelete}
        title={title}
      />
    </>
  );
}

export default LaneHeader;
