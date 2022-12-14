import React from "react";
import { Link } from "react-router-dom";

import { useAtom } from "jotai";
import { userAtom } from "../../stores/userStore";

import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import styles from "./Nav.module.css";
import * as Constants from "../../constants";

const iconSx = {
  mr: 2,
};

/**
 * Navigation Bar 컴포넌트
 */
function Nav() {
  const [currentUser] = useAtom(userAtom);
  const { user, signOut } = currentUser;

  return (
    <>
      <div className={styles.navRoot}>
        <div className={styles.logo}>
          <Link to={Constants.PATH.HOME_PAGE}>
            <img src={process.env.PUBLIC_URL + Constants.LOGO_IMG} alt="" />
          </Link>
        </div>
        <div style={{ width: "100%" }}>
          <Link to={Constants.PATH.MY_PAGE}>
            <div className={styles.navContent}>
              <AccountCircleIcon sx={iconSx} />
              <span>마이페이지</span>
            </div>
          </Link>
          <Link to={Constants.PATH.MY_PROJECT_PAGE}>
            <div className={styles.navContent}>
              <AssignmentIcon sx={iconSx} />
              <span>내 프로젝트</span>
            </div>
          </Link>
          <div
            onClick={signOut}
            className={`${styles.navContent} ${styles.logout}`}
          >
            <ExitToAppIcon sx={iconSx} />
            <span>로그아웃</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
