import { MouseEvent, useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import StyleIcon from "@mui/icons-material/Style";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";

import { ROUTES } from "../../lib/routes";
import defaultThemes from "../../lib/themes";

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleItemClick = () => {
    handleClose();
  };

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeClick = (id: string) => () => {
    handleClose();
  };

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        disableScrollLock
        open={open}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleClose}
      >
        {defaultThemes.map((item) => (
          <MenuItem key={item.id} dense onClick={handleItemClick}>
            <ListItemIcon>
              <StyleIcon />
            </ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
        <Divider />
        <Link to={ROUTES.THEME.path}>
          <MenuItem dense onClick={handleItemClick}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            Manage themes
          </MenuItem>
        </Link>
      </Menu>
    </Box>
  );
}
