import { Components, Theme } from "@mui/material";

export const themeComponents: Components<Omit<Theme, "components">> = {
  MuiButton: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },
  MuiTab: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },
};
