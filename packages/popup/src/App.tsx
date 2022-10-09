import { useEffect, useMemo, useState } from "react";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Alert,
  AlertTitle,
  Box,
  createTheme,
  CssBaseline,
  IconButton,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";

import "./App.scss";
import StyleInput from "./components/StyleInput";
import TemplateInput from "./components/TemplateInput";
import { themeComponents } from "./lib/theme";

const { SELECTED_TAB } = STORAGE_KEYS;

function App() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [popoutError, setPopoutError] = useState<boolean>(false);
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
  const expanded =
    new URLSearchParams(window.location.search).get("expanded") === "true";

  useEffect(() => {
    async function init() {
      const tab = await browser.storage.sync.get(SELECTED_TAB);
      if (Object.prototype.hasOwnProperty.call(tab, SELECTED_TAB)) {
        setActiveTab(tab[SELECTED_TAB]);
      }

      setInitialized(true);
    }

    init();
  }, []);

  const handlePopout = () => {
    const open = window.open(
      "popup.html?expanded=true",
      "popup",
      "popup=true,width=600,height=700"
    );

    if (!open) return setPopoutError(true);

    window.close();
  };

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setActiveTab(newIndex);

    browser.storage.sync.set({ [SELECTED_TAB]: newIndex });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {initialized && (
        <Box className="app">
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
          <Stack direction="row">
            <Box sx={{ flex: "1 1 auto" }}>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
                <Tab label="HTML" />
                <Tab label="CSS" />
              </Tabs>
            </Box>
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
          </Stack>
          <Box>{activeTab === 0 ? <TemplateInput /> : <StyleInput />}</Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
