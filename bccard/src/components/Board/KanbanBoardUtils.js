import { DataStore, SortDirection, Storage } from "aws-amplify";
import { User } from "../../models";
import * as Constants from "../../constants";

export const getCardById = (laneId, cardId, data) => {
  let ret = undefined;
  try {
    const currentLane = data.lanes.filter((x) => x.id === laneId);
    if (currentLane === undefined) return undefined;

    const currentCard = currentLane[0]?.cards.filter((x) => x.id === cardId);
    if (currentCard === undefined) return undefined;

    ret = currentCard[0];
  } catch (e) {
    console.error(e);
  }

  // console.log(ret);
  return ret;
};

// 유저 id 배열로 사용자 정보 얻기
export const getUserById = async (ids) => {
  console.log("getUserById called");
  if (ids.length === 0) return [];

  // const ret = await DataStore.query(User, (c) =>
  //   c.or((c) => ids.reduce((c, id) => c.userId("eq", id), c))
  // );

  const promises = await ids.map(async (id) => {
    const p = new Promise((resolve, reject) => {
      resolve(
        DataStore.query(User, (c) => c.userId("eq", id), {
          sort: (s) => s.createdAt(SortDirection.ASCENDING),
          page: 0,
          limit: 1,
        })
      );
    });

    return p;
  });

  const ret = await (await Promise.all(promises)).map((x) => x[0]);

  // console.log(ret);

  return ret;
};

// 아바타 이미지 불러오기
export const getAvatarSrc = async (_key) => {
  console.log("getAvatarSrc called");
  const url = await Storage.get(_key);

  // 캐시 활성화를 위해 public URL 사용
  const urlWithoutSigniture = url.substring(0, url.indexOf("?"));

  // 엑박 문제 로깅용
  console.log(urlWithoutSigniture);
  // console.log(getS3Key(urlWithoutSigniture));
  return urlWithoutSigniture;
};

export const getS3Key = (url) => {
  const tokens = url.split("/");
  return tokens[tokens.length - 2] + "/" + tokens[tokens.length - 1];
};

// 통계용 함수들
export const countByDefaultTag = (projects) => {
  const tags = projects
    .map((project) => project.kanban)
    .filter((x) => x)
    .map((kanbanStr) => JSON.parse(kanbanStr))
    .map((kanban) => kanban.lanes.flat())
    .flat()
    .map((lane) => lane.cards)
    .flat()
    .map((card) => card.tags)
    .flat()
    .map((tag) => tag.title);

  let labels = [...new Set(tags)];
  const count = labels.reduce((acc, value) => {
    return { ...acc, [value]: 0 };
  }, {});

  tags.map((title) => count[title]++);

  let data = [];
  for (const label in count) {
    data.push([label, count[label]]);
  }
  data.sort((a, b) => b[1] - a[1]);

  data = data.slice(0, 10).map((d) => d[1]);
  labels = labels.slice(0, 10);

  // console.log(labels, data);
  return {
    labels,
    datasets: [
      {
        label: "태그 사용 수",
        data: data,
        backgroundColor: "rgba(54, 162, 0, 0.2)",
        borderColor: "rgba(54, 162, 0, 0.6)",
        borderWidth: 1,
      },
    ],
  };
};

// id로 카드 필터링
export const filterById = (boardData, user) => {
  let filterd = JSON.parse(JSON.stringify(boardData));

  if (!user) return filterd;

  try {
    const userId = user.id;
    const newLanes = [];
    for (const lane of filterd.lanes) {
      const filterdCards = lane.cards.filter((x) => {
        if (x.assignees) {
          for (const a of x.assignees) {
            if (a.id === userId) {
              return true;
            }
          }
          return false;
        }
      });

      const newLane = { ...lane };
      newLane.cards = filterdCards;
      newLanes.push(newLane);
    }

    filterd.lanes = newLanes;
    return filterd;
  } catch (e) {
    console.error(e);
    return filterd;
  }
};

export const countMyCards = (kanbanStr, myId) => {
  try {
    const kanban = JSON.parse(kanbanStr);
    let count = 0;
    kanban.lanes
      .flat()
      .map((lane) => lane.cards)
      .flat()
      .map((x) => x.assignees)
      .filter((x) => x)
      .map((x) =>
        x.map((y) => {
          if (y.userId === myId) {
            count++;
          }
        })
      );

    return count;
  } catch (e) {
    console.error(e);
    return 0;
  }

  return 0;
};

export const getCardCountData = (boardData, participants) => {
  const count = participants.reduce((acc, value) => {
    return {
      ...acc,
      [value.userId]: {
        count: 0,
        ...value,
      },
    };
  }, {});

  const rows = [];
  const _data = boardData.lanes
    .flat()
    .map((lane) => lane.cards)
    .flat()
    .map((x) => x.assignees)
    .filter((x) => x)
    .flat()
    .map((x) => {
      if (count[x.userId]) {
        count[x.userId].count++;
        return x;
      }
    });

  // console.log(count);

  for (const key in count) {
    const x = count[key];
    // console.log(x);
    if (!isNaN(x.count))
      rows.push({
        id: x.userId,
        nickname: x.nickname,
        number: x.count,
      });
  }

  // console.log("_data", _data);
  // console.log(rows);

  return rows;
};
