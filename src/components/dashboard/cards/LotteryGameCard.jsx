import React, { useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import lotteryStyles from "../../../assets/styles/lotteries.module.css";
import { BsTrash3 } from "react-icons/bs";
import WasteCollection from "../../../assets/images/wastecollection.png";
import Modal from "../../../utils/Modal";
import CustomButtonII from "../../../utils/CustomButtonII";
import { BiEditAlt } from "react-icons/bi";
import useTimeFormatter from "../../../hooks/useTimeFormatter";
import { useDeleteGameMutation } from "../../../redux/services/gameApi";
import { showError, showSuccess } from "../../../utils/Alert";
import BgImage from "../../../assets/images/default.png";
import useTextTruncate from "../../../hooks/useTextTruncate";

const LotteryGameCard = ({ game, isDraft = false }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { truncateNumber } = useTextTruncate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { formatDuration } = useTimeFormatter();
  const navigate = useNavigate();
  const { truncateText, formatMoney } = useTextTruncate();
  const [deleteGame, { isLoading: isDeleteGameLoading }] =
    useDeleteGameMutation();

  const handleDeleteGame = async () => {
    await deleteGame(game?.id)
      .unwrap()
      .then(() => {
        showSuccess("Game deleted");
        setShowDeleteModal(false);
      })
      .catch((err) => {
        showError("An error occurred, try again later");
        console.log(err);
      });
  };

  const viewGame = () => {
    if (game?.status === "draft" || !game?.status) {
      navigate("/dashboard/lotteries/view-drafted-game", {
        state: { game },
      });
    } else {
      navigate("/dashboard/lotteries/view-game", {
        state: { game },
      });
    }
  };

  const updateGame = () => {
    navigate("/dashboard/lotteries/update-game", {
      state: { game, isDraft },
    });
  };

  return (
    <>
      <div className={lotteryStyles.jackpotBox}>
        <div
          className={lotteryStyles.box}
          style={{ backgroundImage: `url(${game?.coverUrl || BgImage})` }}
        >
          <div className="flexRow justifyBetween alignCenter">
            <span className={lotteryStyles.timer} onClick={viewGame}>
              {formatDuration(game?.endOn)}
            </span>
            <button
              className="btn btn-ghost no-hover p0"
              id="ellipse-btn"
              onClick={() => setShowOptions(true)}
            >
              <FaEllipsis
                color={"var(--white)"}
                id="ellipse"
                className={lotteryStyles.ellipse}
              />
            </button>
          </div>
          {showOptions ? (
            <div className={`${lotteryStyles.optionsContainer}`}>
              <div className={`${lotteryStyles.delOpt}`} onClick={updateGame}>
                <BiEditAlt />
                <span>Edit</span>
              </div>
              <div
                className={`${lotteryStyles.delOpt}`}
                onClick={() => {
                  setShowDeleteModal(true);
                  setShowOptions(false);
                }}
              >
                <div className="flexRow">
                  <BsTrash3 />
                  <span>Delete</span>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div onClick={viewGame}>
            <div className="flexRow justifyEnd alignCenter">
              <MdVerified
                color="var(--primary)"
                className={lotteryStyles.verified}
              />
            </div>
          </div>
        </div>
        <div className="content" onClick={viewGame}>
          <div className="flexRow justifyBetween alignCenter">
            <p className={`capitalize ${lotteryStyles.title}`}>
              {truncateText(game?.title, 8)}
            </p>
            <div className="flexRow alignCenter" style={{ gap: "3px" }}>
              <TiGroup color="#2F53D7" className={lotteryStyles.userGroup} />
              <span
                className={lotteryStyles.ticketStat}
                style={{ fontSize: "12px" }}
              >
                {truncateNumber(game?.totalPlayers)}
              </span>
            </div>
          </div>
          <div className={`flexRow ${lotteryStyles.subtitle}`}>
            <p>${formatMoney(game?.jackpot)}</p>
            {/* <span>10%</span> */}
          </div>
        </div>
      </div>
      {showOptions ? (
        <div
          className={lotteryStyles.optionsOverlay}
          onClick={() => setShowOptions(false)}
        ></div>
      ) : (
        ""
      )}

      {/* modals */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
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
    </>
  );
};

export default LotteryGameCard;
