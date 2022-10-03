import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import "./App.scss";
import StyleInput from "./components/StyleInput";

function App() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setActiveTab(newIndex);
  };

  return (
    <Box className="app">
      <Tabs value={activeTab} variant="fullWidth" onChange={handleTabChange}>
        <Tab label="HTML" />
        <Tab label="CSS" />
      </Tabs>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StyleInput />
      </Box>
    </Box>
  );
}

export default App;
