import React from "react";
import { PiEyeSlash } from "react-icons/pi";

const BalanceCard = ({ title, figure, subtitle }) => {
  return (
    <>
      <div className="balanceCard">
        <div className="flexRow alignCenter">
          <p className="cardTitle">{title}</p>
          <PiEyeSlash className="hideIcon" />
        </div>
        <p className="balance my-1">${figure}</p>
        <p className="subtitle">{subtitle}</p>
      </div>
    </>
  );
};

export default BalanceCard;
