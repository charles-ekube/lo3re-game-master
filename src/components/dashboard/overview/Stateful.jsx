import React, { useEffect, useState } from "react";
import BalanceCard from "../../../components/dashboard/wallet/BalanceCard";
import { IoChevronForward } from "react-icons/io5";
import lotteryStyles from "../../../assets/styles/lotteries.module.css";
import { Link, useNavigate } from "react-router-dom";
import LotteryGameCard from "../cards/LotteryGameCard";
import { useFetchGamesQuery } from "../../../redux/services/gameApi";
import Loader from "../../../utils/Loader";
import useTextTruncate from "../../../hooks/useTextTruncate";
import { useFetchWalletBalanceQuery } from "../../../redux/services/walletApi";
import { useDispatch, useSelector } from "react-redux";
import { updateLotteryTab } from "../../../redux/features/lotterySlice";
import CustomButtonII from "../../../utils/CustomButtonII";

const Stateful = () => {
  const [mainWallet, setMainWallet] = useState(null);
  const { formatMoney } = useTextTruncate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabs = useSelector((state) => state.lottery.lotteryTabs);
  const {
    data: games,
    isLoading: isGamesLoading,
    isSuccess: isGameSuccess,
  } = useFetchGamesQuery();
  const {
    data: walletBalance,
    isSuccess: isWalletBalanceSuccess,
    isLoading: isWalletBalanceLoading,
  } = useFetchWalletBalanceQuery();
  const [gamesArr, setGamesArr] = useState([]);

  useEffect(() => {
    if (isWalletBalanceSuccess) {
      const mainWallet = walletBalance?.filter(
        (val) => val?.type?.toLowerCase() === "main"
      );

      setMainWallet(mainWallet[0]);
    }
  }, [isWalletBalanceSuccess, walletBalance]);

  useEffect(() => {
    if (isGameSuccess) {
      let activeGame = [];
      const returnActiveTab = () => {
        return tabs.filter((tab) => tab.isActive);
      };

      if (returnActiveTab()[0].name === "active") {
        activeGame = games?.games?.filter((game) => game?.status === "live");
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
  }, [games?.games, isGameSuccess, tabs]);

  useEffect(() => {
    if (isGameSuccess) {
      // update badge count
      let updatedTabs = [...tabs];
      updatedTabs = updatedTabs.map((tab) => ({
        ...tab,
        badgeCount: games?.games?.filter((game) => game?.status === tab.label)
          .length,
      }));
      if (JSON.stringify(tabs) !== JSON.stringify(updatedTabs)) {
        dispatch(updateLotteryTab(updatedTabs));
      }
    }
  }, [isGameSuccess, games, tabs, dispatch]);

  const toggleTabs = (clickedItem) => {
    const updatedTabs = tabs.map((item) => ({
      ...item,
      isActive: item === clickedItem, // Set to true for the clicked profile, false for others
    }));

    dispatch(updateLotteryTab(updatedTabs));
  };

  return (
    <>
      <div className="mainContent">
        <div className="cardContainer mb-2">
          <BalanceCard
            title={"Total Earned"}
            figure={"$0"}
            subtitle={"Lotteries deployed: 0"}
          />
          <BalanceCard
            title={"Wallet Balance"}
            figure={`$${formatMoney(mainWallet?.balance || 0)}`}
            subtitle={"Total gains 0%"}
            isBalanceLoading={isWalletBalanceLoading}
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
          <Loader
            isLoading={isGamesLoading}
            height={"100px"}
            variety={"dark"}
          />
          {!gamesArr.length && !isGamesLoading ? (
            <>
              <p className={`text-muted ${lotteryStyles.emptyGamesText}`}>
                You don't have any {tabs.filter((tab) => tab.isActive)[0].name}{" "}
                games yet
              </p>
              <div className="flexRow justifyCenter">
                <CustomButtonII
                  text={"Create game"}
                  variant={"primary"}
                  onClick={() => navigate("/dashboard/lotteries/add")}
                />
              </div>
            </>
          ) : (
            ""
          )}
          <div className={lotteryStyles.lotterySlide}>
            {gamesArr?.map((game) => (
              <LotteryGameCard key={game?.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Stateful;
