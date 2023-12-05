import React from "react";
import SideBar from "../../components/dashboard/widgets/SideBar";
import TopNav from "../../components/dashboard/widgets/TopNav";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import NotFound from "../../utils/NotFound";
import Overview from "./Overview";
import Wallet from "./Wallet";
import { toggleSidebar } from "../../redux/features/generalSlice";
import { useDispatch, useSelector } from "react-redux";
import History from "./History";
import Settings from "./Settings";
import EditProfile from "./EditProfile";
import Kyc from "./Kyc";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state) => state.general.showSidebar);

  return (
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
          <Route path="/account" element={<Wallet />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings">
            <Route path="" element={<Settings />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="kyc" element={<Kyc />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Outlet />
      </section>
    </main>
  );
};

export default DashboardLayout;
