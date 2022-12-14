import React from "react";
import { useAtom } from "jotai";

import LoginPage from "./LoginPage";
import MyPage from "./MyPage";
import { userAtom } from "../stores/userStore";
import { useEffect } from "react";

/*
  홈 페이지
  -> 로그인 X -> 로그인 페이지
  -> 로그인 O -> 프로젝트 목록
*/
function HomePage() {
  const [currentUser, setCurrentUser] = useAtom(userAtom);

  if (
    currentUser.user === undefined ||
    currentUser.user.attributes === undefined
  ) {
    return <LoginPage />;
  }

  return <MyPage />;
}

export default HomePage;
