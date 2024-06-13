import React from "react";
import { CiUser } from "react-icons/ci";
import Text from "./CustomText";
import "../assets/styles/utilsStyles.css";

const Avatar = ({
  name,
  fontSize = "16px",
  onlyFirstLetter = false,
  src,
  boxSize = "36px",
  className,
}) => {
  // Check if displayName is a string and not empty
  let firstLetter = "";
  let lastLetter = "";
  if (typeof name !== "string" || name.length === 0) {
    firstLetter = "X";
    lastLetter = "X";
  } else {
    firstLetter = name[0];
    lastLetter = name.length !== 1 ? name[name.length - 1] : "";
  }

  return (
    <div
      className={`nameTagContainer ${src ? "hasSrc" : ""} ${className}`}
      style={{ height: boxSize, width: boxSize }}
    >
      {src ? (
        <img src={src} className="nameTagImg" alt="" />
      ) : (
        <Text
          className={"satoshi-text mediumText upper"}
          style={{ color: "rgba(16, 16, 16, 1)", fontSize }}
        >
          {firstLetter ? firstLetter : <CiUser size={18} />}
          {lastLetter && !onlyFirstLetter ? lastLetter : ""}
        </Text>
      )}
    </div>
  );
};

export default Avatar;
