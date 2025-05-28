"use client"

import { useEffect, useState } from "react"
import { Container, Table, Button, Card } from "react-bootstrap"
import { BiEdit, BiMaleFemale } from "react-icons/bi"
import { MdBloodtype, MdDevices, MdOutlineAlternateEmail } from "react-icons/md"
import { FaAddressCard, FaBirthdayCake, FaDiagnoses } from "react-icons/fa"
import { FcContacts } from "react-icons/fc"
import axios from "axios"
import Select from "react-select"
import { Link } from "react-router-dom"
import { FaArrowLeftLong } from "react-icons/fa6"

function ViewPatientDetails() {
  const dataId = localStorage.getItem("ViewPatientDetails")
  const server = process.env.REACT_APP_BASE_URL
  const [State, setState] = useState([])
  const [Payment, setPayment] = useState([])
  const [EditD, setEditd] = useState(false)
  const [selectedDataq, setSelectedDataq] = useState({ diagnosis_name: "", device_name: "" })
  const [device, setDevice] = useState([])
  const [array, setArray] = useState([])
  const [rows, setRows] = useState([])
  const [newRow, setNewRow] = useState({})
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get("https://aashutosh-node-backend.onrender.com/edit/" + dataId)
      .then((response) => {
        setState(response.data.data)
        // Initialize selectedDataq with patient's diagnosis and device data
        setSelectedDataq({
          diagnosis_name: response.data.data.diagnosis_name || "",
          device_name: response.data.data.device_name || "",
        })
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))

    getdata()
    DiognoseName()
    DeviceName()
  }, [dataId])

  // Get Payment Data
  const getdata = () => {
    axios
      .get("https://aashutosh-node-backend.onrender.com/patient_payment/Patient_id=" + dataId)
      .then((response) => {
        setPayment(response.data.data)
        console.log(response.data.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const selectedData = State

  const handleAdd = () => {
    setAdding(true)
    setNewRow({})
  }

  const handleChange = (e, name) => {
    setNewRow({ ...newRow, [name]: e.target.value })
  }

  const handleSave = () => {
    setLoading(true)
    setRows([newRow, ...rows])
    setAdding(false)

    if (!newRow._id) {
      // Create new payment record
      axios
        .post("https://aashutosh-node-backend.onrender.com/patient_payment", {
          Patient_id: dataId,
          data: [
            {
              date: newRow.date,
              next_visit: newRow.next_visit,
              total_charge_amount: newRow.total_charge_amount,
              paid_amount: newRow.paid_amount,
              file_charge: newRow.file_charge,
            },
          ],
        })
        .then((response) => {
          console.log(response.data.data)
          getdata()
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log("error", error)
        })
    } else {
      // Update existing payment record
      const updatedPayment = {
        user_id: dataId,
        payment_id: newRow.id,
        date: newRow.date,
        next_visit: newRow.next_visit,
        total_charge_amount: newRow.total_charge_amount,
        paid_amount: newRow.paid_amount,
        file_charge: newRow.file_charge,
      }

      axios
        .put("https://aashutosh-node-backend.onrender.com/payment-update/" + newRow._id, updatedPayment)
        .then((response) => {
          getdata()
          setLoading(false)
          console.log(response)
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
  }

  const EditPayment = (id) => {
    setAdding(true)
    const editObj = Payment.find((x) => x._id === id)
    setNewRow({ ...editObj })
  }

  const DeviceName = () => {
    //Devices_Data
    axios
      .get("https://aashutosh-node-backend.onrender.com/devices")
      .then((response) => {
        setDevice(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const DiognoseName = () => {
    //Diagnosis_Data
    axios
      .get("https://aashutosh-node-backend.onrender.com/diagnosis")
      .then((response) => {
        setArray(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleDiagnosisChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedDataq({ ...selectedDataq, diagnosis_name: selectedOption.label })
    } else {
      setSelectedDataq({ ...selectedDataq, diagnosis_name: "" })
    }
  }

  const handleDeviceChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedDataq({ ...selectedDataq, device_name: selectedOption.label })
    } else {
      setSelectedDataq({ ...selectedDataq, device_name: "" })
    }
  }

  const EDitDiog = () => {
    setEditd(true)
  }

  const handleSaveedit = () => {
    setEditd(false)
    // Save the updated diagnosis and device data
    axios
      .put(`https://aashutosh-node-backend.onrender.com/update/${dataId}`, {
        diagnosis_name: selectedDataq.diagnosis_name,
        device_name: selectedDataq.device_name,
      })
      .then((response) => {
        console.log("Updated patient data:", response.data)
        // Refresh patient data
        axios
          .get("https://aashutosh-node-backend.onrender.com/edit/" + dataId)
          .then((response) => setState(response.data.data))
          .catch((error) => console.error(error))
      })
      .catch((error) => {
        console.error("Error updating patient data:", error)
      })
  }

  const Arrayoptions = Array.isArray(array)
    ? array.map((diagnosis) => ({
      label: diagnosis.diagnosis_name,
      value: diagnosis.diagnosis_name,
    }))
    : []

  const DevicesOptions = Array.isArray(device)
    ? device.map((Device) => ({
      label: Device.device_name,
      value: Device.device_name,
    }))
    : []

  if (!selectedData) return <p>Loading...</p>

  const dateString = selectedData.date_joined
  const date = new Date(dateString)
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <img
          src="https://media.tenor.com/1s1_eaP6BvgAAAAC/rainbow-spinner-loading.gif"
          alt=""
          className="img-fluid bg-white"
          width={150}
        />
      </div>
    )
  }

  return (
    <div className="bg py-3">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center overflow-x-hidden">
          <div className="ms-4 mb-4">
            <Link to={"/DataTable"}>
              <div className='text-start mt-4'>
                <button type='button' className='btn btn-dark fw-medium pb-2'><FaArrowLeftLong /></button>
              </div>
            </Link>
          </div>
          <div className="row align-items-center">
            <Container className="">
              <Card className="bg">
                <Card.Header as="h5" className="text-center display-6">
                  Patient's Personal Details
                </Card.Header>
                <Card.Body className="p-md-3 p-0">
                  <div className="row justify-content-center align-items-center pb-3">
                    <div className="col-md-6 col-11">
                      <div className="row justify-content-center">
                        <div className="col-sm-7 col-7 bgborder py-sm-3 py-3">
                          <img
                            src={require("../assets/image/Ashutosh2.png") || "/placeholder.svg"}
                            alt=""
                            className="p-sm-5 img-fluid bg2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="my-3 row justify-content-md-between justify-content-center">
                        <div className="col-10 shadow-lg p-0 bg-body-none rounded p-0 p-md-3">
                          <div className="text-end">
                            <BiEdit onClick={EDitDiog} className="text-center" />
                          </div>
                          <div className="fs-6 fw-normal p-2 text-end">
                            <strong>Entry Date:</strong> {formattedDate}
                          </div>
                          <div className="fs-6 fw-normal p-2 row align-items-center justify-content-start">
                            <MdOutlineAlternateEmail className="col-sm-2 col-3" />
                            <div className="col-9">{selectedData.email}</div>
                          </div>
                          <div className="fs-6 fw-normal p-2 row align-items-center justify-content-start">
                            <FcContacts className="col-sm-2 col-3" />
                            <div className="col-9">{selectedData.phone_number}</div>
                          </div>
                          <div className="fs-6 fw-normal p-2 text-capitalize row align-items-center justify-content-start">
                            <FaAddressCard className="col-sm-2 col-3" />
                            <div className="col-9">{selectedData.address}</div>
                          </div>
                          <div className="fs-6 fw-normal p-1 mb-3 text-capitalize row align-items-center justify-content-start">
                            <FaDiagnoses className="col-sm-2 col-3" />
                            <div className="col-9">
                              {EditD ? (
                                <Select
                                  value={Arrayoptions.find((option) => option.label === selectedDataq.diagnosis_name)}
                                  onChange={handleDiagnosisChange}
                                  options={Arrayoptions}
                                  className="w-100 border-bottom border-dark bg-transparent rounded"
                                  placeholder="Select a diagnosis"
                                  getOptionLabel={(option) => option.label}
                                  getOptionValue={(option) => option.value}
                                />
                              ) : (
                                selectedDataq.diagnosis_name
                              )}
                            </div>
                          </div>
                          <div className="fs-6 fw-normal p-1 mb-3 text-capitalize row align-items-center justify-content-start">
                            <MdDevices className="col-sm-2 col-3" />
                            <div className="col-9">
                              {EditD ? (
                                <Select
                                  value={DevicesOptions.find((option) => option.label === selectedDataq.device_name)}
                                  onChange={handleDeviceChange}
                                  options={DevicesOptions}
                                  className="w-100 border-bottom border-dark bg-transparent rounded"
                                  placeholder="Select a device"
                                  getOptionLabel={(option) => option.label}
                                  getOptionValue={(option) => option.value}
                                />
                              ) : (
                                selectedDataq.device_name
                              )}
                            </div>
                          </div>
                          <div className="row align-items-center justify-content-center pb-3">
                            <div className="col-3 fs-6 fw-normal p-0 text-capitalize">
                              <BiMaleFemale className="col-4" />
                              {selectedData.gender_identity}
                            </div>
                            <div className="col-4 fs-6 fw-normal p-0 text-capitalize">
                              <MdBloodtype className="col-4" />
                              {selectedData.blood_group}(positive)
                            </div>
                            <div className="col-4 fs-6 fw-normal p-0 text-capitalize">
                              <FaBirthdayCake className="col-4" />
                              {selectedData.age} years
                            </div>
                          </div>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            {EditD ? (
                              <Button onClick={() => handleSaveedit()} variant="dark">
                                Save
                              </Button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Table responsive className="bg text-center">
                    <thead>
                      <tr>
                        <th className="fw-normal" style={{ background: "none" }}>
                          <div className="mb-2">Last Visit</div>
                        </th>
                        <th className="fw-normal" style={{ background: "none" }}>
                          <div className="mb-2">Next Visit</div>
                        </th>
                        <th className="fw-normal" style={{ background: "none" }}>
                          <div className="mb-2">File Charge</div>
                        </th>
                        <th className="fw-normal" style={{ background: "none" }}>
                          <div className="mb-2">Total Charge</div>
                        </th>
                        <th className="fw-normal" style={{ background: "none" }}>
                          <div className="mb-2">Paid Amount</div>
                        </th>
                        <th className="fw-normal" style={{ background: "none" }}>
                          <div className="mb-2">Pending Amount</div>
                        </th>
                        <th className="fw-normal" style={{ background: "none" }}>
                          <div className="mb-3">
                            <BiEdit onClick={() => handleAdd()} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {adding && (
                        <tr>
                          <td>
                            <input
                              type="date"
                              className=""
                              value={newRow.date ? newRow.date.substring(0, 10) : ""}
                              onChange={(e) => handleChange(e, "date")}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className=""
                              value={newRow.next_visit ? newRow.next_visit.substring(0, 10) : ""}
                              onChange={(e) => handleChange(e, "next_visit")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={newRow.file_charge || ""}
                              onChange={(e) => handleChange(e, "file_charge")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={newRow.total_charge_amount || ""}
                              onChange={(e) => handleChange(e, "total_charge_amount")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={newRow.paid_amount || ""}
                              onChange={(e) => handleChange(e, "paid_amount")}
                            />
                          </td>
                          <td>
                            {newRow.total_charge_amount && newRow.paid_amount
                              ? Number(newRow.total_charge_amount) - Number(newRow.paid_amount)
                              : newRow.total_amount || ""}
                          </td>
                          <td>
                            <Button onClick={() => handleSave()} variant="dark">
                              Save
                            </Button>
                          </td>
                        </tr>
                      )}
                      {Payment.map((row, idx) => {
                        // Last visit date formatting
                        const dateString = row.date
                        const date = new Date(dateString)
                        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

                        // Next visit date formatting
                        const next_visit = row.next_visit
                        const dateformate = new Date(next_visit)
                        const finalnext_visitdate = `${dateformate.getDate().toString().padStart(2, "0")}/${(dateformate.getMonth() + 1).toString().padStart(2, "0")}/${dateformate.getFullYear()}`

                        return (
                          <tr key={idx}>
                            <td className="" style={{ background: "none" }}>
                              {formattedDate}
                            </td>
                            <td className="" style={{ background: "none" }}>
                              {finalnext_visitdate}
                            </td>
                            <td className="fs-6" style={{ background: "none" }}>
                              {row.file_charge}
                            </td>
                            <td className="fs-6" style={{ background: "none" }}>
                              {row.total_charge_amount}
                            </td>
                            <td className="fs-6" style={{ background: "none" }}>
                              {row.paid_amount}
                            </td>
                            <td className="fs-6" style={{ background: "none" }}>
                              {row.total_amount}
                            </td>
                            <td className="fs-6" style={{ background: "none" }}>
                              <Button
                                variant="dark"
                                onClick={() => {
                                  EditPayment(row._id)
                                }}
                              >
                                Edit Payment
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Container>
          </div>
        </div>



      </div>
    </div>
  )
}

export default ViewPatientDetails

