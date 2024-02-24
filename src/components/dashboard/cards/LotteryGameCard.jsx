import React from "react";
import { FaEllipsis } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import lotteryStyles from "../../../assets/styles/lotteries.module.css";

const LotteryGameCard = () => {
  return (
    <div className={lotteryStyles.jackpotBox}>
      <div className={lotteryStyles.box}>
        <div className="flexRow justifyBetween alignCenter">
          <span className={lotteryStyles.timer}>11h 00m</span>
          <button className="btn btn-ghost no-hover p0">
            <FaEllipsis
              color={"var(--white)"}
              className={lotteryStyles.ellipse}
            />
          </button>
        </div>
        <div>
          <div className="flexRow justifyEnd alignCenter">
            <MdVerified
              color="var(--primary)"
              className={lotteryStyles.verified}
            />
          </div>
        </div>
      </div>
      <div className="content">
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
  );
};

export default LotteryGameCard;
