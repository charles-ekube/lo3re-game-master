import React, { useState } from "react";
import Text from "./CustomText";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const CustomInput = ({ label, type, name, value, onfocus, onChange, placeholder, disabled, maxLength, customLabel, inputStyle, customInputContainer, multiple, ref, customInput, key, defaultValue, ...otherProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={`inputContainer ${customInputContainer}`} {...otherProps}>
        <label style={{ color: "#000" }}>
          <Text tag={"p"} className={"f14 mediumText"}>
            {label}
          </Text>
        </label>
        <div className={`flexRow alignCenter input ${customInput}`}>
          <input type={showPassword ? "text" : type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`${inputStyle}`} disabled={disabled} maxLength={maxLength} multiple={multiple} ref={ref} key={key} aria-autocomplete="none" autoComplete="new-password" onFocus={onfocus} defaultValue={defaultValue} />
          {type === "password" && (
            <button type="button" onClick={handleTogglePassword}>
              <Text tag={"p"} className={"f10 mediumText"}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </Text>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomInput;
