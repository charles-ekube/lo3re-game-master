import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from '../pages/auth/SignUp'
import VerifyOtp from '../pages/auth/VerifyOtp'
import ConfirmVerify from "../pages/auth/ConfirmVerify";
import LoginOtp from "../pages/auth/LoginOtp";
import LinkSignUp from "../pages/auth/LinkSignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import CreatePassword from "../pages/auth/CreateNewPassword";
import ConfirmNewPassword from "../pages/auth/ConfirmNewPassword";
import SelectProfile from "../pages/auth/SelectProfile";
import LinkSignIn from "../pages/auth/LinkSignIn";
import LinkReset from "../pages/auth/ResetLink";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import HandleEmailActions from "../pages/auth/HandleEmailActions";
import RoutesAuth from "./RoutesAuth";
import PreLogin from "../pages/auth/PreLogin";
import CompleteProfile from "../pages/auth/CompleteProfile";
import ActivateWalletPin from "../pages/auth/ActivateWalletPin";
import Verify2FA from "../pages/auth/Verify2FA";
import ErrorPage from "../pages/ErrorPage";

const RoutesContainer = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PreLogin />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/verification" element={<VerifyOtp />} />
        <Route path="/verify-email" element={<ConfirmVerify />} />
        <Route path="/loginVerification" element={<LoginOtp />} />
        <Route path="/signup-link" element={<LinkSignUp />} />
        <Route path="/signin-link" element={<LinkSignIn />} />
        <Route path="/reset-link" element={<LinkReset />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/createPassword" element={<CreatePassword />} />
        <Route path="/resetDone" element={<ConfirmNewPassword />} />
        <Route path="/selectProfile" element={<SelectProfile />} />
        <Route path="/verify" element={<HandleEmailActions />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/activate-wallet-pin" element={<ActivateWalletPin />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />
        <Route
          path="/dashboard/*"
          element={<RoutesAuth children={<DashboardLayout />} />}
        />
        <Route Component={ErrorPage} />
      </Routes>
    </>
  );
};

export default RoutesContainer