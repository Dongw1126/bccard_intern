import React, { useState, useEffect } from "react";
import { DataStore, Storage } from "aws-amplify";
import { User } from "../../models";
import styles from "./UserAvatar.module.css";

const renderAvatar = (props, _src) => {
  const { nickname, size, fontSize, borderSize } = props;

  if (_src) {
    return (
      <div className={styles.avatarImg}>
        <img width={size} height={size} src={_src} alt="" />
      </div>
    );
  }

  return (
    <div
      className={styles.avatarContainer}
      style={{
        width: size,
        height: size,
        borderSize: borderSize ? borderSize : "2px",
      }}
    >
      <div
        className={styles.nickname}
        style={{ fontSize: fontSize ? fontSize : "1rem" }}
      >
        {nickname[0]}
      </div>
    </div>
  );
};

function UserAvatar(props) {
  const { avatarSrc } = props;
  return <div>{renderAvatar(props, avatarSrc)}</div>;
}

export default UserAvatar;
