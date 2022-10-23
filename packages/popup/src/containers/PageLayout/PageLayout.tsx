import { ReactNode, useMemo, useState } from "react";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Alert,
  AlertTitle,
  Box,
  createTheme,
  CssBaseline,
  IconButton,
  Stack,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";

import OptionsMenu from "../../components/OptionsMenu";
import { themeComponents } from "../../lib/theme";

export default function PageLayout({ children }: { children: ReactNode }) {
  const [popoutError, setPopoutError] = useState<boolean>(false);
  const expanded =
    new URLSearchParams(window.location.search).get("expanded") === "true";
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
        components: themeComponents,
      }),
    [prefersDarkMode]
  );

  const handlePopout = () => {
    const open = window.open(
      "popup.html?expanded=true",
      "popup",
      "popup=true,width=600,height=700"
    );

    if (!open) return setPopoutError(true);

    window.close();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack className="page-layout" sx={{}}>
        {popoutError && (
          <Alert
            severity="error"
            onClose={() => setPopoutError(false)}
            sx={{ mb: 1 }}
          >
            <AlertTitle>Pop out error</AlertTitle>
            Please disable popup blockers for this page.
          </Alert>
        )}
        <Box sx={{ position: "relative" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ position: "absolute", right: 0, zIndex: "mobileStepper" }}
          >
            {!expanded && (
              <Box>
                <IconButton
                  aria-label="pop out"
                  title="Pop out"
                  onClick={handlePopout}
                >
                  <OpenInNewIcon />
                </IconButton>
              </Box>
            )}
            <OptionsMenu />
          </Stack>
        </Box>
      </Stack>
      {children}
    </ThemeProvider>
  );
}
