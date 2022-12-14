import React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Menu, Item, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import "./ContextMenu.css";

import * as Constants from "../../constants";

function ProjectFilterContextMenu(props) {
  const { setFilterIdx } = props;

  const handleOnClick = (idx) => {
    setFilterIdx(idx);
  };

  return (
    <>
      <div>
        <Menu
          id={Constants.PROJECT_FILTER_CONTEXT_MENU_ID}
          animation={{ enter: animation.scale, exit: false }}
        >
          {Constants.FILTER_METHOD.map((x, idx) => (
            <Item key={x.name} onClick={() => handleOnClick(idx)}>
              <ArrowRightIcon />
              {x.name}
            </Item>
          ))}
        </Menu>
      </div>
    </>
  );
}

export default ProjectFilterContextMenu;
