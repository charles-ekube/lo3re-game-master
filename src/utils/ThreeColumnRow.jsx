import React from "react";

const ThreeColumnRow = ({
  icon = null,
  iconBgClass = "bgGrey",
  title,
  subtitle,
  col2Child,
  onClick,
}) => {
  return (
    <>
      <div className="flexRow justifyBetween utilRow" onClick={onClick}>
        <div className="flexRow alignCenter">
          {icon && (
            <div className={`icon ${iconBgClass}`}>
              <img src={icon} />
            </div>
          )}
          <div className="FlexColumn justifyCenter textLeft">
            <p className="title">{title}</p>
            <p className="subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="flexColumn alignEnd justifyCenter">{col2Child}</div>
      </div>
    </>
  );
};

export default ThreeColumnRow;
