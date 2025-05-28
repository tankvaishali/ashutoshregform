import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BsDropletHalf } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function DateNow() {
    const [patientInfo, setPatientInfo] = useState({
        entryDate: new Date().toISOString().substring(0, 10),
        patientType: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "patientType") {
            // Navigate based on selection
            if (value === 'new') {
                navigate('/Registration');
            } else if (value === 'old') {
                navigate('/DataTable');
            } else if (value === 'viewpatientsbydate') {
                navigate('/patientdatacheck');
            }
            return; // Prevent setting state if navigation is happening
        }
        // Set state for other form elements
        setPatientInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    return (
        <div className="container-fluid bg">
            <div className='row align-items-center justify-content-center vh-100'>
                <Form className='col-lg-8 col-md-9 col-sm-10 col-11'>
                    <div className='row align-items-center justify-content-evenly'>
                        <div className="col-sm-6 col-11 p-0 row align-items-center justify-content-center">
                            <div className='col-sm-9 col-10 m-5'>
                                <img src={require('../assets/image/Ashutosh2.png')} alt="" className='img-fluid p-2 bg2' />
                            </div>
                        </div>
                        <div className="col-sm-6 col-11 p-0 row align-items-center justify-content-end">
                            <div className="p-0">
                                <Form.Group className="mb-3" controlId="formBasicDate">
                                    <Form.Label>Date of Entry</Form.Label>
                                    <Form.Control className='p-3' type="date" name="entryDate" value={patientInfo.entryDate} disabled onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPatientType">
                                    <Form.Label>Patient Type</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text id="basic-addon1"><BsDropletHalf /></InputGroup.Text>
                                        <Form.Control as="select" name="patientType" value={patientInfo.patientType} onChange={handleChange} className="custom-select p-3 placehold">
                                            <option value="" style={{ background: '#2a16186b' }}>Select Patient Type</option>
                                            <option key='New' value="new" style={{ background: '#2a16186b' }}>New Case</option>
                                            <option key='old' value="old" style={{ background: '#2a16186b' }}>Old Case</option>
                                            <option key='viewpatientsbydate' value="viewpatientsbydate" style={{ background: '#2a16186b' }}>View Patients By Date</option>
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}


export default DateNow