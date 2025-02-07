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
  Tooltip,
} from "@mui/material";
import Cookies from "js-cookie";

const columns = [
  "S.NO",
  "Survey Title",
  "User ID",
  // "Completion Date",
  "Compensation Amount",
  "Actions",
];

const SurveyApproval = () => {
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedUuid, setSelectedUuid] = useState("");
  const [completedSurveyData, setCompletedSurveyData] = useState([]);
  const jwtToken = Cookies.get("__session");

  const fetchCompletedSurveys = async () => {
    try {
      const { data } = await axios.get(
        "https://xmc-backend-1.onrender.com/supplier/getSupplier",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setCompletedSurveyData(data.data);
    } catch (error) {
      console.error("Error fetching survey data:", error);
    }
  };

  console.log("completedSurveyData: ", completedSurveyData);

  useEffect(() => {
    fetchCompletedSurveys();
  }, []);

  const handleApproval = async (project_code, uuid, action, message = "") => {
    console.log("click UUID: ", uuid);

    try {
      const response = await axios.put(
        "https://xmc-backend-1.onrender.com/api/update-survey-status",
        { approve: action === "approve", reject: action === "reject", message },
        { headers: { project_code, uuid } }
      );

      if (response.status === 200) {
        await fetchCompletedSurveys();
        const updatedSurveyStatus = response.data.data;

        setCompletedSurveyData((prevRows) =>
          prevRows.map((row) =>
            row.project_code === project_code
              ? {
                  ...row,
                  surveyApprovalStatus:
                    updatedSurveyStatus.surveyApprovalStatus,
                }
              : row
          )
        );
      }
    } catch (error) {
      console.error("Error updating survey status:", error);
    }
  };

  const handleRejectDialogOpen = (uuid) => {
    setSelectedUuid(uuid);
    setOpenMessageBox(true);
  };

  const handleReject = () => {
    if (selectedUuid) {
      handleApproval(selectedUuid, "reject", rejectionReason);
    }
    setOpenMessageBox(false);
    setRejectionReason("");
  };

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
            {completedSurveyData
              .filter((row) =>
                Object.values(row.surveys || {}).some(
                  (survey) => survey.survey_status === "complete-redirect"
                )
              )
              .map((row, index) => {
                const filteredSurveys = Object.values(row.surveys || {}).filter(
                  (survey) => survey.survey_status === "complete-redirect"
                );
                return filteredSurveys.map((survey, subIndex) => (
                  <TableRow key={`${row._id}-${survey.project_code}`}>
                    <TableCell>
                      {index + 1}.{subIndex + 1}
                    </TableCell>
                    <TableCell>{survey.project_name}</TableCell>
                    <TableCell>{row.uuid}</TableCell>
                    {/* <TableCell>
                      {new Date(row.dateOfBirth).toLocaleDateString()}
                    </TableCell> */}
                    <TableCell>
                      {(parseFloat(survey.cpi) * 85.85).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {survey.surveyApprovalStatus.approve ? (
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
                      ) : survey.surveyApprovalStatus.reject ? (
                        <Tooltip
                          title={
                            survey.surveyApprovalStatus.message ||
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
                            onClick={() =>
                              handleApproval(
                                survey.project_code,
                                survey.uuid,
                                "approve"
                              )
                            }
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
                              handleRejectDialogOpen(survey.project_code)
                            }
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ));
              })}
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

export default SurveyApproval;
