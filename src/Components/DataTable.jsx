import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../assets/CSS/DataTable.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomTableTitle = () => (
  <div>
    <div className="row align-items-center justify-content-sm-start justify-content-center p-3 ms-sm-5 ms-0">
      <img
        src={require("../assets/image/Ashutosh2.png")}
        alt=""
        className="p-2 bg2 image"
      />
    </div>
  </div>
);

function DataTable() {
  const server = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();

  const ViewPatientDetails = (id) => {
    if (!localStorage.getItem("Doctor's_id")) {
      navigate("/login");
    } else {
      navigate("/ViewPatientDetails");
      localStorage.setItem("ViewPatientDetails", id);
    }
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => {
        const date = new Date(params.value);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
      },
    },
    {
      field: "full_name",
      headerName: "Name",
      width: 200,
      renderCell: (params) =>
        typeof params.value === "object"
          ? Object.values(params.value).join(" ")
          : params.value,
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone_number", headerName: "Phone Number", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "blood_group", headerName: "Blood Group", width: 120 },
    { field: "gender_identity", headerName: "Gender", width: 120 },
    {
      field: "_id",
      headerName: "View",
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          className="border border-0 btn btn-light rounded-0"
          onClick={() => ViewPatientDetails(params.value)}
        >
          View
        </button>
      ),
    },
  ];

  const [state, setState] = useState([]);

  useEffect(() => {
    axios.get("https://aashutosh-backend.vercel.app/getpatient").then((response) => {
      setState(response.data);
    });
  }, []);

  return (
    <div className="container-fluid bg text-start" style={{ height: 500, width: "100%" }}>
      <h2><CustomTableTitle /></h2>
      <DataGrid
        rows={state.map((row, index) => ({ id: index, ...row }))}
        columns={columns}
        pageSize={5}
        checkboxSelection
      />
    </div>
  );
}

export default DataTable;
