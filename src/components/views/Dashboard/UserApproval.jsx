import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  TextField,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const columns = [
  "S.NO",
  "User Name",
  "User Email",
  "Mobile Number",
  "Certificate",
  "Profession",
  "",
  "",
];

const UserApproval = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [userVerificationStatus, setUserVerificationStatus] = useState([]);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://xmc-backend-1.onrender.com/getDasboardData");
      if (response.data && response.data.data) {
        setRows(response.data.data);
        let verification = response.data.data.map(
          (item) => item.userVerificationStatus
        );
        setUserVerificationStatus(verification.map((item) => item));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerification = async (email, action, message = "") => {
    try {
      const response = await axios.put(
        "https://xmc-backend-1.onrender.com/api/userVerification",
        { approve: action === "approve", reject: action === "reject", message },
        { headers: { email: email } }
      );
      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.email === email
              ? {
                  ...row,
                  userVerificationStatus: {
                    ...row.userVerificationStatus,
                    approve: action === "approve",
                    reject: action === "reject",
                    message: action === "reject" ? message : "",
                  },
                }
              : row
          )
        );
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  const handleOpenDialog = (url) => {
    setCertificateUrl(url);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCertificateUrl("");
  };

  const handleOpenRejectDialog = (email, index) => {
    setSelectedEmail(email);
    setSelectedIndex(index);
    setOpenMessageBox(true);
  };

  const handleReject = () => {
    handleVerification(selectedEmail, "reject", rejectionReason);
    setOpenMessageBox(false);
    setRejectionReason("");
  };

  const renderCertificatePreview = () => {
    const fileExtension = certificateUrl.split(".").pop().toLowerCase();
    if (fileExtension === "pdf") {
      return (
        <embed
          src={certificateUrl}
          width="100%"
          height="500px"
          type="application/pdf"
        />
      );
    } else if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png"
    ) {
      return <img src={certificateUrl} alt="Certificate" width="100%" />;
    } else {
      return <p>Unsupported file type</p>;
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mt: 0,
          position: "relative",
          height: "calc(100vh - 96px)",
          overflow: "auto",
          borderRadius: "8px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={{ fontWeight: "bold" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>+{row.mobileNumber}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenDialog(row.certificateUrl[0])}
                    style={{
                      textDecoration: "none",
                      color: "#1976d2",
                      textTransform: "none",
                    }}
                  >
                    View Certificate
                  </Button>
                </TableCell>
                <TableCell>{row.profession}</TableCell>
                <TableCell>
                  {row.userVerificationStatus.approve === true ? (
                    <span
                      style={{
                        padding: "10px",
                        backgroundColor: "#5db048",
                        color: "white",
                        height: 40,
                        borderRadius: 4,
                      }}
                    >
                      Approved
                    </span>
                  ) : row.userVerificationStatus.reject === true ? (
                    <Tooltip
                      title={
                        row.userVerificationStatus.message ||
                        "No reason provided"
                      }
                    >
                      <span
                        style={{
                          padding: "10px",
                          backgroundColor: "#fa4a2a",
                          color: "white",
                          height: 40,
                          borderRadius: 4,
                        }}
                      >
                        Rejected
                      </span>
                    </Tooltip>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        style={{
                          backgroundColor: "#5db048",
                          color: "white",
                          textTransform: "none",
                          height: "30px",
                          width: "100px",
                        }}
                        onClick={() => handleVerification(row.email, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#fa4a2a",
                          color: "white",
                          textTransform: "none",
                          height: "30px",
                          width: "100px",
                        }}
                        onClick={() => handleOpenRejectDialog(row.email, index)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Certificate Preview
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{renderCertificatePreview()}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openMessageBox}
        onClose={() => setOpenMessageBox(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6">Details of Rejection</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              backgroundColor: "#fa4a2a",
              color: "white",
              textTransform: "none",
              height: "30px",
              width: "100px",
            }}
            onClick={handleReject}
            color="primary"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserApproval;
