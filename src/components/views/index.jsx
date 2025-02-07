import { Box } from "@mui/material";
import React from "react";
import SideBarComponent from "../themes/sidebar/SideBarComponent";

const DashboardLayout = () => {
  return (
    <Box
      sx={{
        overflow: "auto",
      }}
    >
      <SideBarComponent />
    </Box>
  );
};

export default DashboardLayout;
