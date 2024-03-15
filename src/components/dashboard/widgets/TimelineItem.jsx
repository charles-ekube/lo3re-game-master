import React from "react";
import NotificationStyles from "../../../assets/styles/notification.module.css";
import WalletAdd from "../../../assets/images/icons/wallet-add.png";
import WalletMinus from "../../../assets/images/icons/wallet-minus.png";
import AngleRight from "../../../assets/images/icons/angle.png";

const TimelineItem = ({
  title,
  subtitle,
  positionClass,
  amount = null,
  img = null,
}) => {
  const isCreditTxn = title === "deposit";
  const iconBgClassImg = () => {
    let klass;
    let imgSrc;
    let useText = false;

    if (title.toLowerCase() === "deposit") {
      klass = "iconBg-success";
      imgSrc = WalletAdd;
    } else if (title.toLowerCase() === "withdraw") {
      klass = "iconBg-danger";
      imgSrc = WalletMinus;
    } else {
      klass = "iconBg-secondary";
      imgSrc = img || title[0];
      useText = !img ? true : false;
    }

    return { klass, imgSrc, useText };
  };

  const iconBg = iconBgClassImg();

  return (
    <>
      <div class={`${NotificationStyles.container}`}>
        <img src={AngleRight} className={NotificationStyles.arrow} alt="" />
        <div class={`${NotificationStyles.content}`}>
          <div className="flexRow alignCenter">
            <div className={`${NotificationStyles.icon} ${iconBg.klass}`}>
              {iconBg.useText ? (
                <p className="boldText">{iconBg.imgSrc}</p>
              ) : (
                <img src={iconBg.imgSrc} alt="icon" />
              )}
            </div>
            <div className="flexColumn justifyCenter">
              <p
                className={`mediumText capitalize ${NotificationStyles.title}`}
              >
                {title}
              </p>
              <p className={`text-muted ${NotificationStyles.subtitle}`}>
                {subtitle}
              </p>
            </div>
          </div>
          {amount ? (
            <p className={`mediumText ${NotificationStyles.figure}`}>{`${
              isCreditTxn ? "+" : "-"
            }$${amount}`}</p>
          ) : (
            ""
          )}
          <div
            className={`flexColumn alignEnd mediumText text-muted text-end ${NotificationStyles.date}`}
            style={{ gap: "4px" }}
          >
            <p>Aug 30, 2024</p>
            <p>10:03</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineItem;
