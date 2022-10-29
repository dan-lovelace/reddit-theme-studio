import { useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  ClickAwayListener,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { applyTheme, browser, STORAGE_KEYS } from "@rju/core";
import { TCurrentTheme, TTheme } from "@rju/types";
import { useNavigate } from "react-router-dom";

import { useToastContext } from "../../contexts/toast";
import { ROUTES } from "../../lib/routes";

type ThemeItemProps = {
  editable?: boolean;
  savedThemes?: TTheme[];
  themeData: TTheme;
  setSavedThemes?: (newValue: TTheme[]) => void;
};

const { CURRENT_THEME, CUSTOM_THEMES: SAVED_THEMES } = STORAGE_KEYS;

export default function ThemeItem({
  editable = false,
  themeData,
  setSavedThemes,
}: ThemeItemProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const { notify } = useToastContext();
  const navigate = useNavigate();

  const handleCancelConfirmDelete = () => {
    setConfirmingDelete(false);
  };

  const handleConfirmDeleteClick = async () => {
    const storedCurrentTheme = await browser.storage.sync.get(CURRENT_THEME);
    const currentTheme = storedCurrentTheme[CURRENT_THEME];
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

      // unset current theme if it was deleted
      [CURRENT_THEME]: currentTheme?.id === themeData.id ? null : currentTheme,
    });

    setSavedThemes?.(newThemes);
    handleCancelConfirmDelete();
  };

  const handleDeleteClick = () => {
    setConfirmingDelete(true);
  };

  const handleEditClick = () => {
    applyTheme(themeData);
    navigate(ROUTES.EDITOR.path);
  };

  const handleThemeClick = () => {
    const newTheme: TCurrentTheme = {
      id: themeData.id,
      type: themeData.type,
    };

    browser.storage.sync.set({
      [CURRENT_THEME]: newTheme,
    });
  };

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <MenuItem
        sx={{ flex: "1 1 auto", overflow: "hidden" }}
        onClick={handleThemeClick}
      >
        <Typography
          variant="body1"
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
          <IconButton aria-label="edit" title="Edit" onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
          {confirmingDelete ? (
            <ClickAwayListener onClickAway={handleCancelConfirmDelete}>
              <IconButton
                aria-label="confirm delete"
                color="error"
                title="Confirm delete"
                onClick={handleConfirmDeleteClick}
              >
                <DeleteIcon />
              </IconButton>
            </ClickAwayListener>
          ) : (
            <IconButton
              aria-label="delete"
              title="Delete"
              onClick={handleDeleteClick}
            >
              <ClearIcon />
            </IconButton>
          )}
        </Stack>
      )}
    </Stack>
  );
}
