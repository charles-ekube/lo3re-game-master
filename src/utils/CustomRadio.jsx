import React from "react";

const CustomRadio = ({ isChecked }) => {
  return (
    <>
      <label class="cr-wrapper">
        <input name="radio" type="radio" checked={isChecked} />
        <div class="cr-input"></div>
        {/* <span>Radio - checked</span> */}
      </label>
    </>
  );
};

export default CustomRadio;
