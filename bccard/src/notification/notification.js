import { DataStore, SortDirection } from "aws-amplify";
import { Notification as NotificationDB } from "../models";
import * as em from "./email";

// 새 알림 DB 저장
export const saveDBNotification = async (senderId, receiverId, content) => {
  await DataStore.save(
    new NotificationDB({
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      confirmed: false,
    })
  );

  // 메일 전송
  // console.log(content);
  em.sendEmail(content);
};

// 알림 DB 받아오기
export const getDBNotification = async (userId) => {
  const result = await DataStore.query(
    NotificationDB,
    (c) => c.receiverId("eq", userId).confirmed("eq", false),
    {
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
    }
  );

  return result;
};

// 알림 읽음 표시
export const readDBNotification = async (notificationId) => {
  const original = await DataStore.query(NotificationDB, notificationId);
  console.log("read original: ", original);
  await DataStore.save(
    NotificationDB.copyOf(original, (updated) => {
      updated.confirmed = true;
    })
  );
};

// 알림 DB 옵저빙
export const getDBNotificationwithObserve = (userId, setFlag) => {
  const subscription = DataStore.observe(NotificationDB, (c) =>
    c.receiverId("eq", userId)
  ).subscribe((msg) => {
    if (msg.opType === "INSERT") {
      addWebNotification(
        () =>
          new Notification("새 알림이 있습니다.", {
            body: msg.element.content,
          })
      );
    }
    if (setFlag) {
      console.log("nt atom changed");
      setFlag((prev) => !prev);
    }
    // console.log("observe", msg);
  });

  return subscription;
};

// 브라우저 알림 띄우는 함수
export const addWebNotification = (callback) => {
  console.log("addWebNotification called");
  if (!("Notification" in window)) {
    console.log("알림을 지원하지않는 브라우저");
  } else {
    // Notification.requestPermission().then(function (permission) {
    //   if (permission === "granted") {
    //     callback();
    //   }
    // });
    callback();
  }
};

// 알림 DB 리스트들을 문자열로 변환
export const NotificationListToString = (notifications) => {
  let ret = "";
  if (notifications.length > 0) {
    ret += `${notifications[0].content}`;
  }

  if (notifications.length > 1) {
    ret += ` ...외 ${notifications.length}개`;
  }
  return ret;
};

// export const customNotify = (notify) => {
//   console.log("hey noti called");
//   new Notification(notify);
// };

// 최근 N개 알람
export const getDBNotificationLastN = async (userId, n) => {
  const result = await DataStore.query(
    NotificationDB,
    (c) => c.receiverId("eq", userId),
    {
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
      limit: n,
    }
  );

  return result;
};

// notification 날짜 변환
export const getYYYYMMDD = (awsDateTime) => {
  if (!awsDateTime) return "";

  const d = new Date(awsDateTime);
  return (
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1 > 9
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1)) +
    "-" +
    (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
  );
};

// 알람 날짜별 통계
export const getStatistics = (notifications) => {
  let data = [];
  let labels = [];

  const emptyData = {
    labels,
    datasets: [
      {
        label: "받은 알람 수",
        data: data,
      },
    ],
  };

  if (!notifications || notifications.length === 0) {
    return emptyData;
  }
  try {
    const count = notifications.reduce((acc, value) => {
      return { ...acc, [getYYYYMMDD(value.createdAt)]: 0 };
    }, {});

    notifications.map((x) => count[getYYYYMMDD(x.createdAt)]++);

    for (const date in count) {
      data.push([date, count[date]]);
    }

    // data.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    data.sort();

    labels = data.slice(0, 10).map((d) => d[0]);
    data = data.slice(0, 10).map((d) => d[1]);

    // console.log(data, labels);

    return {
      labels,
      datasets: [
        {
          label: "날짜 별 알람 수",
          data: data,
          borderColor: "rgb(255, 0, 0)",
          borderWidth: 2,
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          pointStyle: "circle",
          pointRadius: 7,
          pointHoverRadius: 10,
        },
      ],
    };
  } catch (e) {
    console.log(e);
    return emptyData;
  }
};
