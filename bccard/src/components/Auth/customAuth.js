import { Auth, DataStore } from "aws-amplify";
import { createTheme, defaultTheme } from "@aws-amplify/ui-react";
import { User } from "../../models";

// const mainColor = "#940000";

/*const myColor = {
  10: { value: "#f5f5f5" },
  60: { value: mainColor },
  20: { value: mainColor },
  40: { value: mainColor },
  80: { value: mainColor },
  90: { value: mainColor },
  100: { value: mainColor },
};*/

export const theme = createTheme({
  name: "my-theme",
  tokens: {
    colors: {
      brand: {
        primary: defaultTheme.tokens.colors.red,
      },
    },
  },
});

let userId, email, nickname;

export const services = {
  /*async handleSignUp(formData) {
    let result = null;
    result = await Auth.signUp(formData);

    email = formData.attributes.email;
    nickname = formData.attributes.nickname;
    userId = result.userSub;

    return result;
  },

  async handleConfirmSignUp({ username, code }) {
    let result = null;

    result = await Auth.confirmSignUp(username, code);
    console.log(result);

    if (result === "SUCCESS") {
      await DataStore.save(
        new User({
          userId: userId,
          nickname: nickname,
          email: email,
        })
      );
      console.log("user added");
    }

    // return result;
  },*/
};

export const krDict = {
  kr: {
    "Back to Sign In": "로그인으로 돌아가기",
    Birthdate: "생년월일",
    "Change Password": "비밀번호 변경하기",
    Changing: "변경중",
    Code: "코드",
    "Confirm Password": "비밀번호 재확인",
    "Reset your Password": "비밀번호 재설정",
    "Confirm Sign Up": "회원가입 확인",
    "Confirm SMS Code": "휴대폰 본인 확인",
    "Confirm TOTP Code": "TOTP 인증번호 확인",
    Confirm: "확인",
    "Confirmation Code": "인증번호",
    Confirming: "확인중",
    "Create Account": "회원가입",
    "Creating Account": "회원가입 중",
    Email: "이메일",
    "Enter your code": "인증번호를 입력해주세요",
    "Enter your username": "아이디를 입력해주세요",
    "Family Name": "성",
    "Given Name": "이름",
    "Forgot your password? ": "비밀번호를 잊으셨나요?",
    "Hide password": "비밀번호 숨기기",
    Loading: "로딩중",
    Username: "아이디",
    Name: "성함",
    Nickname: "닉네임",
    "New password": "새 비밀번호",
    Password: "비밀번호",
    "Phone Number": "전화번호",
    "Preferred Username": "닉네임",
    Profile: "프로필",
    "Resend Code": "인증번호 재전송",
    "Reset your password": "비밀번호 재설정",
    "Reset Password": "비밀번호 재설정",
    "Send code": "인증코드 보내기",
    Sending: "전송중",
    "Setup TOTP": "TOTP 설정하기",
    "Show password": "비밀번호 보이기",
    "Sign in": "로그인",
    "Sign In": "로그인",
    "Sign In with Amazon": "Amazon 로그인",
    "Sign In with Apple": "Apple 로그인",
    "Sign In with Facebook": "Facebook 로그인",
    "Sign In with Google": "Google 로그인",
    "Sign in to your account": "로그인",
    "Create a new account": "회원가입",
    "Signing in": "로그인 중",
    Skip: "다음에 하기",
    Submit: "확인",
    Submitting: "확인중",
    "Verify Contact": "연락처 확인",
    "Account recovery requires verified contact information":
      "계정 복구를 위해 확인이 필요합니다",
    Verify: "인증",
    Website: "웹사이트",

    "User does not exist.": "이메일이나 비밀번호가 다릅니다.",
    "Incorrect username or password.": "이메일이나 비밀번호가 다릅니다.",
    "Enter your email": "이메일을 입력해주세요",
    "New Password": "새 비밀번호 입력",
    "Invalid verification code provided, please try again.":
      "인증 코드가 다릅니다. 다시 시도해주세요",
    "Your passwords must match": "비밀번호가 일치하지 않습니다.",
    "Username/client id combination not found.": "존재하지 않는 사용자입니다.",
    "An account with the given email already exists.":
      "이미 존재하는 이메일입니다. 로그인 탭에서 로그인을 하거나 이메일 인증을 다시 진행하실 수 있습니다.",
    "We Emailed You": "이메일 전송됨",
    "Your code is on the way. To log in, enter the code we emailed to":
      "이메일로 인증 코드가 전송되었습니다. 가입을 위해 인증 코드를 입력해주세요 ",
    "It may take a minute to arrive.": " 메일은 보통 1분 이내로 도착합니다.",
    "We Sent A Code": "인증 코드가 전송됨",
    "Your code is on the way. To log in, enter the code we sent you. It may take a minute to arrive.":
      "로그인을 위해선 인증 코드를 입력해주세요.",
  },
};
