import React from "react";
import MasterCard from "../../../assets/images/mastercard.png";

const BankCard = ({ name }) => {
  return (
    <>
      <div className="flexRow justifyBetween bankCard">
        <div className="flexRow gap-1">
          <div className="icon">
            <img src={MasterCard} />
          </div>
          <div className="FlexColumn justifyCenter">
            <p className="title">{name}</p>
            <p className="subtitle">Debit</p>
          </div>
        </div>
        <p className="subtitle">*1234</p>
      </div>
    </>
  );
};

export default BankCard;
