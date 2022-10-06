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
import { browser, STORAGE_KEYS } from "@rju/core";
import { TView } from "@rju/types";

import CodeEditor from "../CodeEditor";

const { CURRENT_TEMPLATE, SELECTED_VIEW } = STORAGE_KEYS;

export default function StyleInput() {
  const [codeValue, setCodeValue] = useState<string>("");
  const [initialized, setInitialized] = useState<boolean>(false);
  const [viewValue, setViewValue] = useState<TView>("subreddit");

  useEffect(() => {
    async function init() {
      const view: Record<string, TView> = await browser.storage.sync.get(
        SELECTED_VIEW
      );
      if (Object.prototype.hasOwnProperty.call(view, SELECTED_VIEW)) {
        setViewValue(view[SELECTED_VIEW]);
      }

      const viewTemplate = CURRENT_TEMPLATE[view[SELECTED_VIEW]];
      const code = await browser.storage.sync.get(viewTemplate);
      if (Object.prototype.hasOwnProperty.call(code, viewTemplate)) {
        setCodeValue(code[viewTemplate]);
      }

      setInitialized(true);
    }

    init();
  }, []);

  const handleCodeChange = (newValue: string) => {
    setCodeValue(newValue);
  };

  const handleSave = () => {
    // content window listens for and acts upon storage changes so there's no
    // need to send a message
    browser.storage.sync.set({
      [CURRENT_TEMPLATE[viewValue]]: codeValue,
    });
  };

  const handleViewChange = async (event: SelectChangeEvent) => {
    const value = event.target.value as TView;

    setViewValue(value);
    browser.storage.sync.set({ [SELECTED_VIEW]: value });

    const viewTemplate = CURRENT_TEMPLATE[value];
    const code = await browser.storage.sync.get(viewTemplate);
    if (Object.prototype.hasOwnProperty.call(code, viewTemplate)) {
      setCodeValue(code[viewTemplate]);
    } else {
      setCodeValue("");
    }
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
            language="handlebars"
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
