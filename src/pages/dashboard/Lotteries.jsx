import React, { useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import { Link } from "react-router-dom";
import LotteryGameCard from "../../components/dashboard/cards/LotteryGameCard";

const Lotteries = () => {
  const [tabs, setTabs] = useState([
    {
      name: "active",
      badgeCount: "01",
      isActive: true,
    },
    {
      name: "draft",
      badgeCount: "0",
      isActive: false,
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
      <section
        className={`mainContainer walletContainer ${lotteryStyles.mainContainer}`}
      >
        <div className="mainContent">
          <div className={lotteryStyles.lotteryContainer}>
            <div className="flexRow justifyBetween alignCenter">
              <h3 className={`satoshi-text ${lotteryStyles.headerTitle}`}>
                Lotteries
              </h3>
              <p className="flexRow alignCenter">
                <Link to={"/dashboard/lotteries/add"} className="blackText">
                  Create a Lottery
                </Link>
              </p>
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
                    <span className={lotteryStyles.badge}>
                      {tab.badgeCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flexRow">
              <LotteryGameCard gameId={1} />
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
