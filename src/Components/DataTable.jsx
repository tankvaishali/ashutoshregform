import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { HiViewColumns } from 'react-icons/hi2';
import { MdFilterList, MdPrint } from 'react-icons/md';
import * as XLSX from "xlsx";
import "../assets/CSS/DataTable.css";
import { useNavigate } from 'react-router-dom';

function DataTable() {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([
    "Date", "Name", "E-mail", "Phone Number", "Address", "Blood Group", "Gender", "Actions"
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://aashutosh-backend.vercel.app/getpatient")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
    console.log(data);

  }, []);

  const columns = [
    { key: "date_joined", label: "Date" },
    { key: "full_name", label: "Name" },
    { key: "email", label: "E-mail" },
    { key: "phone_number", label: "Phone Number" },
    { key: "address", label: "Address" },
    { key: "blood_group", label: "Blood Group" },
    { key: "gender_identity", label: "Gender" },
    { key: "actions", label: "Actions" },
  ];

  const handleCheckboxChange = (columnLabel) => {
    setSelectedColumns((prev) =>
      prev.includes(columnLabel) ? prev.filter((col) => col !== columnLabel) : [...prev, columnLabel]
    );
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    return (
      (searchDate === "" || item.date_joined.includes(searchDate)) &&
      (searchName === "" || item.full_name.toLowerCase().includes(searchName.toLowerCase())) &&
      (searchEmail === "" || item.email.toLowerCase().includes(searchEmail.toLowerCase())) &&
      (searchPhone === "" || item.phone_number.includes(searchPhone)) &&
      (searchBloodGroup === "" || item.blood_group.toLowerCase().includes(searchBloodGroup.toLowerCase()))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TableData.csv";
    link.click();
  };

  const printTable = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Table</title></head><body>');
    printWindow.document.write('<table border="1" style="width:100%; border-collapse:collapse; text-align:center;">');
    printWindow.document.write('<thead><tr><th>Date</th><th>Name</th><th>E-mail</th><th>Phone Number</th><th>Address</th><th>Blood Group</th><th>Gender</th></tr></thead>');
    printWindow.document.write('<tbody>');
    currentItems.forEach((item, index) => {
      printWindow.document.write(`<tr><td>${item.date_joined}</td><td>${item.full_name}</td><td>${item.email}</td><td>${item.phone_number}</td><td>${item.address}</td><td>${item.blood_group}</td><td>${item.gender_identity}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  let navigate = useNavigate();

  const ViewPatientDetails = (id) => {
    if (!localStorage.getItem("Doctor's_id")) {
      navigate("/login");
    } else {
      navigate("/ViewPatientDetails");
    }
    localStorage.setItem("ViewPatientDetails", id);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <img src="https://media.tenor.com/1s1_eaP6BvgAAAAC/rainbow-spinner-loading.gif" alt="" className='img-fluid bg-white' width={150} />
      </div>
    );
  }

  const handleClosePopup = (e) => {
    if (e.target.id === "overlay") {
      setIsOpen(false);
    }
  };

  const handleCloseFiter = (e) => {
    if (e.target.id === "overlayFilter") {
      setIsVisible(false);
    }
  };

  return (
    <div className="bg text-start">
      <div className='container py-5'>
        <div className='d-flex justify-content-between'>
          <div>
            <img
              src={require("../assets/image/Ashutosh2.png")}
              alt=""
              className="p-2 bg2 image"
            />
          </div>
          <div className="d-flex justify-content-end align-content-center align-items-end mb-3">
            <div className="fs-2" onClick={exportToCSV}>
              <FaCloudDownloadAlt />
            </div>

            <div className="fs-2 ms-2" onClick={printTable}>
              <MdPrint />
            </div>

            <div className="position-relative">
              <div className="fs-2 ms-2" onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                <HiViewColumns />
              </div>
              {isOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" onClick={handleClosePopup} id="overlay">
                  <div className="shadow rounded p-3" style={{ minWidth: "200px", background: "whitesmoke", zIndex: "10" }}>
                    {columns.map((column, index) => (
                      <div key={index} className="my-1">
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(column.label)}
                          onChange={() => handleCheckboxChange(column.label)}
                        />
                        <span className='ms-2' style={{ fontSize: "15px" }}>{column.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="position-relative">
              <div className="fs-2 ms-2" onClick={() => setIsVisible(!isVisible)} style={{ cursor: "pointer" }}>
                <MdFilterList />
              </div>
              {isVisible && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" onClick={handleCloseFiter} id="overlayFilter">
                  <div className="shadow rounded p-4" style={{ minWidth: "200px", background: "whitesmoke", zIndex: "10", fontSize: "15px" }}>
                    <div className="d-flex gap-3">
                      <div className="w-50">
                        <label className="d-block">Date</label>
                        <input type="text" className="w-100 ps-1 text-secondary rounded mt-1" style={{ outline: "none" }} value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                      </div>
                      <div className="w-50">
                        <label className="d-block">Name</label>
                        <input type="text" className="w-100 ps-1 text-secondary rounded mt-1" style={{ outline: "none" }} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                      </div>
                    </div>
                    <div className="d-flex gap-3 mt-2">
                      <div className="w-50">
                        <label className="d-block">E-mail</label>
                        <input type="email" className="w-100 ps-1 text-secondary rounded mt-1" style={{ outline: "none" }} value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                      </div>
                      <div className="w-50">
                        <label className="d-block">Phone Number</label>
                        <input type="tel" className="w-100 ps-1 text-secondary rounded mt-1" style={{ outline: "none" }} value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="d-flex gap-3 mt-2">
                      <div className="w-50">
                        <label className="d-block">Blood Group</label>
                        <input type="text" className="w-100 ps-1 text-secondary rounded mt-1" style={{ outline: "none" }} value={searchBloodGroup} onChange={(e) => setSearchBloodGroup(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="table-responsive my-3">
          <Table striped bordered className="border border-dark text-center">
            <thead className="">
              <tr className='text-center'>
                {columns.map((col, index) =>
                  selectedColumns.includes(col.label) && <th className='fs-6' key={index}>{col.label}</th>
                )}
              </tr>
            </thead>

            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index} className="text-center">
                    {selectedColumns.includes("Date") && <td style={{ fontSize: "15px", width: "12%" }}>{item.date_joined}</td>}
                    {selectedColumns.includes("Name") && <td style={{ fontSize: "15px", width: "10%" }}>{item.full_name}</td>}
                    {selectedColumns.includes("E-mail") && <td style={{ fontSize: "15px", width: "13%" }}>{item.email}</td>}
                    {selectedColumns.includes("Phone Number") && <td style={{ fontSize: "15px", width: "13%" }}>{item.phone_number}</td>}
                    {selectedColumns.includes("Address") && <td style={{ fontSize: "15px", width: "27%" }}>{item.address}</td>}
                    {selectedColumns.includes("Blood Group") && <td style={{ fontSize: "15px", width: "12%" }}>{item.blood_group}</td>}
                    {selectedColumns.includes("Gender") && <td style={{ fontSize: "15px", width: "5%" }}>{item.gender_identity}</td>}
                    {selectedColumns.includes("Actions") && (
                      <td style={{ width: "8%" }}>
                        <Button variant="dark" onClick={() => ViewPatientDetails(item._id)} style={{ fontSize: "15px" }}>View</Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedColumns.length} className="text-center fs-6">No Data Found!</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className='d-flex'>
          <div className="d-flex align-items-center fs-6">
            <label className="me-2">Show Entries</label>
            <select className="form-select shadow-none me-3 w-auto border border-1 border-dark d-inline-block" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="10">10</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>

          <div className="d-flex ms-auto align-items-center fs-6">
            <button className="btn btn-dark me-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              &lt;
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-dark ms-2" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;