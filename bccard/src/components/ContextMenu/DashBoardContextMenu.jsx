import React from "react";
import { useNavigate, Link } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Menu, Item, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./ContextMenu.css";
import styles from "./DashBoardContextMenu.module.css";
import * as pu from "../Project/projectUtils";
import * as Constants from "../../constants";

function DashBoardContextMenu(props) {
  const navigate = useNavigate();
  const { contextId, data } = props;

  const handleRedirect = (pid) => {
    navigate(`${Constants.PATH.MANAGE_PAGE}/${pid}`);
  };

  return (
    <div style={{ fontSize: "1rem" }}>
      <Menu
        id={contextId}
        style={{ width: "350px", zIndex: Constants.CONTEXT_MENU_Z_INDEX }}
        animation={{ enter: animation.slide, exit: false }}
      >
        {data.map((x) => {
          return (
            <Item onClick={() => handleRedirect(x.id)} key={x.id}>
              <OpenInNewIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <div className={styles.projectListRoot}>
                <div className={styles.title}>{x.title}</div>
                <div className={styles.divider}>|</div>
                <div className={styles.deadline}>
                  {pu.getDeadlineText(x.deadline)}
                </div>
              </div>
            </Item>
          );
        })}
      </Menu>
    </div>
  );
}

export default DashBoardContextMenu;
