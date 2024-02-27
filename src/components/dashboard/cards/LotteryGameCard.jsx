import React, { useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import lotteryStyles from "../../../assets/styles/lotteries.module.css";
import { BsTrash3 } from "react-icons/bs";
import WasteCollection from "../../../assets/images/wastecollection.png";
import Modal from "../../../utils/Modal";
import CustomButtonII from "../../../utils/CustomButtonII";
import { BiEditAlt } from "react-icons/bi";

const LotteryGameCard = ({ gameId }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className={lotteryStyles.jackpotBox}>
        <div className={lotteryStyles.box}>
          <div className="flexRow justifyBetween alignCenter">
            <span
              className={lotteryStyles.timer}
              onClick={() =>
                navigate(`/dashboard/lotteries/view-game/${gameId}`)
              }
            >
              11h 00m
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
              <Link to={`/dashboard/lotteries/update-game/${gameId}`}>
                <div className="flexRow">
                  <BiEditAlt />
                  <span>Edit</span>
                </div>
              </Link>
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
          <div
            onClick={() => navigate(`/dashboard/lotteries/view-game/${gameId}`)}
          >
            <div className="flexRow justifyEnd alignCenter">
              <MdVerified
                color="var(--primary)"
                className={lotteryStyles.verified}
              />
            </div>
          </div>
        </div>
        <div
          className="content"
          onClick={() => navigate(`/dashboard/lotteries/view-game/${gameId}`)}
        >
          <div className="flexRow justifyBetween alignCenter">
            <p className={lotteryStyles.title}>Jackpot 1</p>
            <div className="flexRow alignCenter" style={{ gap: "3px" }}>
              <TiGroup color="#2F53D7" className={lotteryStyles.userGroup} />
              <span className={lotteryStyles.ticketStat}>1k+</span>
            </div>
          </div>
          <div className={`flexRow ${lotteryStyles.subtitle}`}>
            <p>$10,000</p>
            <span>10%</span>
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
            // loading={isDeleteBeneficiaryLoading}
            // onClick={handleDeleteBeneficiary}
          />
        </div>
      </Modal>
    </>
  );
};

export default LotteryGameCard;
