import React, { useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import BalanceCard from "../../components/dashboard/wallet/BalanceCard";
import { IoChevronForward } from "react-icons/io5";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import { FaEllipsis } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import "../../assets/styles/lotteries.css";

const Lotteries = () => {
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
      <section className="mainContainer walletContainer">
        <div className="mainContent">
          <div className="cardContainer">
            <BalanceCard
              title={"Total Earned"}
              figure={"0.00"}
              subtitle={"Total gains 0%"}
            />
            <BalanceCard
              title={"Wallet Balance"}
              figure={"0.00"}
              subtitle={"Total gains 0%"}
            />
          </div>
          <div className="lotteryContainer">
            <div className="flexRow justifyBetween">
              <h3 className="satoshi-text">Your Lotteries</h3>
              <p className="flexRow alignCenter">
                View all <IoChevronForward fontSize={"20px"} />
              </p>
            </div>
            <div className="tabContainer">
              <div className="tab">
                {tabs.map((tab) => (
                  <button
                    className={`capitalize ${tab.isActive ? "active" : ""}`}
                    onClick={() => toggleTabs(tab)}
                  >
                    {tab.name} <span className="badge">{tab.badgeCount}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flexRow">
              {/* TODO: add bg img, and tab responsiveness */}
              <div className="jackpotBox">
                <div className="flexRow justifyEnd">
                  <button className="btn btn-ghost p0">
                    <FaEllipsis color={"var(--white)"} fontSize="24px" />
                  </button>
                </div>
                <div>
                  <div className="flexRow justifyBetween alignCenter">
                    <p className="title">Jackpot 1</p>
                    <MdVerified color="var(--primary)" fontSize="20px" />
                  </div>
                  <p className="subtitle">Tickets sold: 0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer"}>
          <CardSlider />
          <div className={"contactCornerContainer"}>
            <Text tag={"p"} className={"f16 satoshi-bold-text"}>
              Customer corner
            </Text>
            <ContactCard />
          </div>
        </aside>
      </section>
    </>
  );
};

export default Lotteries;
