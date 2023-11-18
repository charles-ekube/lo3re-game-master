import React from "react";
import SideBar from "../../components/dashboard/widgets/SideBar";
import TopNav from "../../components/dashboard/widgets/TopNav";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import NotFound from "../../utils/NotFound";
import Overview from "./Overview";

const DashboardLayout = () => {
  return (
    <main className={"dashboardLayoutContainer"}>
      <section className={"dashboardLayoutSideBar"}>
        <SideBar />
      </section>
      <section className={"dashboardLayoutContentContainer"}>
        <TopNav />
        <Routes>
          <Route path="/*" element={<Overview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Outlet />
      </section>
    </main>
  );
};

export default DashboardLayout;
