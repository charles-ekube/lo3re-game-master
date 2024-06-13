import React from "react";
import CustomDropdown from "./CustomDropdown";

const CurrancyInput = ({
  amountValue,
  onChangeAmount,
  currencyValue,
  onChangeCurrency,
  currencyItems,
  currencyDisabled = false,
  ...otherProps
}) => {
  return (
    <>
      <div className="currencyInputContainer">
        <input
          type="number"
          placeholder="0"
          value={amountValue}
          onChange={(e) => onChangeAmount(e.target.value)}
          {...otherProps}
        />
        <CustomDropdown
          value={currencyValue || "-"}
          className={"amountInnerDropdown"}
          itemOnClick={onChangeCurrency}
          dropdownItems={currencyItems}
          disabled={currencyDisabled}
        />
      </div>
    </>
  );
};

export default CurrancyInput;
