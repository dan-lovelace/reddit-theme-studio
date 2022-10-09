import { useEffect, useState } from "react";

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";
import { TView } from "@rju/types";

import Comments from "./Comments";
import Subreddit from "./Subreddit";

const { SELECTED_VIEW } = STORAGE_KEYS;

export default function TemplateInput() {
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

      setInitialized(true);
    }

    init();
  }, []);

  const handleViewChange = async (event: SelectChangeEvent) => {
    const value = event.target.value as TView;

    setViewValue(value);
    browser.storage.sync.set({ [SELECTED_VIEW]: value });
  };

  return (
    <>
      {initialized && (
        <Box>
          <FormControl variant="standard" sx={{ minWidth: 250 }}>
            <Select
              value={viewValue}
              onChange={handleViewChange}
              label="Template"
              MenuProps={{
                disableScrollLock: true,
              }}
              sx={{ mb: 1 }}
            >
              <MenuItem value="subreddit">Subreddit</MenuItem>
              <MenuItem value="comments">Comments</MenuItem>
            </Select>
          </FormControl>
          {viewValue === "comments" && <Comments />}
          {viewValue === "subreddit" && <Subreddit />}
        </Box>
      )}
    </>
  );
}
