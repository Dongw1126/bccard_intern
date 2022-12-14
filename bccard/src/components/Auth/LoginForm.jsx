import React from "react";

import { Authenticator, AmplifyProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "aws-amplify";
import { theme, services, krDict } from "./customAuth";
import CircularLoadingProgress from "../Progress/CircularLoadingProgress";
import styles from "./LoginForm.module.css";

I18n.setLanguage("kr");
I18n.putVocabularies(krDict);

// console.log(I18n.get("Sign In"));

function LoginForm(props) {
  return (
    <div>
      <AmplifyProvider theme={theme}>
        <Authenticator services={services}>
          {({ signOut, user }) => {
            return (
              <div>
                <CircularLoadingProgress />
              </div>
            );
            // navigate("/myproject");
            // return <button onClick={signOut}>signOut</button>;
          }}
        </Authenticator>
      </AmplifyProvider>
    </div>
  );
}

export default LoginForm;
