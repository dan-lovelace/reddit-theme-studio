import React from "react";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: { disableRipple: true },
    },
    MuiTab: {
      defaultProps: { disableRipple: true },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
