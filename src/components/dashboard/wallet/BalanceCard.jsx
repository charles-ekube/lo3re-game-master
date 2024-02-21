import React, { useEffect, useState } from "react";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import cardStyles from "../../../assets/styles/cardStyles.module.css";

const BalanceCard = ({ title, figure, subtitle, isBalanceLoading }) => {
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    if (isBalanceLoading) {
      setHideBalance(true);
    } else {
      setHideBalance(false);
    }
  }, [isBalanceLoading]);

  return (
    <>
      <div className={cardStyles.balanceCard}>
        <div className="flexRow alignCenter">
          <p className={cardStyles.cardTitle}>{title}</p>
          {hideBalance ? (
            <PiEyeLight
              className={cardStyles.hideIcon}
              onClick={() => setHideBalance(!hideBalance)}
            />
          ) : (
            <PiEyeSlash
              className={cardStyles.hideIcon}
              onClick={() => setHideBalance(!hideBalance)}
            />
          )}
        </div>
        <p className={`${cardStyles.balance} my-1`}>
          {hideBalance ? "***" : `$${figure}`}
        </p>
        <p className={cardStyles.cardTitle}>{subtitle}</p>
      </div>
    </>
  );
};

export default BalanceCard;
