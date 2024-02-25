import React, { useState } from "react";
// import Camera from "../../assets/images/camera.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import BgImage from "../../assets/images/Image.png";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { IoChevronForward } from "react-icons/io5";
import { TiGroup } from "react-icons/ti";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import MsgAdd from "../../assets/images/icons/message-add.png";
import { IoLogoWhatsapp } from "react-icons/io";
import BalanceCard from "../../components/dashboard/wallet/BalanceCard";

const ViewGame = () => {
  const navigate = useNavigate();
  const [formState] = useState({
    lotteryName: "Jackpot 1",
    ticketPrice: "20",
    jackpotPrize: "20,000",
    ticketCapacity: "212",
    lotteryStarts: "",
    lotteryEnds: "",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia provident, quasi praesentium odio assumenda laudantium error. Iusto blanditiis fugiat dolores exercitationem maxime incidunt omnis, ullam assumenda vel sit! Placeat, doloribus!",
    telegramLink: "",
    facebookLink: "",
    whatsapp: "",
    others: "",
  });

  return (
    <>
      <section className="mainContainer w65-45">
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
              <h3 className="title capitalize">{formState.lotteryName}</h3>
              <p className={`subtitle ${lotteryStyles.subtitle}`}>
                Jackpot prize: <b>${formState.jackpotPrize}</b>
              </p>
              <div
                className={`fs14 mediumText ${lotteryStyles.liveUserStatFlex}`}
              >
                <div
                  className="flexRow alignCenter"
                  style={{ gap: "8px", flexWrap: "wrap" }}
                >
                  <div className="flexRow alignCenter">
                    <GoDotFill color={"#06C167"} />
                    <span>Live</span>
                  </div>
                  <p className={lotteryStyles.timerLg}>11h 00m left</p>
                </div>
                <div className="flexRow alignCenter" style={{ gap: "4px" }}>
                  <TiGroup color="#2F53D7" fontSize={24} />
                  <span className="text-muted fs14">1002/10,000 playing</span>
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
                  value={"$" + formState.ticketPrice}
                  readOnly
                  name="ticketPrice"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Ticket capacity</label>
                <input
                  type="number"
                  className="formInput"
                  value={formState.ticketCapacity}
                  readOnly
                  name="ticketCapacity"
                />
              </div>
            </div>

            <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
              <label>Description</label>
              <textarea
                className="formInput"
                value={formState.description}
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
                  value={formState.lotteryStarts}
                  readOnly
                  name="ticketPrice"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Lottery ends</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.lotteryEnds}
                  readOnly
                  name="ticketCapacity"
                />
              </div>
            </div>

            <div className={lotteryStyles.links}>
              <p>Links</p>
              <div
                className="flexRow"
                style={{ gap: "10px", marginTop: "10px", fontSize: "27px" }}
              >
                <a href="/#" target={"_blank"} rel="noreferrer">
                  <FaTelegram color="#28A8E9" />
                </a>
                <a href="/#" target={"_blank"} rel="noreferrer">
                  <FaFacebook color="#0F8FF2" />
                </a>
                <a href="/#" target={"_blank"} rel="noreferrer">
                  <IoLogoWhatsapp color="#2AB03F" />
                </a>
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
                centerText={true}
              />
              <CustomButtonII
                variant={"primary"}
                text={"Update"}
                className="btnLg"
                type="button"
                // onClick={submitForm}
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
              figure={"40"}
              subtitle={"Updated 3 mins ago"}
              hideEyeIcon={true}
            />
            <BalanceCard
              title={"Ticket sales"}
              figure={"$1000"}
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
                <p className={`flexRow alignCenter cursor-pointer fs14`}>
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

          {/* TODO: fix leader overflow */}
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
                <table class="chakra-table css-188ecbe">
                  <thead class="css-0">
                    <tr class="css-kiemwp">
                      <td class="css-odbtz1">Player name</td>
                      <td class="css-odbtz1">Rank</td>
                      <td class="css-odbtz1">Lottery no</td>
                      <td class="css-odbtz1">Jackpot win</td>
                      <td class="css-odbtz1"></td>
                    </tr>
                  </thead>
                  <tbody class="css-1yuhvjn">
                    {Winners.map((val, idx) => (
                      <tr
                        class={`${idx === 2 ? lotteryStyles.activeUser : ""}`}
                        key={`ld-${idx}`}
                      >
                        <td class="css-1cbprck">
                          <div class={`flexRow alignCenter`}>
                            <div class={lotteryStyles.tableAvatar}>
                              <p>R</p>
                            </div>
                            <div class="css-zupw4a">
                              <p class={lotteryStyles.leaderName}>{val.name}</p>
                            </div>
                          </div>
                        </td>
                        <td class="css-1k0yhhj">{val.rank}</td>
                        <td class="css-1k0yhhj">
                          <p class={lotteryStyles.leaderLottoNumber}>012345</p>
                        </td>
                        <td class="css-1k0yhhj">{val.win}</td>
                        <td class="css-16ixpl9">3 mins ago</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
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
