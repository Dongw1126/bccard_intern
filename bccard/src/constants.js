import * as pu from "./components/Project/projectUtils";

export const LOGO_IMG = "/logo-white.svg";

export const CARDTREE_INSIDE_OFFSET = 2;

export const MAX_PROJECT_NAME = 20;
export const MAX_PROJECT_DESCRIPTION = 50;
export const MAX_USER_NICKNAME = 255;

export const CONTEXT_MENU_Z_INDEX = 95;
export const MODAL_Z_INDEX = 99;

export const QUERY_LOADING = 0;
export const QUERY_COMPLETE = 1;
export const QUERY_EMPTY = 2;

export const PROJECT_LIST_CONTEXT_MENU_ID = "project-list";
export const PARTICIPANTS_LIST_CONTEXT_MENU_ID = "participants-list";
export const ASSINGEES_CONTETX_MENU_ID = "assignees";
export const EMOJI_PICKER_CONTEXT_MENU_ID = "emoji-picker";
export const PROJECT_FILTER_CONTEXT_MENU_ID = "projcet-filter";

export const PATH = {
  HOME_PAGE: "/",
  MY_PAGE: "/",
  LOGIN_PAGE: "/",
  MY_PROJECT_PAGE: "/projects",
  MANAGE_PAGE: "/manage",
};

// 30kb 정도
export const AVATAR_IMAGE_SIZE_LIMIT = 31000;
export const AVATAR_IMAGE_PATH = "avatars/";

// 30mb 정도
export const ATTATCHMENT_SIZE_LIMIT = 3100000;
export const ATTATCHMENT_PATH = "attachments/";

// 3mb 정도
export const COVER_SIZE_LIMIT = 310000;
export const COVER_PATH = "covers/";

export const DASHBOARD_INPROGRESS_TITLE = "진행중인 프로젝트";
export const DASHBOARD_FINISH_TITLE = "종료된 프로젝트";
export const DASHBOARD_COMING_TITLE = "곧 마감되는 프로젝트";

export const PIE_CHART_BGCOLOR = [
  "rgba(75, 192, 192, 0.5)",
  "rgba(255, 206, 86, 0.5)",
  "rgba(255, 99, 132, 0.5)",
];

export const PIE_CHART_BORDERCOLOR = [
  "rgba(75, 192, 192, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(255, 99, 132, 1)",
];

export const TAGS_COMMON = [
  "중요",
  "버그",
  "기능",
  "요청",
  "긴급",
  "해결완료",
  "검토필요",
  "계획",
  "최종",
];

export const TAG_COLORS = [
  {
    color: "white",
    bgColor: "#D1323A",
  },
  {
    color: "black",
    bgColor: "#BFDADC",
  },
  {
    color: "white",
    bgColor: "#006B75",
  },
  {
    color: "white",
    bgColor: "#1628BC",
  },
  {
    color: "white",
    bgColor: "#000000",
  },
  {
    color: "black",
    bgColor: "#C2E0C6",
  },
  {
    color: "white",
    bgColor: "#0079BF",
  },
  {
    color: "white",
    bgColor: "#EB5A46",
  },
];

export const FILTER_METHOD = [
  {
    name: "모든 프로젝트",
    callback: (projects) => projects,
  },
  {
    name: "진행중인",
    callback: (projects) =>
      projects.filter((x) => pu.checkDeadlineComing(x.deadline)[1] >= 0),
  },
  {
    name: "곧 마감되는",
    callback: (projects) =>
      projects.filter((x) => {
        const result = pu.checkDeadlineComing(x.deadline);
        if (result[0] && result[1] >= 0) return true;
        return false;
      }),
  },
  {
    name: "끝난",
    callback: (projects) =>
      projects.filter((x) => pu.checkDeadlineComing(x.deadline)[1] < 0),
  },
];
