import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import styles from "./LoginPage.module.css";

function LoginPage() {
  return (
    <div>
      <div className={styles.logo}>
        <img
          src={process.env.PUBLIC_URL + "/logo.svg"}
          alt="homepage-logo"
          width={450}
        />
      </div>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
