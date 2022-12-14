import axios from "axios";

const API_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

// 이메일 API 호출용 ID
const SERVICE_ID = "";
const TEMPLATE_ID = "";
const USER_ID = "";

const headers = {
  "Content-type": "application/json;charset=UTF-8",
};

export const sendEmail = async (message) => {
  // const body = {
  //   service_id: SERVICE_ID,
  //   template_id: TEMPLATE_ID,
  //   user_id: USER_ID,
  //   template_params: {
  //     title: message,
  //     message: message,
  //   },
  // };
  //
  // axios.post(API_ENDPOINT, body, { headers: headers });
};
