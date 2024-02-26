import React from "react";
import NotiIcon from "../../../assets/images/icons/notification.png";

const TicketPurchaseNotification = ({
  message,
  chatMsg = null,
  status,
  date,
}) => {
  let newDate = new Date(date * 1000);
  newDate = newDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="flexRow justifyBetween historyRow ticket-notification-row list-divider">
        <div className="flexRow alignCenter">
          <div className={`icon iconBg-secondary`}>
            <img src={NotiIcon} alt="" />
          </div>
          <div className="flexColumn justifyCenter" style={{ gap: "4px" }}>
            <p className="title">{message}</p>
            {chatMsg ? (
              <div className="ref-code-box">
                <p>{chatMsg}</p>
              </div>
            ) : (
              ""
            )}
            <p className="date">{newDate}</p>
          </div>
        </div>
        <div className="flexColumn justifyEnd text-end text-muted">
          <p className={"status-text"}>{status}</p>
        </div>
      </div>
    </>
  );
};

export default TicketPurchaseNotification;
