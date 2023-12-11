import React from "react";
import CustomDropdown from "./CustomDropdown";

const CurrancyInput = ({
  amountValue,
  onChangeAmount,
  currencyValue,
  onChangeCurrency,
  currencyItems,
}) => {
  return (
    <>
      <div className="currencyInputContainer">
        <input
          type="number"
          placeholder="0"
          value={amountValue}
          onChange={(e) => onChangeAmount(e.target.value)}
        />
        <CustomDropdown
          value={currencyValue || "-"}
          className={"amountInnerDropdown"}
          itemOnClick={onChangeCurrency}
          dropdownItems={currencyItems}
        />
      </div>
    </>
  );
};

export default CurrancyInput;
