import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useDrawer } from "../../../DrawerContext/DrawerContext";

const TopBar = () => {
  const { toggleDrawer } = useDrawer(); 
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    try {
      setLoading(true);
      localStorage.removeItem("token");
      
        setLoading(false);
        navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          {token && <Button onClick={toggleDrawer} startIcon={<MenuIcon />} />}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: "rgba(42, 106, 157, 1)",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            XCEL MED CONNECT
          </Typography>
          {token && (
            <Button
              onClick={handleLogout}
              endIcon={
                loading ? (
                  <CircularProgress style={{ color: "red" }} />
                ) : (
                  <ExitToAppIcon fontSize="large" />
                )
              }
            />
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default TopBar;
