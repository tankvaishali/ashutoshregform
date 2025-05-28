import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { CgLogIn } from 'react-icons/cg';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';

function Logindoc() {
    const navigate = useNavigate()
    const ID_Password = [
        { id: "1234567890", password: "Doctor1" },
        { id: "0987654321", password: "Doctor2" },
        { id: "9087654321", password: "Doctor3" },
        { id: "5678901234", password: "Doctor4" },
        { id: "2345178906", password: "Doctor5" },
    ]

    const [logid, setLogid] = useState('')
    const [logpassword, setLogpassword] = useState('')
    const HandleVerify = () => {
        const isValid = ID_Password.find(entry => entry.id === logid && entry.password === logpassword);
        if (isValid) {
            navigate('/ViewPatientDetails');
            localStorage.setItem("Doctor's_id", isValid.id)
        } else {
            alert("Invalid ID or password.");
        }

    };

    return (
        <>
            <div className="container-fluid bg">
                <div className='row align-items-center justify-content-center vh-100'>
                    <Form className='col-lg-8 col-md-9 col-sm-10 col-11'>
                        <div className="container ms-4 mb-4">
                            <Link to={"/DataTable"}>
                                <div className='text-start mt-4'>
                                    <button type='button' className='btn btn-dark fw-medium pb-2'><FaArrowLeftLong /></button>
                                </div>
                            </Link>
                        </div>
                        <div className='row align-items-center justify-content-evenly'>
                            <div className="col-sm-6 col-11 p-0 row align-items-center justify-content-center">
                                <div className='col-sm-9 col-10 m-5'>
                                    <img src={require('../assets/image/Ashutosh2.png')} alt="" className='img-fluid p-2 bg2' />
                                </div>
                            </div>
                            <div className="col-sm-6 col-11 p-0 row align-items-center justify-content-end">
                                <div className="p-0">
                                    <Form.Label>Only For Doctor's</Form.Label>
                                    <Form.Group className="mb-3" controlId="formBasicDate">
                                        <InputGroup>
                                            <InputGroup.Text id="basic-addon1"><CgLogIn /></InputGroup.Text>
                                            <Form.Control type='text' placeholder="Plese Enter Doctor's Verification ID" value={logid} onChange={(e) => setLogid(e.target.value)} className="custom-select p-3 placehold" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPatientType">
                                        <InputGroup>
                                            <InputGroup.Text id="basic-addon1"><RiLockPasswordFill /></InputGroup.Text>
                                            <Form.Control type='password' placeholder='Plese Enter Password' value={logpassword} onChange={(e) => setLogpassword(e.target.value)} className="custom-select p-3 placehold" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPatientType">
                                        <button type="button" className='btn btn-dark' onClick={HandleVerify}>Verify</button>
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div >
            </div >
        </>
    )
}

export default Logindoc