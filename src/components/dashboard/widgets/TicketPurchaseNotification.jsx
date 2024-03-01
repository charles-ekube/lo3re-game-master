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
      <div className="flexRow alignCenter historyRow ticket-notification-row py-1 list-divider">
        <div className={`icon iconBg-secondary`}>
          <img src={NotiIcon} alt="" />
        </div>
        <div
          className="flexColumn justifyCenter"
          style={{ gap: "4px", width: "calc(100% - 58px)" }}
        >
          <p className="title">{message}</p>
          {chatMsg ? (
            <div className="ref-code-box msg-box">
              <p>{chatMsg}</p>
            </div>
          ) : (
            ""
          )}
          <div className="flexRow justifyBetween text-muted">
            <p className={"status-text"}>{status}</p>
            <p className="date">{newDate}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketPurchaseNotification;
