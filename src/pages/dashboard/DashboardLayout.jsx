import React, { useEffect, useState } from "react";
import SideBar from "../../components/dashboard/widgets/SideBar";
import TopNav from "../../components/dashboard/widgets/TopNav";
import { Outlet, Route, Routes } from "react-router-dom";
import NotFound from "../../utils/NotFound";
import Overview from "./Overview";
import Wallet from "./Wallet";
import { toggleSidebar } from "../../redux/features/generalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFetchProfileQuery } from "../../redux/services/accountApi";
import History from "./History";
import Settings from "./Settings";
import EditProfile from "./EditProfile";
import Kyc from "./Kyc";
import Lotteries from "./Lotteries";
import AddLottery from "./AddLottery";
import PreviewLottery from "./PreviewLottery";
import TwoFactorAuth from "./TwoFactorAuth";
import WalletPin from "./WalletPin";
import CustomButtonII from "../../utils/CustomButtonII";
import Modal from "../../utils/Modal";
import OtpInput from "../../utils/CustomOtp";
import { showError, showSuccess } from "../../utils/Alert";
import { useActivateWalletPinMutation } from "../../redux/services/walletApi";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state) => state.general.showSidebar);
  const {
    data: user,
    isError: isUserError,
    isLoading: isUserLoading,
  } = useFetchProfileQuery();
  const [activateWalletPin, { isLoading: isActivateWalletLoading }] =
    useActivateWalletPinMutation();
  const [showWalletPinModal, setShowWalletPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const onChange = (value) => {
    setPin(value);
  };

  useEffect(() => {
    if (!isUserError && !isUserLoading) {
      const isWalletPinActive = user?.user?.security?.wallet_pin;
      if (!isWalletPinActive) {
        setShowWalletPinModal(true);
      }
    }
  }, [isUserError, isUserLoading, user]);

  const setWalletPin = async () => {
    if (pin === "") {
      showError("Enter your 6-digit wallet pin");
      return;
    }

    await activateWalletPin({ pin, confirm_pin: pin })
      .unwrap()
      .then((resp) => {
        showSuccess("Pin activated successfully");
        setShowWalletPinModal(false);
      })
      .catch((err) => {
        console.log(err);
        showError(
          err?.message ||
            err?.data?.message ||
            "An error occured try again later"
        );
      });
  };

  return (
    <>
      <main className={"dashboardLayoutContainer"}>
        {showSidebar && (
          <div
            className="overlay"
            onClick={() => dispatch(toggleSidebar(!showSidebar))}
          ></div>
        )}
        <section
          className={`dashboardLayoutSideBar ${showSidebar ? "show" : ""}`}
        >
          <SideBar />
        </section>
        <section className={"dashboardLayoutContentContainer"}>
          <TopNav />
          <Routes>
            <Route path="/*" element={<Overview />} />
            <Route path="/lotteries">
              <Route path="" element={<Lotteries />} />
              <Route path="add" element={<AddLottery />} />
              <Route path="preview" element={<PreviewLottery />} />
            </Route>
            <Route path="/account" element={<Wallet />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings">
              <Route path="" element={<Settings />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="kyc" element={<Kyc />} />
              <Route path="2fa" element={<TwoFactorAuth />} />
              <Route path="wallet-pin" element={<WalletPin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Outlet />
        </section>
      </main>

      <Modal
        title={"Set Wallet Pin"}
        isOpen={showWalletPinModal}
        onClose={() => null}
        hideCloseBtn={true}
        zClass={"tFaModal"}
      >
        <div className="inputContainer">
          <label className="text-center text-muted">
            Create Your 6-Digit PIN
          </label>
          <OtpInput valueLength={6} value={pin} onChange={onChange} />
        </div>
        <CustomButtonII
          text={"Confirm"}
          className={"w100"}
          onClick={setWalletPin}
          centerText={true}
          loading={isActivateWalletLoading}
        />
      </Modal>
    </>
  );
};

export default DashboardLayout;
