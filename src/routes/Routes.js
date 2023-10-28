import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from '../pages/auth/SignUp'
import VerifyOtp from '../pages/auth/VerifyOtp'
import ConfirmVerify from '../pages/auth/ConfirmVerify'
import Login from '../pages/auth/Login'
import LoginOtp from '../pages/auth/LoginOtp'

const RoutesContainer = () => {

    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='/verification' element={<VerifyOtp />} />
                <Route path='/confirmVerification' element={<ConfirmVerify />} />
                <Route path='/loginVerification' element={<LoginOtp />} />


            </Routes>
        </>
    )
}

export default RoutesContainer