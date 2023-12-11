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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    const val = dropdownItems.filter((item) => item.value === value);
    setDropdownValue(val[0]?.name || "");
  }, [value]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptClick = (val) => {
    itemOnClick(val);
    toggleDropdown();
  };

  return (
    <>
      <div className={`dropdown-container ${className.trim()}`}>
        <button onClick={toggleDropdown} className="dropdown-button">
          <span>{dropdownValue || "Select Currency"}</span>
          {isOpen ? <IoChevronUpSharp /> : <IoChevronDownSharp />}
        </button>

        {isOpen && (
          <div className="dropdown-content">
            <ul>
              {!dropdownItems?.length ? <li></li> : ""}
              {dropdownItems.map((val) => (
                <li onClick={() => handleOptClick(val?.value)}>{val?.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomDropdown;
