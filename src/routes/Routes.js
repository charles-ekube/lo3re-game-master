import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from '../pages/auth/SignUp'
import VerifyOtp from '../pages/auth/VerifyOtp'
import ConfirmVerify from '../pages/auth/ConfirmVerify'
import Login from '../pages/auth/Login'
import LoginOtp from '../pages/auth/LoginOtp'
import LinkSignUp from '../pages/auth/LinkSignUp'
import ForgotPassword from '../pages/auth/ForgotPassword'
import CreatePassword from '../pages/auth/CreateNewPassword'
import ConfirmNewPassword from '../pages/auth/ConfirmNewPassword'
import SelectProfile from '../pages/auth/SelectProfile'

const RoutesContainer = () => {

    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='/verification' element={<VerifyOtp />} />
                <Route path='/confirmVerification' element={<ConfirmVerify />} />
                <Route path='/loginVerification' element={<LoginOtp />} />
                <Route path='/linkRequest' element={<LinkSignUp />} />
                <Route path='/forgotPassword' element={<ForgotPassword />} />
                <Route path='/createPassword' element={<CreatePassword />} />
                <Route path='/resetDone' element={<ConfirmNewPassword />} />
                <Route path='/selectProfile' element={<SelectProfile />} />


            </Routes>
        </>
    )
}

export default RoutesContainer