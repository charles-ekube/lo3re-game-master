import React from "react";

const CustomCheckbox = ({
  label,
  isChecked,
  onChange,
  name,
  isDisabled = false,
  isReadOnly = false,
}) => {
  return (
    <>
      <label className="cr-wrapper">
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={onChange}
          disabled={isDisabled}
          readOnly={isReadOnly}
        />
        <div className="cr-input"></div>
        {label && <span>{label}</span>}
      </label>
    </>
  );
};

export default CustomCheckbox;
