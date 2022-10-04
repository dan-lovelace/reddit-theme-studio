import { useEffect, useMemo, useState } from "react";

import {
  Box,
  createTheme,
  CssBaseline,
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

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setActiveTab(newIndex);

    browser.storage.sync.set({ [SELECTED_TAB]: newIndex });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {initialized && (
        <Box className="app">
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
            <Tab label="HTML" />
            <Tab label="CSS" />
          </Tabs>
          <Box>{activeTab === 0 ? <TemplateInput /> : <StyleInput />}</Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
