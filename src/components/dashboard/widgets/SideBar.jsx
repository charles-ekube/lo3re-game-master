import React from "react";
import Logo from "../../../assets/images/logo.svg";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom/dist";
import Text from "../../../utils/CustomText";
import { RxDashboard } from "react-icons/rx";
import { FaMoneyBills } from "react-icons/fa6";
import { TbWallet } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { CiBellOn, CiClock2, CiGrid41, CiLogout, CiMoneyBill, CiUser, CiWallet } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const getPath = currentPath.split("/");
  let ActivePath = null;
  const navigate = useNavigate();
  const params = useParams();
  const getParamArr = Object.entries(params);
  const getID = getParamArr[0][1].split("/");
  const id = getID[1];

  if (getPath.length === 2) {
    ActivePath = getPath[1];
  }
  if (getPath.length === 3) {
    ActivePath = getPath[2];
  }
  if (getPath.length === 4) {
    ActivePath = getPath[2];
  }
  return (
    <>
      <nav className="sideBarContainer">
        <header className={"flexRow justifyCenter"}>
          <img src={Logo} alt="logo" />
        </header>
        <section>
          <ul>
            <li>
              <NavLink to={"/dashboard"} className={`flexRow alignCenter  satoshi-text  ${ActivePath === "dashboard" && "sideBarActiveLink"}`} style={{ gap: "8px" }}>
                <CiGrid41 size={22} />
                <Text tag={"p"} className={"satoshi-text f16"}>
                  Dashboard
                </Text>
                {ActivePath === "dashboard" && <div className={"activeIndicator"} />}
              </NavLink>
            </li>
            <li>
              <NavLink className={`flexRow alignCenter  satoshi-text ${ActivePath === "menu" && "sideBarActiveLink"}`} to={"menu"} style={{ gap: "8px" }}>
                <CiMoneyBill size={22} />
                <Text tag={"p"} className={"satoshi-text f16"}>
                  Lotteries
                </Text>
                {ActivePath === "menu" && <div className={"activeIndicator"} />}
              </NavLink>
            </li>
            <li>
              <NavLink className={`flexRow alignCenter  satoshi-text ${ActivePath === "account" && "sideBarActiveLink"}`} to={"account"} style={{ gap: "8px" }}>
                <CiWallet size={22} />
                <Text tag={"p"} className={"satoshi-text f16"}>
                  Wallet
                </Text>
                {ActivePath === "account" && <div className={"activeIndicator"} />}
              </NavLink>
            </li>
            <li style={{ marginTop: "20px" }}>
              <NavLink className={`flexRow alignCenter  satoshi-text ${ActivePath === "settings" && "sideBarActiveLink"}`} to={"settings"} style={{ gap: "8px" }}>
                <CiBellOn size={22} />
                <Text tag={"p"} className={"satoshi-text f16"}>
                  Notification
                </Text>
                {ActivePath === "settings" && <div className={"activeIndicator"} />}
              </NavLink>
            </li>
            <li>
              <NavLink className={`flexRow alignCenter  satoshi-text ${ActivePath === "settings" && "sideBarActiveLink"}`} to={"settings"} style={{ gap: "8px" }}>
                <CiClock2 size={22} />
                <Text tag={"p"} className={"satoshi-text f16"}>
                  History
                </Text>
                {ActivePath === "settings" && <div className={"activeIndicator"} />}
              </NavLink>
            </li>
            <li>
              <NavLink className={`flexRow alignCenter  satoshi-text ${ActivePath === "settings" && "sideBarActiveLink"}`} to={"settings"} style={{ gap: "8px" }}>
                <CiUser size={22} />
                <Text tag={"p"} className={"satoshi-text f16"}>
                  Profile
                </Text>
                {ActivePath === "settings" && <div className={"activeIndicator"} />}
              </NavLink>
            </li>
            <li style={{ marginTop: "20px" }}>
              <NavLink className={`flexRow alignCenter satoshi-text `} style={{ gap: "8px" }}>
                <CiLogout size={22} style={{ transform: "rotate(180deg)" }} />
                <Text tag={"p"} className={"satoshi-text f16"}>
                  Logout
                </Text>
              </NavLink>
            </li>
          </ul>
        </section>
      </nav>
    </>
  );
};

export default SideBar;
