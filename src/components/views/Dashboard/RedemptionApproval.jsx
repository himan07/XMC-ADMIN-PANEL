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
  Box,
  TextField,
  Divider,
  Tooltip
} from "@mui/material";
import Cookies from "js-cookie";
// import { sendEmail } from "../../sendEmail";

const columns = [
  "S.NO",
  "Request ID",
  "User ID",
  "Country",
  "Request Date",
  "Requested Amount",
  "UPI/PayPal ID",
  "Actions",
];

const RedemptionApproval = () => {
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [redemptionDetails, setRedemptionDetails] = useState([]);
  const jwtToken = Cookies.get("__session");

  const handleRejectDialogOpen = (requestId) => {
    setSelectedRequestId(requestId);
    setOpenMessageBox(true);
  };

  const handleApproval = async (requestId, action, message) => {
    try {
      const response = await axios.put(
        "http://127.0.0.1:3000/api/update-redemption-status",
        { approve: action === "approve", reject: action === "reject", message },
        {
          headers: {
            requestId,
          },
        }
      );

      if (response.status === 200) {
        setRedemptionDetails((prevRows) =>
          prevRows.map((row) =>
            row.requestId === requestId
              ? {
                  ...row,
                  status: action === "approve" ? "Approved" : "Rejected",
                  redemptionStatus: {
                    ...row.redemptionStatus,
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
      console.error("Error approving redemption:", error);
    }
  };

  const handleReject = async() => {
    if (selectedRequestId) {
      handleApproval(selectedRequestId, "reject", rejectionReason);
      // try {
      //   const emailResponse = await sendEmail({
      //     toAddress: "himanshu.yadav@market-xcel.com",
      //     subject: "Welcome to Our Platform!",
      //     url: "https://example.com",
      //     buttonText: "Get Started",
      //   });
      //   console.log("Email response:", emailResponse);
      // } catch (error) {
      //   console.error("Error sending email:", error);
      // }
    }
    setOpenMessageBox(false);
    setRejectionReason("");
  };

  const getRedemptionDetails = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/user/getRedemptionData",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setRedemptionDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching redemption data:", error);
    }
  };

  useEffect(() => {
    getRedemptionDetails();
  }, []);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
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
            {redemptionDetails.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.requestId}</TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>{row.requestDate}</TableCell>
                <TableCell>
                  {row.country === "India"
                    ? `₹${row.requestedAmount}`
                    : row.country === "United States"
                    ? `$${row.requestedAmount}`
                    : ""}
                </TableCell>
                <TableCell>{row.upiId}</TableCell>
                <TableCell>
                  {row.redemptionStatus.approve === true ? (
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
                  ) : row.redemptionStatus.reject === true ? (
                    <Tooltip
                      title={
                        row.redemptionStatus.message || "No reason provided"
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
                        onClick={() => handleApproval(row.requestId, "approve")}
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
                        onClick={() =>
                          handleRejectDialogOpen(row.requestId, "Reje")
                        }
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
        open={openMessageBox}
        onClose={() => setOpenMessageBox(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Details of Rejection</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            fullWidth
            placeholder="Provide the reason for rejection"
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            style={{
              backgroundColor: "#fa4a2a",
              color: "white",
              textTransform: "none",
              height: "30px",
              width: "100px",
            }}
            onClick={handleReject}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RedemptionApproval;
