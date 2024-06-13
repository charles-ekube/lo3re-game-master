import React, { useEffect, useState } from "react";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";

// item eg.
// {
//     'name': String,
//     'value': string
// }
const CustomDropdown = ({
  value,
  itemOnClick,
  dropdownItems = [],
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [dropdownIcon, setDropdownIcon] = useState("");

  useEffect(() => {
    const val = dropdownItems.filter((item) => item.value === value);
    setDropdownValue(val[0]?.name || "");
    if (val[0]?.icon) {
      setDropdownIcon(val[0]?.icon);
    }
  }, [value, dropdownItems]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptClick = (val) => {
    itemOnClick(val);
    toggleDropdown();
  };

  return (
    <>
      <div className={`dropdown-container ${className.trim()}`}>
        <button
          onClick={toggleDropdown}
          className={`dropdown-button ${disabled ? "isDisabled" : ""}`}
        >
          <span>
            {dropdownIcon ? <img src={dropdownIcon} alt="" /> : ""}
            {dropdownValue || "Select"}
          </span>
          {isOpen ? <IoChevronUpSharp /> : <IoChevronDownSharp />}
        </button>

        <div className={`dropdown-content ${!isOpen ? "dNone" : ""}`}>
          <ul>
            {!dropdownItems?.length ? <li></li> : ""}
            {dropdownItems.map((val, index) => (
              <li
                key={"drpd" + index}
                onClick={() => handleOptClick(val?.value)}
              >
                {val?.icon && <img src={val?.icon} alt="" />}
                {val?.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CustomDropdown;
