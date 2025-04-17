import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

function PatientDataCheck() {
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(true);

    // Ensures consistent YYYY-MM-DD format
    const formatDate = (date) => {
        return new Date(date).toISOString().split("T")[0];
    };
    useEffect(() => {
        const today = formatDate(new Date());
        setSelectedDate(today);
        fetchPatients(today);
    }, []);

    const fetchPatients = async (date) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://aashutosh-backend.vercel.app/patients-by-date?date=${date}`);
            setFilteredPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients by date:", error);
            setFilteredPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event) => {
        const selected = event.target.value;  // already in YYYY-MM-DD format from input
        setSelectedDate(selected);
        fetchPatients(selected);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <img
                    src="https://media.tenor.com/1s1_eaP6BvgAAAAC/rainbow-spinner-loading.gif"
                    alt="loading"
                    className="img-fluid bg-white"
                    width={150}
                />
            </div>
        );
    }

    return (
        <div className="bg">
            <div className="container py-5">
                <h2 className="text-center mb-3 fw-bold">View Patients by Date</h2>

                <div className="mb-3 mx-auto col-8 col-sm-6 col-lg-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="form-control w-100"
                    />
                </div>

                <div className="table-responsive">
                    <Table striped bordered className="border border-dark text-center fs-6">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>E-mail</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient._id}>
                                        <td>{selectedDate}</td>
                                        <td>{patient.full_name}</td>
                                        <td>{patient.email}</td>
                                        <td>{patient.phone_number}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No Patients Found for this Date</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default PatientDataCheck;
