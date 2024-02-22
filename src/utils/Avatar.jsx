import React from "react";
import { CiUser } from "react-icons/ci";
import Text from "./CustomText";

const Avatar = ({ name }) => {
  // Check if displayName is a string and not empty
  let firstLetter = "";
  let lastLetter = "";
  if (typeof name !== "string" || name.length === 0) {
    firstLetter = "X";
    lastLetter = "X";
  } else {
    firstLetter = name[0];
    lastLetter = name[name.length - 1];
  }

  return (
    <div className="nameTagContainer">
      <Text
        className={"satoshi-text f14 upper"}
        style={{ color: "rgba(16, 16, 16, 1)" }}
      >
        {firstLetter ? firstLetter : <CiUser size={18} />}
        {lastLetter ? lastLetter : ""}
      </Text>
    </div>
  );
};

export default Avatar;
