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

const defaultThemes = [
  {
    label: "Hacker News",
  },
];

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
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
        {defaultThemes.map((item, idx) => (
          <MenuItem key={idx} dense>
            <ListItemIcon>
              <StyleIcon />
            </ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
        <Divider />
        <Link to={ROUTES.THEME.path}>
          <MenuItem dense>
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
