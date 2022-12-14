import { DataStore, SortDirection } from "aws-amplify";
import { Project, MyProject } from "../../models";

// 사용자의 프로젝트 id들 쿼리
export const getProjectIds = async (userId) => {
  const p = await DataStore.query(MyProject, (c) => c.userId("eq", userId));
  return p.map((a) => a.project);
};

// id 리스트로 부터 프로젝트 정보 쿼리
export const getProjects = async (ids) => {
  if (ids.length === 0) return [];

  const p = await DataStore.query(
    Project,
    (c) => c.or((c) => ids.reduce((c, id) => c.id("eq", id), c)),
    {
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
    }
  );

  return p;
};

// 차이가 일주일 이하면 true
export const checkDeadlineComing = (deadline) => {
  let dateDiff = null;
  if (!deadline) return [false, dateDiff];

  const today = new Date();
  const deadlineDate = new Date(deadline);

  // 날짜 차이 계산
  dateDiff = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );
  if (dateDiff <= 7) {
    return [true, dateDiff];
  }
  return [false, dateDiff];
};

export const getDeadlineText = (deadline) => {
  if (!deadline) return "일정 없음";

  const [flag, dateDiff] = checkDeadlineComing(deadline);
  if (dateDiff < 0) {
    return <span style={{ textDecoration: "line-through" }}>{deadline}</span>;
  }
  if (flag) return `${dateDiff}일 남음`;

  return deadline;
};

export const getOverview = (kanban) => {
  if (!kanban) return [0, 0];

  const data = JSON.parse(kanban)
    .lanes.flat()
    .map((lane) => lane.cards)
    .flat()
    .filter((card) => card.tasks)
    .map((card) => card.tasks)
    .flat();

  // console.log(data);
  const completeNum = data ? data.filter((x) => x?.complete).length : 0;
  const total = data ? data.length : 0;

  return [completeNum, total];
};
