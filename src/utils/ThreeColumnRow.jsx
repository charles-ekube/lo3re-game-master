import React from "react";

const ThreeColumnRow = ({
  icon = null,
  iconBgClass = "bgGrey",
  title,
  subtitle,
  col2Child,
  onClick,
  twoWayClick = false,
  onClick2 = () => null,
}) => {
  return (
    <>
      <div
        className="flexRow justifyBetween utilRow"
        onClick={twoWayClick ? () => null : onClick}
      >
        <div
          className="flexRow alignCenter"
          onClick={twoWayClick ? onClick : () => null}
        >
          {icon && (
            <div className={`icon ${iconBgClass}`}>
              <img src={icon} alt="" />
            </div>
          )}
          <div className="FlexColumn justifyCenter textLeft">
            <p className="title">{title}</p>
            <p className="subtitle">{subtitle}</p>
          </div>
        </div>
        <div
          className="flexColumn alignEnd justifyCenter"
          onClick={twoWayClick ? onClick2 : () => null}
        >
          {col2Child}
        </div>
      </div>
    </>
  );
};

export default ThreeColumnRow;
