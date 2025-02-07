import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ApprovalIcon from "@mui/icons-material/Approval";

const SideBarContent = ({ setSelectedView, toggleDrawer }) => {
  const menuItems1 = [
    "User Approval",
    "Survey Approval",
    "Redemption Approval",
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems1.map((text) => (
          <ListItem key={text} disablePadding onClick={toggleDrawer}>
            <ListItemButton onClick={() => setSelectedView(text)}>
              <ListItemIcon>{<ApprovalIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideBarContent;
