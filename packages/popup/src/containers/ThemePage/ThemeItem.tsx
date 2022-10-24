import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { browser, STORAGE_KEYS } from "@rju/core";
import { TTheme } from "@rju/types";
import { kebabCase } from "lodash";

import { useToastContext } from "../../contexts/toast";

type ThemeItemProps = {
  editable?: boolean;
  savedThemes?: TTheme[];
  themeData: TTheme;
  setSavedThemes?: (newValue: TTheme[]) => void;
};

const { SAVED_THEMES } = STORAGE_KEYS;

export default function ThemeItem({
  editable = false,
  themeData,
  setSavedThemes,
}: ThemeItemProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>(themeData.label);
  const { notify } = useToastContext();

  const handleCancelConfirmDelete = () => {
    setConfirmingDelete(false);
  };

  const handleConfirmDeleteClick = async () => {
    const themes = await browser.storage.sync.get(SAVED_THEMES);
    const newThemes: TTheme[] = themes[SAVED_THEMES];
    const themeIdx = newThemes.findIndex((t: TTheme) => t.id === themeData.id);

    if (themeIdx < 0) {
      notify("Error deleting theme");
      return;
    }

    newThemes.splice(themeIdx, 1);

    await browser.storage.sync.set({
      [SAVED_THEMES]: newThemes,
    });

    setSavedThemes?.(newThemes);
    handleCancelConfirmDelete();
  };

  const handleDeleteClick = () => {
    setConfirmingDelete(true);
  };

  const handleEdit = async (
    event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const trimmed = editingName.trim();

    if (!trimmed) {
      notify("Name is required");
      return;
    }

    const themes = await browser.storage.sync.get(SAVED_THEMES);
    const newThemes: TTheme[] = themes[SAVED_THEMES];
    const themeIdx = newThemes.findIndex((t: TTheme) => t.id === themeData.id);

    if (themeIdx < 0) {
      notify("Error editing theme");
      return;
    }

    const id = kebabCase(trimmed);
    const existingIdIdx = newThemes.findIndex((t: TTheme) => t.id === id);
    if (themeIdx !== existingIdIdx) {
      notify("A theme with this name already exists");
      return;
    }

    newThemes[themeIdx] = {
      ...newThemes[themeIdx],
      id,
      label: trimmed,
    };

    await browser.storage.sync.set({
      [SAVED_THEMES]: newThemes,
    });

    setSavedThemes?.(newThemes);
    handleEndEdit();
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleEditingNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditingName(event.target.value);
  };

  const handleEndEdit = () => {
    setEditing(false);
    setEditingName(themeData.label);
  };

  return (
    <Box>
      {editing ? (
        <form onSubmit={handleEdit}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", width: "100%" }}
          >
            <TextField
              autoComplete="off"
              label="Name"
              size="small"
              value={editingName}
              onChange={handleEditingNameChange}
              required
              sx={{ flex: "1 1 auto" }}
            />
            <Button type="submit" variant="contained" onClick={handleEdit}>
              Save
            </Button>
            <Button onClick={handleEndEdit}>Cancel</Button>
          </Stack>
        </form>
      ) : (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <MenuItem dense sx={{ flex: "1 1 auto", overflow: "hidden" }}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              {themeData.label}
            </Typography>
          </MenuItem>
          {editable && (
            <Stack direction="row" spacing={1}>
              <IconButton
                aria-label="edit"
                size="small"
                title="Edit"
                onClick={handleEditClick}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              {confirmingDelete ? (
                <ClickAwayListener onClickAway={handleCancelConfirmDelete}>
                  <IconButton
                    aria-label="confirm delete"
                    color="error"
                    size="small"
                    title="Confirm delete"
                    onClick={handleConfirmDeleteClick}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ClickAwayListener>
              ) : (
                <IconButton
                  aria-label="delete"
                  size="small"
                  title="Delete"
                  onClick={handleDeleteClick}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Box>
  );
}
