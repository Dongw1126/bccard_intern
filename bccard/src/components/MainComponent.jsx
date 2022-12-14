import React, { useEffect } from "react";
import { DataStore } from "aws-amplify";
import { User } from "../models";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useAtom } from "jotai";
import { userAtom } from "../stores/userStore";
import { notificationChangeFlagAtom } from "../stores/notificationStore";

import ScrollToTop from "./ScrollToTop";
import HomePage from "../pages/HomePage";
import ManagePage from "../pages/ManagePage";
import MyProjectPage from "../pages/MyProjectPage";

import * as nt from "../notification/notification";
import * as Constants from "../constants";

// 사용자 DB에 없으면 저장
const addUserToDB = async (user) => {
  console.log("User DB check");
  const { email, nickname, sub } = user.attributes;
  await DataStore.start();
  const check = await DataStore.query(User, (c) => c.userId("eq", sub));

  if (check.length === 0) {
    await DataStore.save(
      new User({
        userId: sub,
        email: email,
        nickname: nickname,
      })
    );
    console.log("User added");
  }
};

function MainComponent() {
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [flag, setFlag] = useAtom(notificationChangeFlagAtom);

  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.signOut,
  ]);

  const signOutAtom = () => {
    setCurrentUser({
      user: undefined,
      signOut: () => {},
    });
    signOut();
  };

  useEffect(() => {
    // 제스처 문제 해결하기
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    console.log("MainComponent: ", user);

    let notifySubscription = null;

    if (user) {
      addUserToDB(user);
      notifySubscription = nt.getDBNotificationwithObserve(
        user.username,
        setFlag
      );
    }

    setCurrentUser({
      user: user,
      signOut: signOutAtom,
    });

    return () => {
      if (notifySubscription) {
        notifySubscription.unsubscribe();
      }
    };
  }, [user]);

  // 로그인 안되어있으면 로그인 페이지만
  if (user === undefined || currentUser === undefined) {
    return (
      <div style={{ height: "100%", display: "flex", flexFlow: "column" }}>
        <div style={{ flex: 1 }}>
          <HomePage />
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ height: "100%", display: "flex", flexFlow: "column" }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path={Constants.PATH.HOME_PAGE} element={<HomePage />} />
            <Route
              path={Constants.PATH.MY_PROJECT_PAGE}
              element={<MyProjectPage />}
            />
            <Route
              path={`${Constants.PATH.MANAGE_PAGE}/:projectId`}
              element={<ManagePage />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default MainComponent;
