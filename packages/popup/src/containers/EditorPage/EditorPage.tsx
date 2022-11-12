import { useEffect, useState } from "react";

import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";
import { TCurrentTheme } from "@rju/types";

import { StyleInput, TemplateInput } from "../../components/TemplateInput";

const { CURRENT_THEME, SELECTED_TAB } = STORAGE_KEYS;

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<TCurrentTheme>();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const tab = await browser.storage.local.get(SELECTED_TAB);
      if (tab[SELECTED_TAB]) {
        setActiveTab(tab[SELECTED_TAB]);
      }

      const storedCurrentTheme = await browser.storage.local.get(CURRENT_THEME);
      if (storedCurrentTheme[CURRENT_THEME]) {
        setCurrentTheme(storedCurrentTheme[CURRENT_THEME]);
      }

      setInitialized(true);
    }

    init();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setActiveTab(newIndex);

    browser.storage.local.set({ [SELECTED_TAB]: newIndex });
  };

  return (
    <>
      {initialized && (
        <Stack className="editor-page">
          <Box sx={{ flex: "1 1 auto" }}>
            {currentTheme && (
              <Typography variant="h6" sx={{ mb: 1 }}>
                {currentTheme.label}
              </Typography>
            )}
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
              <Tab label="HTML" />
              <Tab label="CSS" />
            </Tabs>
          </Box>
          <Box>{activeTab === 0 ? <TemplateInput /> : <StyleInput />}</Box>
        </Stack>
      )}
    </>
  );
}
