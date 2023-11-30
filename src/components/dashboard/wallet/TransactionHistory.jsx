import React from "react";
import WalletAdd from "../../../assets/images/icons/wallet-add.png";
import WalletMinus from "../../../assets/images/icons/wallet-minus.png";

const TransactionHistory = ({ isCreditTxn }) => {
  return (
    <div className="flexRow justifyBetween historyRow">
      <div className="flexRow alignCenter">
        <div
          className={`icon ${isCreditTxn ? "iconBg-success" : "iconBg-danger"}`}
        >
          <img src={isCreditTxn ? WalletAdd : WalletMinus} />
        </div>
        <div className="FlexColumn justifyCenter">
          <p className="title">{isCreditTxn ? "Wallet Fund" : "Withdrawal"}</p>
          <p className="date">Oct 20, 2023</p>
        </div>
      </div>
      <p className="amount">{isCreditTxn ? "+" : "-"}$30.00</p>
    </div>
  );
};

export default TransactionHistory;
