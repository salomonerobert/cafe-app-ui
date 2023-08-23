import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { selectionActions } from "../store";
import { BtnCellRenderer } from "../utils/CellBtnRenderer";
import { Button, Grid, Typography, Modal } from "@mui/material";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

function EmployeeTable() {
  const activeCafe = useSelector((state) => state.activeCafe);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeForDeletion, setEmployeeForDeletion] = useState(null);

  const location = useLocation();

  function fetchEmployees() {
    axios
      .get(`${baseURL}/employees`, {
        params: {
          cafeId: activeCafe?._id,
        },
      })
      .then((res) => setEmployeeList(res.data));
  }

  useEffect(() => {
    fetchEmployees();
  }, [location]);

  const columns = [
    { field: "employee_id", headerName: "Employee ID" },
    { field: "name", headerName: "Name", filter: "agTextColumnFilter", minWidth: 200 },
    {
      field: "email_address",
      headerName: "Email Address",
      filter: "agTextColumnFilter",
      minWidth: 300
    },
    { field: "phone_number", headerName: "Phone Number" },
    { field: "days_worked", headerName: "Days worked in the café" },
    {
      field: "cafe",
      headerName: "Cafe Name",
      filter: "agTextColumnFilter",
      valueGetter: (params) => activeCafe.name, // This will always return the value of cafeName
    },
    {
      field: "employee_id",
      headerName: "Edit",
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked: function (field) {
          handleEdit(field);
        },
        title: "Edit",
      },
    },
    {
      field: "employee_id",
      headerName: "Delete",
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked: function (field) {
          requestConfirmDelete(field);
        },
        title: "Delete",
      },
    },
  ];

  function handleDelete() {
    setModalOpen(false);
    axios
      .delete(`${baseURL}/employees`, {
        data: {
          id: employeeForDeletion.employee_id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          fetchEmployees();
        } else {
          window.alert(
            "Oops, there was an error while deleting employee. Please try again later."
          );
        }
      });
  }

  function requestConfirmDelete(employee) {
    setEmployeeForDeletion(employee);
    setModalOpen(true);
  }

  function handleEdit(employee) {
    dispatch(selectionActions.setEditEmployee(employee));
    navigate("/edit-add-employees");
  }

  function handleCreate() {
    navigate("/edit-add-employees");
  }

  function onGridReady(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
  
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item container justifyContent={"center"} alignItems={"center"}>
        {activeCafe && (
          <Typography variant="h5" paddingTop={"24px"}>
            Employees for {activeCafe.name}
          </Typography>
        )}
      </Grid>
      <Grid item style={{ width: "100%" }}>
        {activeCafe && (
          <div
            className="ag-theme-alpine"
            style={{ height: "auto", width: "100%" }}
          >
            <AgGridReact
              columnDefs={columns}
              rowData={employeeList}
              rowSelection="single"
              domLayout="autoHeight"
              defaultColDef={{
                resizable: true, // Allows column width to be resizable
              }}
              onGridReady={onGridReady}
            />
          </div>
        )}
        {!activeCafe && (
          <h2 style={{ textAlign: "center" }}>
            Select cafe from cafe page to view employees
          </h2>
        )}
      </Grid>
      <Grid item container justify="center" justifyContent={"center"}>
        <Button variant="contained" onClick={() => handleCreate()}>
          Add New Employee
        </Button>
      </Grid>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            backgroundColor: "white",
            padding: "16px",
            outline: "none",
          }}
        >
          <Typography variant="h6" id="simple-modal-title">
            Confirm Deletion
          </Typography>
          <Typography variant="body1" id="simple-modal-description">
            Are you sure you want to delete this employee?
          </Typography>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => setModalOpen(false)}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Grid>
  );
}

export default EmployeeTable;
