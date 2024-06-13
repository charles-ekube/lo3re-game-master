import React from "react";

const CustomRadio = ({ isChecked }) => {
  return (
    <>
      <label className="cr-wrapper">
        <input
          name="radio"
          type="radio"
          checked={isChecked}
          onChange={() => null}
        />
        <div className="cr-input"></div>
        {/* <span>Radio - checked</span> */}
      </label>
    </>
  );
};

export default CustomRadio;
