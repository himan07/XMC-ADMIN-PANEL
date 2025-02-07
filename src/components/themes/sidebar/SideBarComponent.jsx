import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Drawer } from "@mui/material";
import UserApproval from "../../views/Dashboard/UserApproval";
import SideBarContent from "./SidebarContent"
import SurveyApproval from "../../views/Dashboard/SurveyApproval";
import { useDrawer } from "../../../DrawerContext/DrawerContext";
import RedemptionApproval from "../../views/Dashboard/RedemptionApproval";

const drawerWidth = 230;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "flex-end",
}));

const SideBarComponent = () => {
  const { open, toggleDrawer } = useDrawer();
  const [selectedView, setSelectedView] = useState("User Approval");

  const renderSelectedView = () => {
    switch (selectedView) {
      case "User Approval":
        return <UserApproval />;
      case "Survey Approval":
        return <SurveyApproval />;
      case "Redemption Approval":
        return <RedemptionApproval />;
      default:
        return <UserApproval />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "64px",
            height: `calc(100% - 64px)`,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <SideBarContent
          setSelectedView={setSelectedView}
          toggleDrawer={toggleDrawer}
        />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box>{renderSelectedView()}</Box>
      </Main>
    </Box>
  );
};

export default SideBarComponent;
