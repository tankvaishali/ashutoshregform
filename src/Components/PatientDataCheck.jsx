import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

function PatientDataCheck() {
    const [allPatients, setAllPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        return date ? new Date(date).toISOString().split("T")[0] : null;
    };

    useEffect(() => {
        setLoading(true);
        const currentDate = formatDate(new Date());
        setSelectedDate(currentDate);
        fetchPatients(currentDate);
    }, []);

    const fetchPatients = async (date) => {
        try {
            const response = await axios.get("https://aashutosh-backend.vercel.app/getpatient");
            const patients = response.data;

            const patientDataWithNextVisit = await Promise.all(
                patients.map(async (patient) => {
                    try {
                        const paymentResponse = await axios.get(
                            `https://aashutosh-backend.vercel.app/patient_payment/Patient_id=${patient._id}`,
                            { timeout: 5000 }
                        );
                        const paymentData = paymentResponse.data.data;

                        let nextVisits = paymentData
                            .filter(item => item.next_visit)
                            .map(item => formatDate(item.next_visit));

                        return { ...patient, next_visits: nextVisits };
                    } catch (error) {
                        return { ...patient, next_visits: [] };
                    }
                })
            );

            setAllPatients(patientDataWithNextVisit);
            filterPatientsByDate(patientDataWithNextVisit, date);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterPatientsByDate = (patients, date) => {
        const filteredData = patients.filter(
            (patient) => formatDate(patient.date_joined) === date || patient.next_visits.includes(date)
        );

        setFilteredPatients(filteredData);
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        filterPatientsByDate(allPatients, date);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <img src="https://media.tenor.com/1s1_eaP6BvgAAAAC/rainbow-spinner-loading.gif" alt="" className='img-fluid bg-white' width={150} />
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