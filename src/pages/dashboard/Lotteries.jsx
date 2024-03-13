import React, { useEffect, useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import { Link } from "react-router-dom";
import LotteryGameCard from "../../components/dashboard/cards/LotteryGameCard";
import { useFetchGamesQuery } from "../../redux/services/gameApi";
import Loader from "../../utils/Loader";

const Lotteries = () => {
  const {
    data: games,
    isLoading: isGamesLoading,
    isSuccess: isGameSuccess,
  } = useFetchGamesQuery();
  const [gamesArr, setGamesArr] = useState([]);
  console.log(games);

  const [tabs, setTabs] = useState([
    {
      name: "active",
      badgeCount: "0",
      isActive: true,
    },
    {
      name: "drafts",
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

  useEffect(() => {
    const returnActiveTab = () => {
      return tabs.filter((tab) => tab.isActive);
    };

    if (isGameSuccess) {
      let activeGame = [];
      if (returnActiveTab()[0].name === "active") {
        activeGame = games?.games?.filter((game) => game?.status === "active");
      } else if (returnActiveTab()[0].name === "drafts") {
        activeGame = games?.games?.filter((game) => game?.status === "drafts");
      } else if (returnActiveTab()[0].name === "pending") {
        activeGame = games?.games?.filter((game) => game?.status === "pending");
      } else if (returnActiveTab()[0].name === "completed") {
        activeGame = games?.games?.filter(
          (game) => game?.status === "completed"
        );
      } else if (returnActiveTab()[0].name === "declined") {
        activeGame = games?.games?.filter(
          (game) => game?.status === "declined"
        );
      }

      setGamesArr(activeGame);
    }
  }, [isGameSuccess, games, tabs]);

  useEffect(() => {
    if (isGameSuccess) {
      // update badge count
      let updatedTabs = [...tabs];
      updatedTabs = updatedTabs.map((tab) => ({
        ...tab,
        badgeCount: games?.games?.filter((game) => game?.status === tab.name)
          .length,
      }));
      setTabs(updatedTabs);
    }
  }, [isGameSuccess, games]);

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
        <div className={`mainContent ${lotteryStyles.mainContent}`}>
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
            <Loader
              isLoading={isGamesLoading}
              height={"100px"}
              variety={"dark"}
            />
            {!gamesArr.length && !isGamesLoading ? (
              <p className={`text-muted ${lotteryStyles.emptyGamesText}`}>
                You don't have any {tabs.filter((tab) => tab.isActive)[0].name}{" "}
                games yet
              </p>
            ) : (
              ""
            )}
            <div className={lotteryStyles.lotteryGrid}>
              {gamesArr?.map((game) => (
                <LotteryGameCard key={game?.id} game={game} />
              ))}
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
