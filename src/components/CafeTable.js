import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectionActions } from "../store";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "../utils/CellBtnRenderer";
import { LinkCellRenderer } from "../utils/CellLinkRenderer";
import { Button, Grid, Modal, Typography } from "@mui/material";
import { LogoCellRenderer } from "../utils/CellLogoRenderer";

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

function CafeTable() {
  const [cafes, setCafes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cafeForDeletion, setCafeForDeletion] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cafeForEdit = useSelector((state) => state.editCafe);
  const location = useLocation();

  useEffect(() => {
    fetchCafes();
  }, [cafeForEdit, location]);

  const columns = [
    {
      field: "logo",
      headerName: "Logo",
      cellRenderer: LogoCellRenderer,
    },
    { field: "name", headerName: "Name", filter: "agTextColumnFilter" },
    {
      field: "description",
      headerName: "Description",
      filter: "agTextColumnFilter",
      minWidth: 400
    },
    {
      field: "employees",
      headerName: "Employees",
      cellRenderer: LinkCellRenderer,
      cellRendererParams: {
        clicked: function (cafe) {
          dispatch(selectionActions.setActiveCafe(cafe));
        },
      },
    },
    { field: "location", headerName: "Location", filter: "agTextColumnFilter" },
    {
      field: "_id",
      headerName: "Edit",
      minWidth: 100,
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked: function (data) {
          handleEdit(data);
        },
        title: "Edit",
      },
    },
    {
      field: "_id",
      headerName: "Delete",
      minWidth: 100,
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked: function (data) {
          requestConfirmDelete(data);
        },
        title: "Delete",
      },
    },
  ];

  function fetchCafes() {
    axios.get(`${baseURL}/cafes`).then((res) => setCafes(res.data));
  }

  function handleDelete() {
    setModalOpen(false);
    axios
      .delete(`${baseURL}/cafes`, {
        data: {
          cafeId: cafeForDeletion._id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          fetchCafes();
        } else {
          window.alert(
            "Oops, there was an error while deleting cafe. Please try again later."
          );
        }
      });
  }

  function requestConfirmDelete(cafe) {
    setCafeForDeletion(cafe);
    setModalOpen(true);
  }

  function handleEdit(cafe) {
    dispatch(selectionActions.setEditCafe(cafe));
    navigate("/edit-add-cafes");
  }

  function handleCreate() {
    navigate("/edit-add-cafes");
  }

  function onGridReady(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
  
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }

  return (
    <div>
      <Grid container spacing={3} direction="column">
        <Grid item style={{ width: "100%" }}>
          <div
            className="ag-theme-alpine"
            style={{ height: "auto", width: "100%" }}
          >
            <AgGridReact
              columnDefs={columns}
              rowData={cafes}
              rowSelection="single"
              domLayout="autoHeight"
              defaultColDef={{
                resizable: true, // Allows column width to be resizable
              }}
              onGridReady={onGridReady}
            />
          </div>
        </Grid>
        <Grid item container justify="center" justifyContent={"center"}>
          <Button variant="contained" onClick={() => handleCreate()}>
            Add New Cafe
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
              Are you sure you want to delete this cafe?
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
    </div>
  );
}

export default CafeTable;
