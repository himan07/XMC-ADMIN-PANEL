import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar("Please enter both email and password", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("https://xmc-backend-1.onrender.com/login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        showSnackbar("Logged in successfully", "success");

        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      showSnackbar(errorMessage, "error");
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="20px"
      minHeight="85vh"
      width="80%"
      margin="auto"
    >
      <Card
        sx={{
          boxShadow: 3,
          padding: 2,
          width: "50%",
          background: "rgba(255, 255, 255, 1)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" align="left" gutterBottom>
            LogIn
          </Typography>

          <Box component="form" noValidate autoComplete="off" mt={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type="email"
              value={email}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root fieldset": {
                  borderColor: "#02003d",
                },
                "& .MuiInputLabel-root": {
                  color: "#02003d",
                },
              }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              sx={{
                mt: 3,
                "& .MuiOutlinedInput-root fieldset": {
                  borderColor: "#02003d",
                },
                "& .MuiInputLabel-root": {
                  color: "#02003d",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                marginTop: 6,
                p: 1.5,
                backgroundColor: "rgba(46, 104, 174, 1)",
              }}
              size="large"
              onClick={handleLogin}
              disabled={loading}
              type="submit"
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            mt: 5,
            mr: -2.7,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
