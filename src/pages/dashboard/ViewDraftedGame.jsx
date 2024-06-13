import React, { useState } from "react";
// import Camera from "../../assets/images/camera.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import BgImage from "../../assets/images/default.png";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Modal from "../../utils/Modal";
import WasteCollection from "../../assets/images/wastecollection.png";
import { GrLink } from "react-icons/gr";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import {
  useDeleteDraftGameMutation,
  useFetchGameTicketsQuery,
} from "../../redux/services/gameApi";
import { showError, showSuccess } from "../../utils/Alert";
import useTextTruncate from "../../hooks/useTextTruncate";
import TicketSalesModal from "../../components/dashboard/widgets/TicketSalesModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { formatDateToLocaleString, formatDuration } = useTimeFormatter();
  const { formatMoney, ensureHttps } = useTextTruncate();
  const { data: gameTickets } = useFetchGameTicketsQuery();
  const [deleteDraftedGame, { isLoading: isDeleteGameLoading }] =
    useDeleteDraftGameMutation();

  const handleDeleteGame = async () => {
    await deleteDraftedGame(game?.id)
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
      <section className={`mainContainer ${lotteryStyles.mainContainer}`}>
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
                  <p className={lotteryStyles.timerLg}>
                    {formatDuration(game?.endOn)} left
                  </p>
                </div>
              </div>
            </div>
          </div>
          <form className={lotteryStyles.lotteryForm}>
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
                    state: { game, isDraft: true },
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
          {/* customer corner */}
          <div className={"contactCornerContainer"}>
            <Text tag={"p"} className={"f16 satoshi-bold-text"}>
              Customer corner
            </Text>
            <ContactCard />
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
            Are you sure you want to delete this drafted lottery?
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
      </section>
    </>
  );
};

export default ViewGame;
