import React, { useEffect, useState } from "react";
// import Camera from "../../assets/images/camera.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import BgImage from "../../assets/images/default.png";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { IoChevronForward } from "react-icons/io5";
import { TiGroup } from "react-icons/ti";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import MsgAdd from "../../assets/images/icons/message-add.png";
import { IoLogoWhatsapp } from "react-icons/io";
import BalanceCard from "../../components/dashboard/wallet/BalanceCard";
import Modal from "../../utils/Modal";
import WasteCollection from "../../assets/images/wastecollection.png";
import { DateTime } from "luxon";
import { GrLink } from "react-icons/gr";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import {
  useDeleteGameMutation,
  useFetchGameLeaderBoardQuery,
  useFetchGameTicketsQuery,
} from "../../redux/services/gameApi";
import { useFetchProfileQuery } from "../../redux/services/accountApi";
import { showError, showSuccess } from "../../utils/Alert";
import useTextTruncate from "../../hooks/useTextTruncate";
import Loader from "../../utils/Loader";
import TicketSalesModal from "../../components/dashboard/widgets/TicketSalesModal";
import Avatar from "../../utils/Avatar";
import LeaderBoardModal from "../../components/dashboard/widgets/LeaderBoardModal";
import CustomCheckbox from "../../utils/CustomCheckbox";

function anyKeyHasValue(obj) {
  for (const key in obj) {
    if (obj[key] !== "") {
      return true;
    }
  }
  return false;
}

const ViewGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hideBackBtn = searchParams.get("hideBackBtn");
  const game = location.state?.game;
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { formatDateToLocaleString, formatDuration } = useTimeFormatter();
  const { truncateText, formatMoney, ensureHttps } = useTextTruncate();
  const { data: gameTickets, isLoading: isTicketsLoading } =
    useFetchGameTicketsQuery();
  const [deleteGame, { isLoading: isDeleteGameLoading }] =
    useDeleteGameMutation();
  const {
    data: leaderboard,
    isSuccess: isLeaderBoardSuccess,
    isLoading: isLeaderboardLoading,
  } = useFetchGameLeaderBoardQuery(game?.id);
  const { data: user } = useFetchProfileQuery();
  const [sortedLeaderboards, setSortedLeaderboards] = useState([]);

  console.log("ld", leaderboard);

  useEffect(() => {
    if (isLeaderBoardSuccess) {
      const ld = leaderboard?.leaderboards;
      ld?.sort((a, b) => a?.rank - b?.rank);
      setSortedLeaderboards(ld);
    }
  }, [isLeaderBoardSuccess, leaderboard?.leaderboards]);

  const handleDeleteGame = async () => {
    await deleteGame(game?.id)
      .unwrap()
      .then(() => {
        showSuccess("Game deleted");
        navigate(-1);
      })
      .catch((err) => {
        showError("An error occurred, try again later");
        console.log(err);
      });
  };

  return (
    <>
      <section
        className={`mainContainer w65-45 ${lotteryStyles.mainContainer}`}
      >
        <div className={`mainContent ${lotteryStyles.addLottery}`}>
          {!hideBackBtn ? (
            <IoIosArrowRoundBack
              size={34}
              className={"cursor-pointer"}
              onClick={() => navigate(-1)}
              style={{ marginBottom: "16px" }}
            />
          ) : (
            <IoIosArrowRoundBack
              size={34}
              className={"cursor-pointer"}
              onClick={() => navigate("/dashboard/lotteries")}
              style={{ marginBottom: "16px" }}
            />
          )}
          <div
            className={`flexRow alignCenter avatarProfileContainer ${lotteryStyles.avatarProfileContainer} ${lotteryStyles.viewGameAvatarContainer}`}
          >
            <div className={lotteryStyles.avatar}>
              <img
                src={game?.coverUrl || BgImage}
                alt=""
                className={lotteryStyles.fileImg}
              />
            </div>
            <div className={lotteryStyles.content}>
              <h3 className="title capitalize">{game?.title}</h3>
              <p className={`subtitle ${lotteryStyles.subtitle}`}>
                Jackpot prize: <b>${formatMoney(game?.jackpot)}</b>
              </p>
              <div
                className={`fs14 mediumText ${lotteryStyles.liveUserStatFlex}`}
              >
                <div
                  className="flexRow alignCenter"
                  style={{ gap: "8px", flexWrap: "wrap" }}
                >
                  <div className="flexRow alignCenter capitalize">
                    <GoDotFill className={`game-${game?.status}`} />
                    <span>
                      {game?.status === "active" ? "Live" : game?.status}
                    </span>
                  </div>
                  <p className={lotteryStyles.timerLg}>
                    {formatDuration(game?.endOn)} left
                  </p>
                </div>
                <div className="flexRow alignCenter" style={{ gap: "4px" }}>
                  <TiGroup color="#2F53D7" fontSize={24} />
                  {/* <span className="text-muted fs14">1002/10,000 playing</span> */}
                  <span className="text-muted fs14">
                    {game?.totalPlayers} playing
                  </span>
                </div>
              </div>
            </div>
          </div>
          <form className={lotteryStyles.lotteryForm}>
            <div className={`flexRow justifyBetween ${lotteryStyles.col2}`}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Ticket price</label>
                <input
                  type="text"
                  className="formInput"
                  value={"$" + game?.ticketPrice}
                  readOnly
                  name="ticketPrice"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Ticket goal</label>
                <input
                  type="text"
                  className="formInput"
                  value={`$${formatMoney(
                    game?.ticketSalesCount
                  )}/$${formatMoney(game?.ticketGoal)}`}
                  readOnly
                  name="ticketCapacity"
                />
              </div>
            </div>

            <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
              <label>Cause</label>
              <input
                type="text"
                className="formInput"
                value={game?.cause}
                readOnly
                name="cause"
              />
            </div>

            <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
              <label>Description</label>
              <textarea
                className="formInput"
                value={game?.description}
                name="description"
                cols="30"
                rows="5"
                readOnly
              ></textarea>
            </div>

            <div style={{ marginBlock: "10px", marginBottom: "18px" }}>
              <CustomCheckbox
                isChecked={game?.infinite}
                label={"Run game indefinitely"}
                name={"infinite"}
                isReadOnly={true}
              />
            </div>

            <div className={`flexRow justifyBetween ${lotteryStyles.col2}`}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Lottery starts</label>
                <input
                  type="text"
                  className="formInput"
                  value={formatDateToLocaleString(game?.startOn)}
                  readOnly
                  name="ticketPrice"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Lottery ends</label>
                <input
                  type="text"
                  className="formInput"
                  value={formatDateToLocaleString(game?.endOn)}
                  readOnly
                  name="ticketCapacity"
                />
              </div>
            </div>

            <div className={lotteryStyles.links}>
              {anyKeyHasValue(game?.socials) ? <p>Links</p> : ""}
              <div
                className="flexRow"
                style={{ gap: "10px", marginTop: "10px", fontSize: "27px" }}
              >
                {game?.socials?.telegram ? (
                  <a
                    href={ensureHttps(game?.socials?.telegram)}
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    <FaTelegram color="#28A8E9" />
                  </a>
                ) : (
                  ""
                )}
                {game?.socials?.facebook ? (
                  <a
                    href={ensureHttps(game?.socials?.facebook)}
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    <FaFacebook color="#0F8FF2" />
                  </a>
                ) : (
                  ""
                )}
                {game?.socials?.whatsapp ? (
                  <a
                    href={ensureHttps(game?.socials?.whatsapp)}
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    <IoLogoWhatsapp color="#2AB03F" />
                  </a>
                ) : (
                  ""
                )}
                {game?.socials?.others ? (
                  <a
                    href={ensureHttps(game?.socials?.others)}
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    <GrLink />
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div
              className={`${lotteryStyles.formButtonContainer} ${lotteryStyles.addGame}`}
            >
              <CustomButtonII
                variant={"ghost-danger"}
                text={"Delete"}
                className="btnLg me10"
                type="button"
                onClick={() => setShowDeleteModal(true)}
                centerText={true}
              />
              <CustomButtonII
                variant={"primary"}
                text={"Update"}
                className="btnLg"
                type="button"
                onClick={() =>
                  navigate("/dashboard/lotteries/update-game", {
                    state: { game },
                  })
                }
                centerText={true}
              />
            </div>
          </form>
        </div>

        {/* aside */}
        <aside
          className={`asideViewContainer ${lotteryStyles.asideViewContainer}`}
        >
          <div className={`cardContainer ${lotteryStyles.asideCardContainer}`}>
            <BalanceCard
              title={"Tickets sold"}
              figure={game?.ticketSalesCount}
              subtitle={"Updated 3 mins ago"}
              hideEyeIcon={true}
            />
            <BalanceCard
              title={"Ticket sales"}
              figure={`$${formatMoney(game?.ticketSales)}`}
              subtitle={"Total gains 0%"}
              hideEyeIcon={true}
            />
          </div>

          {/* ticket & messages */}
          <div className={lotteryStyles.ticketMessageFlex}>
            {/* ticket sales */}
            <div className={lotteryStyles.ticket}>
              <div className="flexRow justifyBetween">
                <p className={lotteryStyles.asideTitle}>Ticket sales</p>
                <p
                  className={`flexRow alignCenter cursor-pointer fs14`}
                  onClick={() => setIsTicketModalOpen(true)}
                >
                  View all <IoChevronForward fontSize={"20px"} />
                </p>
              </div>
              <div className={`${lotteryStyles.box}`}>
                <div className={lotteryStyles.ticketContainer}>
                  <table>
                    <thead>
                      <tr>
                        <td>ID</td>
                        <td>Lottery no</td>
                      </tr>
                    </thead>

                    <tbody>
                      {gameTickets?.tickets?.slice(0, 5)?.map((ticket) => {
                        let date = DateTime.fromSeconds(
                          ticket?.createdAt?._seconds
                        );
                        date = date.toRelativeCalendar();

                        const ticketSelections = JSON.parse(ticket?.selection);
                        const selection1 = ticketSelections.length
                          ? ticketSelections[0]
                          : [];

                        return (
                          <tr key={ticket?.id}>
                            <td className={lotteryStyles.st1}>
                              {truncateText(ticket?.id, 5)}
                            </td>
                            <td className={lotteryStyles.st2}>
                              <span className={lotteryStyles.tablePill}>
                                {selection1.map((val) => `${val} `)}
                              </span>
                            </td>
                            <td className={lotteryStyles.st3}>{date}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <Loader
                    isLoading={isTicketsLoading}
                    itemLength={gameTickets?.tickets?.length}
                    isNullText={"No tickets yets"}
                    height={"100%"}
                    variety={"dark"}
                  />
                  {!isTicketsLoading && !gameTickets?.tickets?.length ? (
                    <div
                      className="flexColumn justifyCenter alignCenter text-muted textCenter fs14"
                      style={{ height: "120px" }}
                    >
                      No purchased tickets yet
                      <br /> yet
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {/* messages */}
            <div className={lotteryStyles.message}>
              <p className={lotteryStyles.asideTitle}>Messages</p>
              <div className={`vScroll ${lotteryStyles.box}`}>
                <div
                  className="flexRow justifyEnd alignCenter"
                  style={{ gap: "15px" }}
                >
                  <img src={MsgAdd} className={lotteryStyles.msgIcon} alt="" />
                  <FaEllipsisH color={"#48494C"} />
                </div>
                <div
                  className="flexColumn"
                  style={{ gap: "16px", marginTop: "16px" }}
                >
                  <p className="textCenter text-muted fs14">
                    Sorry you don’t have any active conversations with the game
                    master at the moment.
                  </p>
                  <CustomButtonII
                    text={"Start conversation"}
                    className={"btnSm fs12"}
                    centerText={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* leaderborad */}
          <div className={lotteryStyles.leaderboard}>
            <div className={`flexRow justifyBetween ${lotteryStyles.mb12}`}>
              <p className={lotteryStyles.asideTitle}>Leaderboard</p>
              <p
                className="flexRow alignCenter cursor-pointer fs14"
                onClick={() => setIsLeaderboardModalOpen(true)}
              >
                View all <IoChevronForward fontSize={"20px"} />
              </p>
            </div>
            <div className={lotteryStyles.leaderboardContainer}>
              <div className={`${lotteryStyles.tableResponsive} hScroll`}>
                <table>
                  <thead>
                    <tr>
                      <td>Player name</td>
                      <td>Rank</td>
                      <td>Lottery no</td>
                      <td>Jackpot win</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeaderboards?.slice(0, 5)?.map((val, idx) => {
                      let date = DateTime.fromSeconds(
                        val?.ticket?.createdAt?._seconds
                      );
                      date = date.toRelativeCalendar();

                      const results = val?.results;
                      const selections = results?.length
                        ? results[0]?.selection
                        : [];

                      return (
                        <tr
                          className={`${
                            val?.profile?.userId === user?.uid
                              ? lotteryStyles.activeUser
                              : ""
                          }`}
                          key={`ld-${idx}`}
                        >
                          <td>
                            <div className={`flexRow alignCenter`}>
                              <Avatar
                                fontSize="20px"
                                name={val?.profile?.username}
                                className={lotteryStyles.tableAvatar}
                                onlyFirstLetter={true}
                                src={val?.profile?.photoUrl}
                                boxSize={"40px"}
                              />
                              <div>
                                <p className={lotteryStyles.leaderName}>
                                  {val?.profile?.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>{val?.friendlyRank}</td>
                          <td>
                            <p className={lotteryStyles.leaderLottoNumber}>
                              {selections?.map((num) => num + " ")}
                            </p>
                          </td>
                          <td>${formatMoney(val?.prizeAmount)}</td>
                          <td>{date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Loader
                  isLoading={isLeaderboardLoading}
                  itemLength={leaderboard?.leaderboards?.length}
                  // isNullText={"No tickets yets"}
                  height={"100%"}
                />
                {!isLeaderboardLoading && !leaderboard?.leaderboards?.length ? (
                  <div
                    className="flexColumn justifyCenter alignCenter text-muted textCenter fs14"
                    style={{ height: "120px", marginBlock: "40px" }}
                  >
                    Leaderboard is currently empty.
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* modals */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="flexRow justifyCenter">
            <img src={WasteCollection} className="deleteIllustration" alt="" />
          </div>
          <h3 className="deleteTitle">Delete Lottery</h3>
          <p className="deleteSubtitle">
            Are you sure you want to delete this {game?.status} lottery?
          </p>
          <div className="flexRow gap-1 mt35">
            <CustomButtonII
              variant="light"
              text={"Don't delete"}
              className={"w50"}
              centerText={true}
              onClick={() => setShowDeleteModal(false)}
            />
            <CustomButtonII
              variant="ghost-danger"
              text={"Yes, delete"}
              className={"w50"}
              centerText={true}
              loading={isDeleteGameLoading}
              onClick={handleDeleteGame}
            />
          </div>
        </Modal>

        <TicketSalesModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          tickets={gameTickets?.tickets}
        />

        <LeaderBoardModal
          isOpen={isLeaderboardModalOpen}
          onClose={() => setIsLeaderboardModalOpen(false)}
          items={sortedLeaderboards}
        />
      </section>
    </>
  );
};

export default ViewGame;
