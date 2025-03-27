import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectRouter(props) {
    return (
        <div> {localStorage.getItem("Doctor's_id") ? props.children : <Navigate to={'/'} />}</div>
    )
}

export default ProtectRouter