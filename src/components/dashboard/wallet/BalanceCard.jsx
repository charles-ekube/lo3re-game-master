import React, { useEffect, useState } from "react";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";

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
      <div className="balanceCard">
        <div className="flexRow alignCenter">
          <p className="cardTitle">{title}</p>
          {hideBalance ? (
            <PiEyeLight
              className="hideIcon"
              onClick={() => setHideBalance(!hideBalance)}
            />
          ) : (
            <PiEyeSlash
              className="hideIcon"
              onClick={() => setHideBalance(!hideBalance)}
            />
          )}
        </div>
        <p className="balance my-1">{hideBalance ? "***" : `$${figure}`}</p>
        <p className="subtitle">{subtitle}</p>
      </div>
    </>
  );
};

export default BalanceCard;
