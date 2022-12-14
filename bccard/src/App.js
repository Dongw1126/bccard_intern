import React, { useState, useEffect } from "react";
import { Amplify, DataStore } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";

import CircularLoadingProgress from "./components/Progress/CircularLoadingProgress";
import MainComponent from "./components/MainComponent";
import awsconfig from "./aws-exports";
import * as Constants from "./constants";
import styles from "./App.module.css";

Amplify.configure(awsconfig);

function App() {
  const [status, setStatus] = useState(Constants.QUERY_LOADING);

  useEffect(() => {
    setStatus(Constants.QUERY_LOADING);
    DataStore.start().then(() => setStatus(Constants.QUERY_COMPLETE));
  }, []);

  return (
    <Authenticator.Provider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {status === Constants.QUERY_LOADING ? (
          <div style={{ textAlign: "center", marginTop: "130px" }}>
            <CircularLoadingProgress />
          </div>
        ) : (
          <MainComponent />
        )}
      </ThemeProvider>
    </Authenticator.Provider>
  );
}

export default App;
