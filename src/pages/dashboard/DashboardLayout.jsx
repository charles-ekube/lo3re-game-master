import React, { useEffect } from "react";
import SideBar from "../../components/dashboard/widgets/SideBar";
import TopNav from "../../components/dashboard/widgets/TopNav";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import NotFound from "../../utils/NotFound";
import Overview from "./Overview";
import Wallet from "./Wallet";
import { logOutUser, toggleSidebar } from "../../redux/features/generalSlice";
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
import Beneficiaries from "./Beneficiaries";
import Affiliate from "./Affiliate";
import PasswordReset from "./PasswordReset";
import ViewGame from "./ViewGame";
import UpdateGame from "./UpdateGame";

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
      const TFAVerified = JSON.parse(localStorage.getItem("TFAVerified"));
      const isWalletPinActive = user?.user?.security?.wallet_pin;
      const isAuthApp2faActive =
        user?.user?.security && user?.user?.security["2fa"]
          ? user?.user?.security["2fa"]?.status === "verified"
          : false;
      if (!isWalletPinActive) {
        navigate("/activate-wallet-pin");
      } else if (isAuthApp2faActive && !TFAVerified) {
        // console.log("2fa active and not set");
        dispatch(logOutUser());
      }
    }
  }, [isUserError, isUserLoading, user, navigate, dispatch]);

  return (
    <>
      {isUserLoading && <FullScreenloader />}
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
              <Route path="view-game/:id" element={<ViewGame />} />
              <Route path="update-game/:id" element={<UpdateGame />} />
            </Route>
            <Route path="/account" element={<Wallet />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings">
              <Route path="" element={<Settings />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="kyc" element={<Kyc />} />
              <Route path="2fa" element={<TwoFactorAuth />} />
              <Route path="wallet-pin" element={<WalletPin />} />
              <Route path="beneficiaries" element={<Beneficiaries />} />
              <Route path="affiliate" element={<Affiliate />} />
              <Route path="password-reset" element={<PasswordReset />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Outlet />
        </section>
      </main>
    </>
  );
};

const FullScreenloader = () => {
  return (
    <div className="fullScreenloader">
      <div>
        <img src={Logo} className={"animateLogo"} alt="logo" />
        <div className={"verifyHeaderText"}>
          <Text tag={"h2"} className={"fullscreen-loader-text boldText"}>
            Unlock Your Lucky Streak🍀✨
          </Text>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
