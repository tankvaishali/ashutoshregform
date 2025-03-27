import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import '../assets/CSS//DataTable.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomTableTitle = () => (
  <>
    <div>
      <div className='row align-items-center justify-content-sm-start justify-content-center p-3 ms-sm-5 ms-0'>
        <img src={require('../assets/image/Ashutosh2.png')} alt="" className='p-2 bg2 image' />
      </div>
    </div>
  </>
)

function DataTable() {
  const server = process.env.REACT_APP_BASE_URL

  let navigate = useNavigate()
  const ViewPatientDetails = (id) => {
    if (!localStorage.getItem("Doctor's_id")) {

      navigate('/login')
    }
    else {
      navigate('/ViewPatientDetails')
    }
    localStorage.setItem("ViewPatientDetails", id)
  }
  const columns = [
    {
      name: "date_joined",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const date = new Date(value);
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
          return (
            <p>{formattedDate}</p>

          )
        }
      }
    }, {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,

      }
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "phone_number",
      label: "Phone Number",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "address",
      label: "Address",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "blood_group",
      label: "Blood Group",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "gender_identity",
      label: "Gender",
      options: {
        filter: true,
        sort: false,
      }
    },

    {
      name: "id",
      label: "View",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => (
          <button type="button" className='border border-0 btn btn-light rounded-0' onClick={() => ViewPatientDetails(value)}>View</button>
        )
      }
    },
  ];
  // // temprery
  const [State, setState] = useState([])

  // //temprery
  useEffect(() => {
    axios.get(server + 'get-patinet-info/').then(function (response) {
      // console.log(response.data.data);
      setState(response.data.data)
    })
  }, [])



  const muiCache = createCache({
    key: 'mui-datatables',
    prepend: true
  })
  const options = {
    filterType: 'textField',
    scroll: true
  };
  return (
    <div className='container-fluid bg text-start'>
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={createTheme()}></ThemeProvider>
        <MUIDataTable
          title={<CustomTableTitle />}
          data={State}
          columns={columns}
          options={options}
        />
      </CacheProvider>


    </div>

  )
}

export default DataTable