import { DataStore } from "aws-amplify";
import { Project } from "../../models";

// 공개 설정 변경
export const changePublic = async (project, newOpenPublic) => {
  if (project && project.length > 0) {
    const original = await DataStore.query(Project, project[0].id);

    await DataStore.save(
      Project.copyOf(original, (updated) => {
        updated.openPublic = newOpenPublic;
      })
    );
  }
};

// 프로젝트 열람 가능 체크
export const canReadable = (project, user) => {
  if (project && user && project.length > 0) {
    const openPublic = project[0].openPublic;
    const participants = project[0].users;
    const currUserId = user.username;

    // 외부 공개
    if (openPublic) return true;

    // 외부 비공개 + 참여자
    if (participants.includes(currUserId)) return true;

    return false;
  }

  return false;
};

// 프로젝트 수정 가능 체크
export const canEditable = (project, user) => {
  if (project && user && project.length > 0) {
    // const openPublic = project[0].openPublic;
    const participants = project[0].users;
    const currUserId = user.username;

    if (participants.includes(currUserId)) {
      return true;
    }

    return false;
  }

  return false;
};
