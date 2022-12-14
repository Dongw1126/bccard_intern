import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAtom } from "jotai";
import { userAtom } from "../../stores/userStore";

import { IconButton } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./SideBar.module.css";

import * as Constants from "../../constants";

const iconSx = {
  mr: 2,
};

function SideBar(props) {
  const [currentUser] = useAtom(userAtom);
  const { user, signOut } = currentUser;

  const [open, setOpen] = useState(true);
  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className={`${styles.root}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={process.env.PUBLIC_URL + Constants.LOGO_IMG} alt="" />
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        <Link to={Constants.PATH.MY_PAGE}>
          <div className={styles.sideBarButton}>
            <AccountCircleIcon sx={iconSx} />
            <span className={styles.buttonText}>마이페이지</span>
          </div>
        </Link>
        <Link to={Constants.PATH.MY_PROJECT_PAGE}>
          <div className={styles.sideBarButton}>
            <AssignmentIcon sx={iconSx} />
            <span className={styles.buttonText}>내 프로젝트</span>
          </div>
        </Link>
        <div className={styles.sideBarButton} onClick={() => signOut()}>
          <ExitToAppIcon sx={iconSx} />
          <span className={styles.buttonText}>로그아웃</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;

/* 
  <IconButton sx={{ mr: 1, mb: 1, mt: 1.2 }}>
    <MenuIcon sx={{ color: "#ffffff" }} />
  </IconButton>
*/
