import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { BiEdit, BiMaleFemale } from 'react-icons/bi';
import { TextField } from '@material-ui/core';
import { MdBloodtype, MdDevices, MdOutlineAlternateEmail } from 'react-icons/md';
import { FaAddressCard, FaBirthdayCake, FaDiagnoses } from 'react-icons/fa';
import { FcContacts } from 'react-icons/fc';
import axios from 'axios';
import Select from 'react-select';

function ViewPatientDetails() {
    const dataId = localStorage.getItem("ViewPatientDetails");
    const server = process.env.REACT_APP_BASE_URL
    const [State, setState] = useState([])

    useEffect(() => {
        setState([...State])
        axios.get(server + 'get-patinet-info/?user_id=' + dataId).then(function (response) {
            setState(response.data.data)
        })

    }, [])
    let selectedData = State.find(d => d.id === dataId);

    const [rows, setRows] = useState([]);
    let [newRow, setNewRow] = useState({});
    const [adding, setAdding] = useState(false);

    const handleAdd = () => {
        setAdding(true);
        setNewRow({});
    };

    const handleChange = (e, name) => {
        setNewRow({ ...newRow, [name]: e.target.value });
    };

    useEffect(() => {
        getdata()
    }, [])

    const [Payment, setPayment] = useState([])
    const [EditD, setEditd] = useState(false)

    const handleSave = () => {
        setRows([newRow, ...rows]);
        setAdding(false);
        console.log([newRow, ...rows]);
        if (newRow.id === undefined) {
            newRow.user_id = dataId
            axios.post(server + 'patient-payment-details/', newRow)
                .then(function (response) {
                    console.log(response);
                    getdata()
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            newRow.user_id = dataId
            newRow.payment_id = newRow.id
            delete newRow.date_created
            delete newRow.id
            delete newRow.total_amount
            setNewRow({ ...newRow })

            axios.put(server + 'patient-payment-details/', newRow).then((res) => {
                console.log(res);
                getdata()
            })
        }

    };

    const getdata = () => {
        axios.get(server + 'patient-payment-details/?user_id=' + dataId).then(function (response) {
            setPayment(response.data.data)
        })
    }

    const EditPayment = (id) => {
        setAdding(true);
        let editObj = Payment.find((x) => x.id === id)
        setNewRow({ ...editObj })
    }

    const [selectedDataq, setSelectedDataq] = useState({ diagnosis_name: "", device_name: "", });
    const [device, setDevice] = useState('')
    const [array, setArray] = useState('')
    const DeviceName = () => {
        //Devices_Data
        axios.get(server + 'filter-device-data/')
            .then((response) => {
                // console.log(response.data.data);
                setDevice(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });


    }
    const DiognoseName = () => {


        //Diagnosis_Data
        axios.get(server + 'filter-diagnosis-data/')
            .then(function (response) {
                setArray(response.data.data);
                // console.log(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    useEffect(() => {
        DiognoseName()
        DeviceName()
    }, [])

    const handleDiagnosisChange = selectedOption => {
        if (selectedOption) {
            setSelectedDataq({ ...selectedDataq, diagnosis_name: selectedOption.label });
        } else {
            setSelectedDataq({ ...selectedDataq, diagnosis_name: '' });
        }
    };


    const handleDeviceChange = selectedOption => {
        if (selectedOption) {
            setSelectedDataq({ ...selectedDataq, device_name: selectedOption.label });
        } else {
            setSelectedDataq({ ...selectedDataq, device_name: '' });
        }
    };
    const EDitDiog = () => {
        setEditd(true)
    }
    const handleSaveedit = () => {
        setEditd(false)

    }

    const Arrayoptions = (array || []).map((diagnosis) => ({
        label: diagnosis.diagnosis_name,
        value: diagnosis.diagnosis_name,
    }));

    const DevicesOptions = (device || []).map((Device) => ({
        label: Device.device_name,
        value: Device.device_name,
    }));

    if (!selectedData) return <p>Loading...</p>;
    const dateString = selectedData.date_joined
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    return (
        <div className='bg py-3'>
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className=" row align-items-center">
                        <Container className="">
                            <Card className='bg'>
                                <Card.Header as="h5" className="text-center display-6">Patient's Personal Details</Card.Header>
                                <Card.Body>
                                    <div className='row justify-content-center align-items-center pb-3'>
                                        <div className='col-md-6 col-11'>
                                            <div className="row justify-content-center">
                                                <div className='col-sm-7 col-7 bgborder py-sm-3 py-3'>
                                                    <img src={require('../assets/image/Ashutosh2.png')} alt="" className='p-sm-5 img-fluid  bg2' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6 col-11'>
                                            <div className="my-3 row justify-content-md-between justify-content-center">
                                                <div className="col-10 shadow-lg p-3 bg-body-none rounded">
                                                    <div className='text-end'>
                                                        <BiEdit onClick={EDitDiog} className='text-center' />
                                                    </div>
                                                    <div className='fs-6 fw-normal p-2 text-end'><strong>Entry Date:</strong> {formattedDate}</div>
                                                    {/* <div className='fs-6 fw-normal p-2 text-end'><strong>Entry Date:</strong> {selectedData.date_joined}</div> */}
                                                    <h1 className='fw-normal p-2 text-capitalize'>{selectedData.name}</h1>
                                                    <div className='fs-6 fw-normal p-2 row align-items-center justify-content-start'>
                                                        <MdOutlineAlternateEmail className='col-sm-2 col-3' />
                                                        <div className="col-9">{selectedData.email}</div>
                                                    </div>
                                                    <div className='fs-6 fw-normal p-2 row align-items-center justify-content-start'>
                                                        <FcContacts className='col-sm-2 col-3' />
                                                        <div className="col-9">{selectedData.phone_number}</div>
                                                    </div>
                                                    <div className='fs-6 fw-normal p-2 text-capitalize row align-items-center justify-content-start'>
                                                        <FaAddressCard className='col-sm-2 col-3' />
                                                        <div className="col-9">{selectedData.address}</div>
                                                    </div>
                                                    <div className='fs-6 fw-normal p-1 mb-3 text-capitalize row align-items-center justify-content-start'>
                                                        <FaDiagnoses className='col-sm-2 col-3' />
                                                        <div className="col-9">

                                                            {EditD ? (
                                                                <Select
                                                                    value={array.find(option => option.label === selectedDataq.diagnosis_name)}
                                                                    onChange={handleDiagnosisChange}
                                                                    options={Arrayoptions}
                                                                    className=' w-100 border-bottom border-dark bg-transparent rounded'
                                                                    placeholder="Select a diagnosis"
                                                                    getOptionLabel={option => option.label}
                                                                    getOptionValue={option => option.value}
                                                                />
                                                            ) : selectedDataq.diagnosis_name}
                                                        </div>
                                                    </div>
                                                    <div className='fs-6 fw-normal p-1 mb-3 text-capitalize row align-items-center justify-content-start'>
                                                        <MdDevices className='col-sm-2 col-3' />
                                                        <div className="col-9">
                                                            {EditD ? (
                                                                <Select
                                                                    value={device.find(option => option.label === selectedDataq.device_name)}
                                                                    onChange={handleDeviceChange}
                                                                    options={DevicesOptions}
                                                                    className=' w-100  border-bottom border-dark bg-transparent rounded'
                                                                    placeholder="Select a diagnosis"
                                                                    getOptionLabel={option => option.label}
                                                                    getOptionValue={option => option.value}
                                                                />
                                                            ) : selectedDataq.device_name}
                                                        </div>
                                                    </div>

                                                    <div className="row align-items-center justify-content-evenly">
                                                        <div className='col-4 fs-6 fw-normal p-2 text-capitalize'><BiMaleFemale className='col-4' />{selectedData.gender_identity}</div>
                                                        <div className='col-4 fs-6 fw-normal p-2 text-capitalize'><MdBloodtype className='col-4' />{selectedData.blood_group}(positive)</div>
                                                        <div className='col-4 fs-6 fw-normal p-2 text-capitalize'><FaBirthdayCake className='col-4' />{selectedData.age} years</div>
                                                    </div>
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                        {EditD ? <Button onClick={() => handleSaveedit()} variant="dark">Save</Button> : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Table responsive className='bg text-center '>
                                        <thead>
                                            <tr>
                                                <th className='fw-normal' style={{ background: 'none' }}><div className='mb-2'>Last Visit</div></th>
                                                <th className='fw-normal' style={{ background: 'none' }}><div className='mb-2'>File Charge</div></th>
                                                <th className='fw-normal' style={{ background: 'none' }}><div className='mb-2'>Total Charge</div></th>
                                                <th className='fw-normal' style={{ background: 'none' }}><div className='mb-2'>Paid Amount</div></th>
                                                <th className='fw-normal' style={{ background: 'none' }}><div className='mb-2'>pendingAmount</div></th>
                                                <th className='fw-normal' style={{ background: 'none' }}>
                                                    <div className='mb-3'><BiEdit onClick={() => handleAdd()} /></div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {adding && (
                                                <tr>
                                                    {console.log(newRow)}
                                                    <td>
                                                        <TextField type="date" className='display-4' value={newRow.date} onChange={(e) => handleChange(e, 'date')} />
                                                    </td>
                                                    <td><TextField type="number" value={newRow.file_charge} onChange={(e) => handleChange(e, 'file_charge')} /></td>
                                                    <td><TextField type="number" value={newRow.total_charge_amount} onChange={(e) => handleChange(e, 'total_charge_amount')} /></td>
                                                    <td><TextField type="number" value={newRow.paid_amount} onChange={(e) => handleChange(e, 'paid_amount')} /></td>
                                                    <td><TextField type="number" disabled value={newRow.pendingAmount} onChange={(e) => handleChange(e, 'pendingAmount')} /></td>
                                                    <td><Button onClick={() => handleSave()} variant="dark">Save</Button></td>
                                                </tr>
                                            )}

                                            {Payment.map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className='fs-6' style={{ background: 'none' }}>{
                                                        `${new Date(row.date_created).getDate().toString().padStart(2, '0')}/${(new Date(row.date_created).getMonth() + 1).toString().padStart(2, '0')}/${new Date(row.date_created).getFullYear()}`}</td>
                                                    <td className='fs-6' style={{ background: 'none' }}>{row.file_charge}</td>
                                                    <td className='fs-6' style={{ background: 'none' }}>{row.total_charge_amount}</td>
                                                    <td className='fs-6' style={{ background: 'none' }}>{row.paid_amount}</td>
                                                    <td className='fs-6' style={{ background: 'none' }}>{row.total_amount}</td>
                                                    <td className='fs-6' style={{ background: 'none' }}><Button variant="dark" onClick={() => { EditPayment(row.id) }}>Edit Payment</Button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Container>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ViewPatientDetails;
