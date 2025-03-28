import React, { useEffect, useState } from 'react';
import '../assets/CSS/MainSection.css';
import { Form, Button, InputGroup, FormControl, FormGroup, Row, Col } from 'react-bootstrap';
import { IoMail } from 'react-icons/io5';
import { HiDeviceMobile } from 'react-icons/hi';
import { BsCashCoin, BsCurrencyDollar, BsDropletHalf } from 'react-icons/bs';
import { CiStethoscope } from 'react-icons/ci';
import { FaHospital, FaPrint, FaUserMd } from 'react-icons/fa';
import axios from 'axios';
import Select from 'react-select';
import { MdAir } from 'react-icons/md';

function Mainsection() {

    const [patientInfo, setPatientInfo] = useState({
        id: Date.now(), name: { Title: '', first_name: '', middle_name: '', last_name: '', },
        street: '', city: '', state: '', country: '', Zipcode: '', age: '', bloodGroup: '', phone_number: '', email: '', diagnosis: '', devices: '',
        Hospital: '', Doctor: '', totalBill: '', paidAmount: '', entryDate: new Date().toISOString().substring(0, 10) // Today's date in YYYY-MM-DD format
    });
    const [array, setArray] = useState([])
    const [Device, setDevice] = useState([])
    const [DoctorName, setDoctor] = useState([])
    const [Hospital, setHospital] = useState([])
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const [display, setDisplay] = useState(false)
    const [errormsg, seterrormsg] = useState({});
    // All Onchange
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValues = { ...patientInfo };
        let newErrors = { ...errormsg };

        if (name.includes('.')) {
            const nameParts = name.split('.');
            newValues[nameParts[0]] = {
                ...newValues[nameParts[0]],
                [nameParts[1]]: value
            };
        } else {
            newValues[name] = value;
        }

        setPatientInfo(newValues);

        if (!value) {
            newErrors[name] = `${name.split('.').pop()} is required`;
        } else {
            delete newErrors[name];
        }

        if (name === "name.middle_name" || name === "name.last_name") {
            if (!value?.trim()) {
                // If the field is empty, don't set an error immediately, as one of the two is required
                delete newErrors[name];
            } else if (!/^[a-zA-Z]+$/.test(value)) {
                // If filled but incorrect (not alphabetical), set an error
                newErrors[name] = "Only alphabetic characters are allowed.";
            } else {
                // If the input is correct, clear the error
                delete newErrors[name];
            }
        }

        // Check that at least one of the fields is correctly filled
        const otherField = name === "name.middle_name" ? "name.last_name" : "name.middle_name";
        if (patientInfo[otherField]?.trim() || value?.trim()) {
            if ((patientInfo[otherField]?.trim() && !newErrors[otherField]) || (!newErrors[name] && value?.trim())) {
                delete newErrors["name.middle_name"];
                delete newErrors["name.last_name"];
            }
        } else {
            newErrors["name.middle_name"] = "Either Middle name or Last name is required";
            newErrors["name.last_name"] = "Either Middle name or Last name is required";
        }

        seterrormsg(newErrors);
        switch (name) {
            case "Title":
                if (!value) {
                    newErrors.Title = "Identity is required";
                } else {
                    delete newErrors.Title;
                }
                break;
            case "name.first_name":
                if (value.length <= 0) {
                    newErrors.first_name = "First name is required";
                } else if (!/^[a-zA-Z]+$/.test(value)) {
                    newErrors.first_name = "enter valid name";
                }
                else {
                    delete newErrors.first_name;
                }
                break;
            case "name.middle_name":
                if (!/^[a-zA-Z]+$/.test(value)) {
                    newErrors["name.middle_name"] = "enter valid name";
                } else {
                    delete newErrors["name.middle_name"];
                }
                break;
            case "name.last_name":
                if (!/^[a-zA-Z]+$/.test(value)) {
                    newErrors["name.last_name"] = "enter valid name";
                } else {
                    delete newErrors["name.last_name"];
                }
                break;
            case "phone_number":
                if (value.length <= 0) {
                    newErrors.phone_number = "Mobile number is required";
                } else if (value.length > 10) {
                    newErrors.phone_number = "max 10 character required";
                } else if (value.length < 10) {
                    newErrors.phone_number = "must be 10 character required";

                }
                else {
                    delete newErrors.phone_number;
                }
                break;

            case "email":
                if (value.length <= 0) {
                    newErrors.email = "email is required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    newErrors.email = "email is not valid";
                } else {
                    delete newErrors.email;
                }
                break;
            case "age":
                if (value.length <= 0) {
                    newErrors.age = "Age is required";
                } else if (!/^\d+$/.test(value)) { // Ensure the input is a number
                    newErrors.age = "Age must be a valid number";
                } else if (parseInt(value) <= 0 || parseInt(value) > 120) { // Additional check for reasonable age
                    newErrors.age = "Please it's required";
                } else {
                    delete newErrors.age;
                }
                break;
            case "bloodGroup":
                if (!value) {
                    newErrors.bloodGroup = "Blood group is required";
                } else {
                    delete newErrors.bloodGroup;
                }
                break;
            case "Diagnosis":
                if (!value) {
                    newErrors.Diagnosis = "Diagnosis is required";
                } else {
                    delete newErrors.Diagnosis;
                }
                break;
            case "Devices ":
                if (!value) {
                    newErrors.Devices = "Devices is required";
                } else {
                    delete newErrors.Devices;
                }
                break;
            case "Doctor":
                if (!value) {
                    newErrors.Doctor = "Doctor is required";
                } else {
                    delete newErrors.Doctor;
                }
                break;
            case "Hospital":
                if (!value) {
                    newErrors.Hospital = "Hospital is required";
                } else {
                    delete newErrors.Hospital;
                }
                break;
            default:
                break;
        }

        seterrormsg(newErrors);
    };

    const [inputValue, setInputValue] = useState('');
    // OnInputChange
    const handleInputChange = newValue => {
        setInputValue(newValue);
    };
    const handleInputChange1 = newValue => {
        setInputValue(newValue);
    };
    const handleInputChange2 = newValue => {
        setInputValue(newValue);
    };
    const handleInputChange3 = newValue => {
        setInputValue(newValue);
    };

    // OnChange={handleDiagnosisChange} 
    const handleDiagnosisChange = selectedOption => {
        const newValues = {
            ...patientInfo,
            diagnosis: selectedOption ? selectedOption.value : ''
        };
        setPatientInfo(newValues);

        const newErrors = { ...errormsg };
        if (selectedOption) {
            delete newErrors.diagnosis;
            seterrormsg(newErrors);
        }
    };

    const handleDeviceChange = selectedOption => {
        const newValues = {
            ...patientInfo,
            devices: selectedOption ? selectedOption.value : ''
        };
        setPatientInfo(newValues);

        const newErrors = { ...errormsg };
        if (selectedOption) {
            delete newErrors.devices;
            seterrormsg(newErrors);
        }
    };

    const handleDoctorChange = selectedOption => {
        const newValues = {
            ...patientInfo,
            Doctor: selectedOption ? selectedOption.value : ''
        };
        setPatientInfo(newValues);

        const newErrors = { ...errormsg };
        if (selectedOption) {
            delete newErrors.Doctor;
            seterrormsg(newErrors);
        }
    };

    const handleHospitalChange = selectedOption => {
        const newValues = {
            ...patientInfo,
            Hospital: selectedOption ? selectedOption.value : ''
        };
        setPatientInfo(newValues);

        const newErrors = { ...errormsg };
        if (selectedOption) {
            delete newErrors.Hospital;
            seterrormsg(newErrors);
        }
    };

    const options = array.map((diagnosis) => ({
        label: diagnosis.diagnosis_name,
        value: diagnosis.diagnosis_name,
        id: diagnosis.id
    }));

    const options1 = Device.map((device) => ({
        label: device.device_name,
        value: device.device_name,
        id: device.id
    }));
    const options3 = DoctorName.map((doctor) => ({
        label: doctor.name,
        value: doctor.name,
        id: doctor.id
    }));
    const options4 = Hospital.map((hospital) => ({
        label: hospital.name,
        value: hospital.name,
        id: hospital.id
    }));

    //Regester Patient Data
    const ApiCall = () => {
        try {
            axios.post('https://aashutosh-backend.vercel.app/add-patient', {
                name: {
                    first_name: patientInfo.name.first_name,
                    middle_name: patientInfo.name.middle_name,
                    last_name: patientInfo.name.last_name,
                },
                date_joined: new Date().toISOString().substring(0, 10),
                email: patientInfo.email,
                phone_number: "+91" + patientInfo.phone_number,
                add: {
                    street: patientInfo.street,
                    city: patientInfo.city,
                    zip_code: +patientInfo.Zipcode,
                    state: patientInfo.state,
                    country: patientInfo.country
                },
                age: patientInfo.age,
                diagnosis_name: patientInfo.diagnosis,
                device_name: patientInfo.devices,
                doctor_name: patientInfo.Doctor,
                Hospital_name: patientInfo.Hospital,
                gender_identity: patientInfo.name.Title,
                blood_group: patientInfo.bloodGroup,
                patient_payment: {
                    total_charge_amount: +patientInfo.totalBill,
                    paid_amount: +patientInfo.paidAmount,
                    file_charge: 500
                }
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }
    // Submit Regester Data
    const handleSubmit = (e) => {
        e.preventDefault();

        let isValid = true;
        const newErrormsg = {};

        if (!patientInfo.name.Title) {
            newErrormsg['name.Title'] = "Please it's required";
        }

        if (!patientInfo.name.first_name) {
            newErrormsg.first_name = "Please it's required";
        }


        if (!patientInfo.name.middle_name?.trim() && !patientInfo.name.last_name?.trim()) {
            newErrormsg["name.middle_name"] = "Either Middle name or Last name is required";
            newErrormsg["name.last_name"] = "Either Middle name or Last name is required";
            isValid = false;
        } else {
            if (patientInfo.name.middle_name?.trim() && !/^[a-zA-Z]+$/.test(patientInfo.name.middle_name)) {
                newErrormsg["name.middle_name"] = "Only characters are allowed.";
                isValid = false;
            }
            if (patientInfo.name.last_name?.trim() && !/^[a-zA-Z]+$/.test(patientInfo.name.last_name)) {
                newErrormsg["name.last_name"] = "Only characters are allowed.";
                isValid = false;
            }
        }

        if (!patientInfo.phone_number) {
            newErrormsg.phone_number = "Please it's required";
        }

        if (!patientInfo.email) {
            newErrormsg.email = "Please it's required";
        }

        if (!patientInfo.age) {
            newErrormsg.age = "Please it's required";
        } else if (patientInfo.age <= 0 || patientInfo.age > 120) {
            newErrormsg.age = "Please it's required";
        }

        if (!patientInfo.bloodGroup) {
            newErrormsg.bloodGroup = "Blood group is required";
        }

        if (!patientInfo.diagnosis) {
            newErrormsg.diagnosis = "Please it's required";
        }

        if (!patientInfo.devices) {
            newErrormsg.devices = "Please it's required";
        }

        if (!patientInfo.Doctor) {
            newErrormsg.Doctor = "Please it's required";
        }

        if (!patientInfo.Hospital) {
            newErrormsg.Hospital = "Please it's required";
        }

        if (isValid && Object.keys(newErrormsg).length === 0) {
            ApiCall()
            setArray(prevArray => [...prevArray, patientInfo]);
            setDisplay(true);

        } else {
            seterrormsg(newErrormsg);
            setDisplay(false);
        }
    };

    //Print Data 
    const printPatientInfo = () => {
        const id = Date.now(); // Unique ID
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Patient Information</h1>
            <table style="width: 100%; margin-top: 20px;">
                <tr style="margin: 30px;">
                    <td style="width: 17%;"><strong>Gender</strong></td>
                    <td><strong>:</strong></td>                 
                    <td style="width: 25%; font-weight:600">${patientInfo.name.Title}</td>
                </tr>
                 <tr style="margin: 30px;">
                    <td style="width: 17%;"><strong>Name</strong></td>
                    <td><strong>:</strong></td>                 
                    <td style="width: 25%; font-weight:600">${patientInfo.name.first_name} ${patientInfo.name.middle_name} ${patientInfo.name.last_name}</td>
                </tr>
                <tr style="margin: 30px;">
                    <td><strong>Age</strong></td>
                    <td><strong>:</strong></td>                 
                    <td>${patientInfo.age}</td>
                </tr>
                <tr style="margin: 30px;">
                    <td><strong>Address</strong></td>
                    <td><strong>:</strong></td>                 
                    <td style="width: 90%;">${patientInfo.street}, ${patientInfo.city}, ${patientInfo.state}, ${patientInfo.country}</td>
                </tr>
                <tr style="margin: 30px;">
                    <td><strong>Phone Number</strong></td>
                    <td><strong>:</strong></td>                 
                    <td>${patientInfo.phone_number}</td>
                </tr>
                <tr style="margin: 30px;">
                    <td><strong>Reference</strong></td>
                    <td><strong>:</strong></td>                 
                    <td>SELF</td>
                </tr>
                <tr style="margin: 30px;">
                    <td><strong>ID</strong></td>
                    <td><strong>:</strong></td>                 
                    <td>${id}</td>
                </tr>
                <tr>
                    <td><strong>Date</strong></td>
                    <td><strong>:</strong></td>                 
                    <td>${patientInfo.entryDate}</td>
                </tr>
            </table>
        </div>
        `;
        const newWindow = window.open();
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
    };

    const PrintButton = () => {
        printPatientInfo();
    }
    // Option API
    const server = process.env.REACT_APP_BASE_URL
    useEffect(() => {

        //Devices_Data
        // axios.get(server + 'filter-device-data/')
        axios.get("https://aashutosh-backend.vercel.app/devices")
            .then((response) => {
                // console.log(response.data);
                setDevice(response.data);
            })
            .catch(error => {
                console.log(error);
            });


        //Diagnosis_Data
        axios.get("https://aashutosh-backend.vercel.app/diagnosis")
            .then(function (response) {
                setArray(response.data);
                // console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })

        //Doctor_Data
        // axios.get(server + 'filter-doctor-data/')
        axios.get("https://aashutosh-backend.vercel.app/doctor")
            .then(function (response) {
                setDoctor(response.data);
                // console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })

        //Hospital_Data
        // axios.get(server + 'filter-hospital-data/')
        axios.get("https://aashutosh-backend.vercel.app/hospital")
            .then(function (response) {
                // console.log(response.data);
                setHospital(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })


    }, []);

    const handleReset = () => {
        // window.location.reload();
    }


    return (
        <>
            <div className="container-fluid bg pb-2 ">
                <div className='row align-items-center justify-content-center'>
                    <Form onSubmit={handleSubmit} className='col-lg-8 col-md-9 col-sm-10 col-12 ' >
                        {/*Logo*/}
                        <div className='row align-items-center justify-content-evenly'>
                            <div className="col-sm-6 col-11 p-0 row align-items-center justify-content-center">
                                <div className='col-sm-9 col-7 m-4'>
                                    <img src={require('../assets/image/Ashutosh2.png')} alt="" className='img-fluid p-2 bg2' />
                                </div>
                            </div>

                        </div>
                        {/* Identity */}
                        <div className='row align-items-center justify-content-center justify-content-sm-between'>
                            <Form.Group className="mb-3 col-md-2 col-sm-6 col-3 p-1" controlId="formBasicTitle">
                                <Form.Label>Identity</Form.Label>
                                <Form.Control as="select" name="name.Title" value={patientInfo.name.Title || ''} onChange={handleChange} className="custom-select p-3 placehold">
                                    <option className='bg-none' value="" disabled>Select Title</option>
                                    <option className='bg-none' value="male">Male</option>
                                    <option className='bg-none' value="female">Female</option>
                                </Form.Control>
                                <span className={errormsg ? "span1 text-danger" : "span2"}>{errormsg['name.Title']}</span>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-3 col-sm-6 col-8 p-1" controlId="formBasicfirst_name">
                                <Form.Label>FirstName</Form.Label>
                                <Form.Control type="text" className='p-3 placehold' placeholder="Enter First name" name="name.first_name" value={patientInfo.name.first_name} onChange={handleChange} />
                                <span className={errormsg ? "span1 text-danger" : "span2"}>{errormsg.first_name}</span>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-3 col-sm-6 col-8 p-1" controlId="formBasicmiddle_name">
                                <Form.Label>MiddleName</Form.Label>
                                <Form.Control type="text" className='p-3 placehold' placeholder="Enter Middle name" name="name.middle_name" value={patientInfo.name.middle_name} onChange={handleChange} />
                                <span className={errormsg ? "span1 text-danger" : "span2"}>{errormsg["name.middle_name"]}</span>
                            </Form.Group>
                            <Form.Group className="mb-3 col-md-3 col-sm-6 col-8 p-1" controlId="formBasiclast_name">
                                <Form.Label>LastName</Form.Label>
                                <Form.Control type="text" className='p-3 placehold' placeholder="Enter Last name" name="name.last_name" value={patientInfo.name.last_name} onChange={handleChange} />
                                <span className={errormsg ? "span1 text-danger" : "span2"}>{errormsg["name.last_name"]}</span>
                            </Form.Group>
                        </div>

                        {/* age */}
                        <div className='row align-items-center justify-content-center'>
                            <Form.Group className='mb-3 col-sm-6 col-11 p-1'>
                                <Form.Label>Age</Form.Label>
                                <Form.Control
                                    type="number"
                                    className='p-3 placehold'
                                    placeholder="Enter age"
                                    name="age"
                                    value={patientInfo.age || ''}
                                    onChange={handleChange}
                                />
                                <div className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.age}</div>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicBloodGroup">
                                <Form.Label>Blood Group</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><BsDropletHalf /></InputGroup.Text>
                                    <Form.Control as="select" name="bloodGroup" value={patientInfo.bloodGroup || ''} onChange={handleChange} className="custom-select p-3 placehold">
                                        <option value="" style={{ background: '#2a16186b' }}>Select Blood Group</option>
                                        {bloodGroups.map(group => <option key={group} value={group}>{group}</option>)}
                                    </Form.Control>
                                </InputGroup>
                                <div className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.bloodGroup}</div>
                            </Form.Group>
                        </div>

                        {/* Address */}
                        <div className='row align-items-center justify-content-center'>
                            <FormGroup className="mb-3 p-sm-0 p-3 col-sm-12 " controlId="formBasicBloodGroup">
                                <Form.Label className='ms-sm-0 ms-3'>Address</Form.Label>
                                <div className='container-fluid p-sm-0'>
                                    <Row>
                                        <Col xs={12} md={4} lg={4} >
                                            <FormControl className='p-3 mt-sm-2 mt-2  placehold' placeholder="Street" name="street" value={patientInfo.street} onChange={handleChange} />
                                        </Col>
                                        <Col xs={6} md={4} lg={4} >
                                            <FormControl className='p-3 mt-sm-2 mt-2  placehold' placeholder="City" name="city" value={patientInfo.city} onChange={handleChange} />
                                        </Col>
                                        <Col xs={6} md={4} lg={4} >
                                            <FormControl className='p-3 mt-sm-2 mt-2  placehold' placeholder="State" name="state" value={patientInfo.state} onChange={handleChange} />
                                        </Col>
                                        <Col xs={6} md={6} lg={6} >
                                            <FormControl className='p-3 mt-sm-2 mt-2 mt-sm-4 placehold' placeholder="Country" name="country" value={patientInfo.country} onChange={handleChange} />
                                        </Col>
                                        <Col xs={6} md={6} lg={6} >
                                            <FormControl className='p-3 mt-sm-2 mt-2 mt-sm-4 placehold' placeholder="Zipcode" name="Zipcode" value={patientInfo.Zipcode} onChange={handleChange} />
                                        </Col>
                                    </Row>
                                </div>
                            </FormGroup>
                        </div>

                        {/* Mobile Number */}
                        <div className='row align-items-center justify-content-center'>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicMobile">
                                <Form.Label>Mobile Number</Form.Label>
                                <InputGroup className="">
                                    <InputGroup.Text id="basic-addon1"><HiDeviceMobile /></InputGroup.Text>
                                    <Form.Control className='p-3 placehold' type="tel" placeholder="Enter mobile number" name="phone_number" value={patientInfo.phone_number} onChange={handleChange} />
                                </InputGroup>
                                <span className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.phone_number}</span>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicemail">
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><IoMail /></InputGroup.Text>
                                    <Form.Control className='p-3 placehold' type="email" placeholder="Enter email" name="email" value={patientInfo.email} onChange={handleChange} />
                                </InputGroup>
                                <span className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.email}</span>
                            </Form.Group>
                        </div>

                        {/* Diagnosis */}
                        <div className='row align-items-center justify-content-center'>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicDiagnose">
                                <Form.Label>Diagnosis</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><CiStethoscope /></InputGroup.Text>
                                    <Select
                                        name='diagnosis'
                                        className="flex-grow-1 custom-select p-1 placehold col fs-6 rounded-end"
                                        value={options.find(option => option.value === patientInfo.diagnosis)}
                                        onChange={handleDiagnosisChange}
                                        onInputChange={handleInputChange}
                                        options={options}
                                        placeholder="Select Diagnosis"
                                    />
                                </InputGroup>
                                <div className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.diagnosis}</div>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicDevices">
                                <Form.Label>Devices</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon2"><MdAir /></InputGroup.Text>
                                    <Select
                                        name='devices'
                                        className="flex-grow-1 custom-select p-1 placehold col fs-6 rounded-end"
                                        value={options1.find(option => option.value === patientInfo.devices)}
                                        onChange={handleDeviceChange}
                                        onInputChange={handleInputChange1}
                                        options={options1}
                                        placeholder="Select Devices"
                                        isClearable
                                        isSearchable
                                    />
                                </InputGroup>
                                <div className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.devices}</div>
                            </Form.Group>
                        </div>

                        {/* Ref. Doctor */}
                        <div className='row align-items-center justify-content-center'>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicDiagnose">
                                <Form.Label>Ref. Doctor</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><FaUserMd /></InputGroup.Text>
                                    <Select
                                        name='diagnosis'
                                        className="flex-grow-1 custom-select p-1 placehold col fs-6 rounded-end"
                                        value={options3.find(option => option.value === patientInfo.Doctor)}
                                        onChange={handleDoctorChange}
                                        onInputChange={handleInputChange2}
                                        options={options3}
                                        placeholder="Select Doctor"
                                    />
                                </InputGroup>
                                <div className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.Doctor}</div>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicDevices">
                                <Form.Label>Ref. Hospital</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><FaHospital /></InputGroup.Text>
                                    <Select
                                        name='diagnosis'
                                        className="flex-grow-1 custom-select p-1 placehold col fs-6 rounded-end"
                                        value={options4.find(option => option.value === patientInfo.Hospital)}
                                        onChange={handleHospitalChange}
                                        onInputChange={handleInputChange3}
                                        options={options4}
                                        placeholder="Select Hospital"
                                    />
                                </InputGroup>
                                <div className={errormsg ? "span1 text-danger fs-6" : "span2"}>{errormsg.Hospital}</div>
                            </Form.Group>
                        </div>

                        {/* payment */}
                        <div className='row align-items-center justify-content-center'>
                            <h1 className='fw-normal'>Payment</h1>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicTotalBill">
                                <Form.Label>Total Bill</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><BsCurrencyDollar /></InputGroup.Text>
                                    <Form.Control className='p-3 placehold' type="number" placeholder="Enter total bill amount" name="totalBill" value={patientInfo.totalBill} onChange={handleChange} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-6 col-11 p-1" controlId="formBasicPaidAmount">
                                <Form.Label>Paid Amount</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><BsCashCoin /></InputGroup.Text>
                                    <Form.Control className='p-3 placehold' type="number" placeholder="Enter paid amount" name="paidAmount" value={patientInfo.paidAmount} onChange={handleChange} />
                                </InputGroup>
                            </Form.Group>
                        </div>

                        <div className='row align-items-center justify-content-evenly'>
                            {/* {display === true ?
                                <Button variant="dark" type="" onClick={handleReset} className="w-25 p-3 shadowon">Reset Form<GrPowerReset /></Button>
                                : */}
                            <Button variant="dark" type="submit" className="w-25 p-3 shadowon">Submit</Button>
                            {/* } */}
                            <Button variant="dark" type="" onClick={PrintButton} className="w-25 p-3 shadowon" disabled={!display}>Print <FaPrint /></Button>

                        </div>
                    </Form>


                </div>
            </div >
        </>
    );
}

export default Mainsection;





