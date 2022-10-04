import { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { browser, MESSAGE_ACTIONS, STORAGE_KEYS } from "@rju/core";
import { TView } from "@rju/types";

import CodeEditor from "../CodeEditor";

const { CURRENT_TEMPLATE, SELECTED_VIEW } = STORAGE_KEYS;

export default function StyleInput() {
  const [codeValue, setCodeValue] = useState<string>("");
  const [initialized, setInitialized] = useState<boolean>(false);
  const [viewValue, setViewValue] = useState<TView>("subreddit");

  useEffect(() => {
    async function init() {
      const code = await browser.storage.sync.get(CURRENT_TEMPLATE);
      if (Object.prototype.hasOwnProperty.call(code, CURRENT_TEMPLATE)) {
        setCodeValue(code[CURRENT_TEMPLATE]);
      }

      const view = await browser.storage.sync.get(SELECTED_VIEW);
      if (Object.prototype.hasOwnProperty.call(view, SELECTED_VIEW)) {
        setViewValue(view[SELECTED_VIEW]);
      }

      setInitialized(true);
    }

    init();
  }, []);

  const handleCodeChange = (newValue: string) => {
    setCodeValue(newValue);
  };

  const handleSave = () => {
    browser.runtime.sendMessage({
      action: MESSAGE_ACTIONS.UPDATE_TEMPLATE,
      value: codeValue,
    });
    browser.storage.sync.set({
      [CURRENT_TEMPLATE]: codeValue,
    });
  };

  const handleViewChange = (event: SelectChangeEvent) => {
    const value = event.target.value as TView;

    setViewValue(value as TView);
    browser.storage.sync.set({ [SELECTED_VIEW]: value });
  };

  return (
    <>
      {initialized && (
        <Box>
          <FormControl variant="standard" sx={{ minWidth: "50%" }}>
            <InputLabel>View</InputLabel>
            <Select
              value={viewValue}
              onChange={handleViewChange}
              label="Template"
              sx={{ mb: 1 }}
            >
              <MenuItem value="subreddit">Subreddit</MenuItem>
              <MenuItem value="comments">Comments</MenuItem>
            </Select>
          </FormControl>
          <CodeEditor
            language="html"
            value={codeValue}
            handleChange={handleCodeChange}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={Boolean(!codeValue)}
            onClick={handleSave}
          >
            Apply
          </Button>
        </Box>
      )}
    </>
  );
}
