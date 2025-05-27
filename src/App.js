import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrationForm from './Components/MainSection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DateNow from './Components/DateNow';
import DataTable from './Components/DataTable';
import ViewPatientDetails from './Components/ViewPatientDetails';
import Logindoc from './Components/Logindoc';
import ProtectRouter from './Components/ProtectRouter';
import PatientDataCheck from './Components/PatientDataCheck';

function App() {
  const isElectron = window.location.protocol === 'file:';
  return (
    <>
      <div>
        <BrowserRouter basename={isElectron ? '/' : '/'}>
          <Routes>
            <Route path='/' element={<DateNow />} />
            <Route path='/Registration' element={<RegistrationForm />} />
            <Route path='/DataTable' element={<DataTable />} />
            <Route path='/ViewPatientDetails' element={<ProtectRouter><ViewPatientDetails /></ProtectRouter>} />
            <Route path='/login' element={<Logindoc />} />
            <Route path='/patientdatacheck' element={<PatientDataCheck />} />
          </Routes>
        </BrowserRouter>
      </div></>
  );
}

export default App;
