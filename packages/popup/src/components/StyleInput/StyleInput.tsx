import { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";

import CodeEditor from "../CodeEditor";

const { CURRENT_STYLE } = STORAGE_KEYS;

export default function StyleInput() {
  const [value, setValue] = useState<string>("");
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const style = await browser.storage.sync.get(CURRENT_STYLE);
      if (Object.prototype.hasOwnProperty.call(style, CURRENT_STYLE)) {
        setValue(style[CURRENT_STYLE]);
      }

      setInitialized(true);
    }

    init();
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSave = () => {
    browser.storage.sync.set({
      [STORAGE_KEYS.CURRENT_STYLE]: value,
    });
  };

  return (
    <>
      {initialized && (
        <Box>
          <CodeEditor
            id="css"
            language="css"
            value={value}
            handleChange={handleChange}
            handleSave={handleSave}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={Boolean(!value)}
            onClick={handleSave}
          >
            Apply
          </Button>
        </Box>
      )}
    </>
  );
}
