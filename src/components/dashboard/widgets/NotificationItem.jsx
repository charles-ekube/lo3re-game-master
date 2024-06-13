import React from "react";
import NotiIcon from "../../../assets/images/icons/notification.png";

const NotificationItem = ({ title, date }) => {
  let newDate = new Date(date);
  newDate = newDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className={`flexRow justifyBetween historyRow py-1 list-divider`}>
        <div className="flexRow alignCenter">
          <div className={`icon notif-icon iconBg-secondary`}>
            <img src={NotiIcon} alt="" />
          </div>
          <div className="FlexColumn justifyCenter">
            <p className="title notif-title capitalize">{title}</p>
            <p className="date">{newDate}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationItem;
