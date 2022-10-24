import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Divider,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";
import { TTheme } from "@rju/types";
import { kebabCase } from "lodash";

import { useToastContext } from "../../contexts/toast";
import defaultThemes from "../../lib/themes";
import ThemeItem from "./ThemeItem";

const { SAVED_THEMES } = STORAGE_KEYS;

export default function ThemePage() {
  const [creating, setCreating] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [savedThemes, setSavedThemes] = useState<TTheme[]>([]);
  const [creatingName, setCreatingName] = useState<string>("");
  const { notify } = useToastContext();

  useEffect(() => {
    async function init() {
      const themes = await browser.storage.sync.get(SAVED_THEMES);
      if (Object.prototype.hasOwnProperty.call(themes, SAVED_THEMES)) {
        setSavedThemes(themes[SAVED_THEMES]);
      }

      setInitialized(true);
    }

    init();
  }, []);

  const handleCreate = async (
    event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const trimmed = creatingName.trim();

    if (!trimmed) {
      notify("Name is required");
      return;
    }

    // TODO: id validation
    const id = kebabCase(trimmed);
    const newTheme: TTheme = {
      id,
      label: trimmed,
      inputs: {
        comments: {
          partials: [],
          template: "",
        },
        style: "",
        subreddit: {
          partials: [],
          template: "",
        },
      },
    };

    let existingThemes: TTheme[] = [];
    const themes = await browser.storage.sync.get(SAVED_THEMES);

    if (Object.prototype.hasOwnProperty.call(themes, SAVED_THEMES)) {
      existingThemes = themes[SAVED_THEMES];
    }

    if (existingThemes.some((t: TTheme) => t.id === id)) {
      notify("A theme with this name already exists");
      return;
    }

    const newThemes = [...existingThemes, newTheme];

    await browser.storage.sync.set({
      [SAVED_THEMES]: newThemes,
    });

    // TODO: apply empty theme
    setSavedThemes(newThemes);
    handleEndCreate();
  };

  const handleCreateClick = () => {
    setCreating(true);
  };

  const handleCreatingNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreatingName(event.target.value);
  };

  const handleEndCreate = () => {
    setCreating(false);
    setCreatingName("");
  };

  return (
    <>
      {initialized && (
        <Stack className="theme-page">
          <Typography variant="h6">Themes</Typography>
          <Typography variant="caption">Premade</Typography>
          <List>
            {defaultThemes.map((theme) => (
              <ThemeItem key={theme.id} themeData={theme} />
            ))}
          </List>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="caption">Custom</Typography>
          <List>
            {savedThemes.map((theme) => (
              <ThemeItem
                key={theme.id}
                editable
                savedThemes={savedThemes}
                themeData={theme}
                setSavedThemes={setSavedThemes}
              />
            ))}
          </List>
          <Box>
            {creating ? (
              <form onSubmit={handleCreate}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", width: "100%" }}
                >
                  <TextField
                    autoComplete="off"
                    label="Name"
                    size="small"
                    value={creatingName}
                    onChange={handleCreatingNameChange}
                    required
                    sx={{ flex: "1 1 auto" }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
                  <Button onClick={handleEndCreate}>Cancel</Button>
                </Stack>
              </form>
            ) : (
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleCreateClick}
              >
                New theme
              </Button>
            )}
          </Box>
          {/* <div>{JSON.stringify(savedThemes, null, 2)}</div> */}
        </Stack>
      )}
    </>
  );
}
