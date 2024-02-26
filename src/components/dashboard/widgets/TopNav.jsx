import React, { useEffect, useState } from "react";
import { CiBellOn, CiSearch, CiUser } from "react-icons/ci";
import Text from "../../../utils/CustomText";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
} from "../../../redux/features/generalSlice";
import { FiMenu } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import TransactionHistory from "../../../components/dashboard/wallet/TransactionHistory";
import TicketPurchaseNotification from "./TicketPurchaseNotification";

const TopNav = () => {
  const [isScreenWidth1150, setIsScreenWidth1150] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const showSidebar = useSelector((state) => state.general.showSidebar);
  const userDetails = useSelector((state) => state.general.userDetail);
  const dispatch = useDispatch();

  const handleResize = () => {
    if (window.innerWidth < 1150) {
      setIsScreenWidth1150(true);
    } else {
      setIsScreenWidth1150(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  // Check if displayName is a string and not empty
  let firstLetter = "";
  let lastLetter = "";
  if (
    typeof userDetails?.displayName !== "string" ||
    userDetails?.displayName.length === 0
  ) {
    firstLetter = "u";
    lastLetter = "s";
  } else {
    firstLetter = userDetails?.displayName[0];
    lastLetter = userDetails?.displayName[userDetails?.displayName.length - 1];
  }

  return (
    <>
      <nav className="topNavContainer">
        <section className="flexRow gap-1 w-70 alignCenter">
          <div>
            {isScreenWidth1150 && (
              <button
                onClick={() => dispatch(toggleSidebar(!showSidebar))}
                className={"btn btn-dark"}
              >
                <FiMenu />
              </button>
            )}
          </div>
          <div className="topNavSearchContainer">
            <CiSearch size={22} />
            <input placeholder="Search everything" />
          </div>
        </section>
        <section className={"topNavUserContainer"}>
          <div className="flexRow alignCenter" style={{ gap: "5px" }}>
            <div className="nameTagContainer">
              <Text
                className={"satoshi-text f14 upper"}
                style={{ color: "rgba(16, 16, 16, 1)" }}
              >
                {firstLetter ? firstLetter : <CiUser size={18} />}
                {lastLetter ? lastLetter : ""}
              </Text>
            </div>
            <Text
              className={"satoshi-text f14 capitalize d-none-md"}
              style={{ color: "rgba(16, 16, 16, 1)" }}
            >
              {userDetails?.displayName ? userDetails?.displayName : "User"}
            </Text>
          </div>
          <div className="bell-icon" onClick={() => setShowNotification(true)}>
            <CiBellOn />
          </div>
        </section>
      </nav>

      {showNotification ? (
        <>
          <div className={`notification-dropdown`}>
            <div className="flexRow justifyBetween alignCenter">
              <h3 className="header-title">Notifications</h3>
              <FaTimes
                size={16}
                className="textDanger cursor-pointer"
                onClick={() => setShowNotification(false)}
              />
            </div>
            <div className="content">
              <TransactionHistory
                txnId={"09232kjdsfbns"}
                type={"deposit"}
                amount={"30.00"}
                currency={"NGN"}
                date={"239837834"}
                status={"success"}
                method={"bank_transfer"}
                className="list-divider"
              />
              <TicketPurchaseNotification
                message={"Raynera sent a message"}
                chatMsg={"I'll book another sessio..."}
                date={239837834}
                status={"3 mins ago"}
              />
              <TransactionHistory
                txnId={"09232kjdsfbns"}
                type={"deposit"}
                amount={"30.00"}
                currency={"NGN"}
                date={"239837834"}
                status={"failed"}
                method={"bank_transfer"}
                className="list-divider"
              />
              <TransactionHistory
                txnId={"09232kjdsfbns"}
                type={"withdrawal"}
                amount={"30.00"}
                currency={"NGN"}
                date={"239837834"}
                status={"success"}
                method={"bank_transfer"}
                className="list-divider"
              />
              <TicketPurchaseNotification
                message={"Raynera bought a lottery ticket"}
                date={239837834}
                status={"3 mins ago"}
              />
            </div>
          </div>
          <div
            className="notification-overlay"
            onClick={() => setShowNotification(false)}
          ></div>
        </>
      ) : (
        ""
      )}
    </>
  );
};;

export default TopNav;
