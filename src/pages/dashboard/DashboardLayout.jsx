import React, { useEffect } from "react";
import SideBar from "../../components/dashboard/widgets/SideBar";
import TopNav from "../../components/dashboard/widgets/TopNav";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
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
import Logo from "../../assets/images/logo.svg";
import Text from "../../utils/CustomText";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showSidebar = useSelector((state) => state.general.showSidebar);
  const {
    data: user,
    isError: isUserError,
    isLoading: isUserLoading,
  } = useFetchProfileQuery();

  useEffect(() => {
    if (!isUserError && !isUserLoading) {
      const isWalletPinActive = user?.user?.security?.wallet_pin;
      if (!isWalletPinActive) {
        navigate("/activate-wallet-pin");
      }
    }
  }, [isUserError, isUserLoading, user, navigate]);

  return (
    <>
      {isUserLoading && (
        <div className="fullScreenloader">
          <div>
            <img src={Logo} className={"animateLogo"} alt="logo" />
            <div className={"verifyHeaderText"}>
              <Text tag={"h2"} className={"f26 boldText"}>
                Unlock Your Lucky Streak🍀✨
              </Text>
            </div>
          </div>
        </div>
      )}
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
    </>
  );
};

export default DashboardLayout;
