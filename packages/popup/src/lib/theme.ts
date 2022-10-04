import { Components, Theme } from "@mui/material";

export const themeComponents: Components<Omit<Theme, "components">> = {
  MuiButton: {
    defaultProps: { disableRipple: true },
  },
  MuiTab: {
    defaultProps: { disableRipple: true },
  },
};
