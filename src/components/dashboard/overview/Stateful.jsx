import React, { useState } from "react";
import BalanceCard from "../../../components/dashboard/wallet/BalanceCard";
import { IoChevronForward } from "react-icons/io5";
import lotteryStyles from "../../../assets/styles/lotteries.module.css";
import { Link } from "react-router-dom";
import LotteryGameCard from "../cards/LotteryGameCard";

const Stateful = () => {
  const [tabs, setTabs] = useState([
    {
      name: "active",
      badgeCount: "01",
      isActive: true,
    },
    {
      name: "pending",
      badgeCount: "0",
      isActive: false,
    },
    {
      name: "completed",
      badgeCount: "0",
      isActive: false,
    },
    {
      name: "declined",
      badgeCount: "0",
      isActive: false,
    },
  ]);

  const toggleTabs = (clickedItem) => {
    const updatedTabs = tabs.map((item) => ({
      ...item,
      isActive: item === clickedItem, // Set to true for the clicked profile, false for others
    }));

    setTabs(updatedTabs); // Update the state with the new array
  };

  return (
    <>
      <div className="mainContent">
        <div className="cardContainer">
          <BalanceCard
            title={"Total Earned"}
            figure={"$0.00"}
            subtitle={"Lotteries deployed: 0"}
          />
          <BalanceCard
            title={"Wallet Balance"}
            figure={"$0.00"}
            subtitle={"Total gains 0%"}
          />
        </div>
        <div className={lotteryStyles.lotteryContainer}>
          <div className="flexRow justifyBetween">
            <h3 className="satoshi-text">Your Lotteries</h3>
            <Link to={"/dashboard/lotteries"} className="blackText">
              <p className="flexRow alignCenter">
                View all <IoChevronForward fontSize={"20px"} />
              </p>
            </Link>
          </div>
          <div className="tabContainer">
            <div className={lotteryStyles.tab}>
              {tabs.map((tab, index) => (
                <button
                  key={"tab-" + index}
                  className={`capitalize ${
                    tab.isActive ? lotteryStyles.active : ""
                  }`}
                  onClick={() => toggleTabs(tab)}
                >
                  {tab.name}{" "}
                  <span className={lotteryStyles.badge}>{tab.badgeCount}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flexRow">
            {/* TODO: add bg img, and tab responsiveness */}
            <LotteryGameCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Stateful;
