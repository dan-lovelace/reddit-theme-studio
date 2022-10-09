import { useEffect, useRef, useState } from "react";

import { Box, Button } from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";

import { saveListener } from ".";
import CodeEditor from "../CodeEditor";

const { CURRENT_STYLE } = STORAGE_KEYS;

export function StyleInput() {
  const [styleValue, setStyleValue] = useState<string>("");
  const [initialized, setInitialized] = useState<boolean>(false);

  // configure a ref for styleValue so the latest value can be accessed within
  // save listener
  const valueRef = useRef<string>();
  valueRef.current = styleValue;

  useEffect(() => {
    async function init() {
      const style = await browser.storage.sync.get(CURRENT_STYLE);
      if (Object.prototype.hasOwnProperty.call(style, CURRENT_STYLE)) {
        setStyleValue(style[CURRENT_STYLE]);
      }

      document.addEventListener("keydown", (event) =>
        saveListener(event, handleSave)
      );
      setInitialized(true);
    }

    init();

    return () => {
      document.removeEventListener("keydown", (event) =>
        saveListener(event, handleSave)
      );
    };
  }, []);

  const handleChange = (newValue: string) => {
    setStyleValue(newValue);
  };

  const handleSave = () => {
    browser.storage.sync.set({
      [STORAGE_KEYS.CURRENT_STYLE]: valueRef.current,
    });
  };

  return (
    <>
      {initialized && (
        <Box>
          <CodeEditor
            id="css"
            language="css"
            value={styleValue}
            handleChange={handleChange}
            handleSave={handleSave}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={Boolean(!styleValue)}
            onClick={handleSave}
          >
            Apply
          </Button>
        </Box>
      )}
    </>
  );
}
