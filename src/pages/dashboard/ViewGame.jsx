import React, { useState } from "react";
// import Camera from "../../assets/images/camera.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import BgImage from "../../assets/images/Image.png";
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
import Text from "../../utils/CustomText";
import Avatar from "../../utils/Avatar";
import Pagination from "../../utils/Pagination";
import { GrLink } from "react-icons/gr";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { useDeleteGameMutation } from "../../redux/services/gameApi";
import { showError, showSuccess } from "../../utils/Alert";

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
  const game = location.state?.game;
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { formatDateToLocaleString, formatDuration } = useTimeFormatter();
  const [deleteGame, { isLoading: isDeleteGameLoading }] =
    useDeleteGameMutation();

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
          <IoIosArrowRoundBack
            size={34}
            className={"cursor-pointer"}
            onClick={() => navigate(-1)}
            style={{ marginBottom: "16px" }}
          />
          <div
            className={`flexRow alignCenter avatarProfileContainer ${lotteryStyles.avatarProfileContainer} ${lotteryStyles.viewGameAvatarContainer}`}
          >
            <div className={lotteryStyles.avatar}>
              <img src={BgImage} alt="" className={lotteryStyles.fileImg} />
            </div>
            <div className={lotteryStyles.content}>
              <h3 className="title capitalize">{game?.title}</h3>
              <p className={`subtitle ${lotteryStyles.subtitle}`}>
                Jackpot prize: <b>${game?.jackpot}</b>
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
                  value={`${game?.ticketSalesCount}/${game?.ticketGoal}`}
                  readOnly
                  name="ticketCapacity"
                />
              </div>
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
                    href={game?.socials?.telegram}
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
                    href={game?.socials?.facebook}
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
                    href={game?.socials?.whatsapp}
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
                    href={game?.socials?.others}
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
              figure={`$${game?.ticketSales}`}
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
                      <tr>
                        <td className={lotteryStyles.st1}>#abc</td>
                        <td className={lotteryStyles.st2}>
                          <p className={lotteryStyles.tablePill}>012345</p>
                        </td>
                        <td className={lotteryStyles.st3}>3 mins ago</td>
                      </tr>
                      <tr>
                        <td
                          className={`${lotteryStyles.st1} ${lotteryStyles.mid}`}
                        >
                          #abc
                        </td>
                        <td
                          className={`${lotteryStyles.st2} ${lotteryStyles.mid}`}
                        >
                          <p className={lotteryStyles.tablePill}>012345</p>
                        </td>
                        <td
                          className={`${lotteryStyles.st3} ${lotteryStyles.mid}`}
                        >
                          3 mins ago
                        </td>
                      </tr>
                      <tr>
                        <td className={lotteryStyles.st1}>#abc</td>
                        <td className={lotteryStyles.st2}>
                          <p className={lotteryStyles.tablePill}>012345</p>
                        </td>
                        <td className={lotteryStyles.st3}>3 mins ago</td>
                      </tr>
                    </tbody>
                  </table>
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
                  <p className="textCenter fs14" style={{ color: "#48494D" }}>
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
              <p className="flexRow alignCenter cursor-pointer fs14">
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
                    {Winners.map((val, idx) => (
                      <tr
                        className={`${
                          idx === 2 ? lotteryStyles.activeUser : ""
                        }`}
                        key={`ld-${idx}`}
                      >
                        <td>
                          <div className={`flexRow alignCenter`}>
                            <div className={lotteryStyles.tableAvatar}>
                              <p>R</p>
                            </div>
                            <div>
                              <p className={lotteryStyles.leaderName}>
                                {val.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{val.rank}</td>
                        <td>
                          <p className={lotteryStyles.leaderLottoNumber}>
                            012345
                          </p>
                        </td>
                        <td>{val.win}</td>
                        <td>3 mins ago</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            Are you sure you want to delete this active lottery?
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

        <Modal
          title={"Ticket sales"}
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          modalClass={lotteryStyles.ticketSalesModal}
        >
          <div className={`${lotteryStyles.ticketList}`}>
            <TicketRows />
            <TicketRows />
            <TicketRows />
            <TicketRows />
            <TicketRows />
          </div>
          <Pagination
            limit={1}
            curPage={currentPage}
            totalItems={2}
            paginate={(num) => setCurrentPage(num)}
          />
        </Modal>
      </section>
    </>
  );
};

const TicketRows = () => {
  return (
    <div
      className={`flexRow justifyBetween alignCenter ${lotteryStyles.ticketRow}`}
    >
      <div className="flexRow alignCenter" style={{ gap: "8px" }}>
        <Avatar
          name={"R"}
          className={lotteryStyles.ticketSaleAvatar}
          boxSize={"48px"}
        />
        <Text
          className={`satoshi-text mediumText capitalize ${lotteryStyles.modalTextResp}`}
          style={{ color: "rgba(16, 16, 16, 1)" }}
        >
          Raynera
        </Text>
      </div>
      <div>
        <div
          className={`status-pill pill-invalid mediumText btnSm ${lotteryStyles.modalTextResp} ${lotteryStyles.statusPill}`}
          style={{ color: "#727272" }}
        >
          #01234567
        </div>
      </div>
      <div
        className={`flexColumn textRight ${lotteryStyles.modalTextResp}`}
        style={{ color: "#A6A6A6", gap: "4px" }}
      >
        <p>3 mins ago</p>
        <p className="mediumText">25 November, 2023</p>
      </div>
    </div>
  );
};

const Winners = [
  {
    name: "Raynera",
    rank: "👑 King",
    win: "$50",
  },
  {
    name: "Raynera",
    rank: "⚔️ Knight",
    win: "$20",
  },
  {
    name: "Raynera",
    rank: "🧙🏽‍♂️ Mage",
    win: "$10",
  },
  {
    name: "Raynera",
    rank: "-",
    win: "$0",
  },
];

export default ViewGame;
