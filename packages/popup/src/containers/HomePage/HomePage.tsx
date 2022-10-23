import { useEffect, useState } from "react";

import { Box, Stack, Tab, Tabs } from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";

import { StyleInput, TemplateInput } from "../../components/TemplateInput";
import PageLayout from "../PageLayout/PageLayout";

const { SELECTED_TAB } = STORAGE_KEYS;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [initialized, setInitialized] = useState<boolean>(false);

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
    <PageLayout>
      {initialized && (
        <Stack className="app">
          <Box sx={{ flex: "1 1 auto" }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 1 }}>
              <Tab label="HTML" />
              <Tab label="CSS" />
            </Tabs>
          </Box>
          <Box>{activeTab === 0 ? <TemplateInput /> : <StyleInput />}</Box>
        </Stack>
      )}
    </PageLayout>
  );
}
