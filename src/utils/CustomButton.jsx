import React from "react";
import Text from "./CustomText";

const Button = ({ text, onClick, className, loading, ...otherProps }) => {
  const combinedClassName = `customButton text semiBoldText f16 ${className}`.trim(); // Combine the general className and the passed className

  return (
    <button className={combinedClassName} onClick={onClick} {...otherProps}>
      {loading ? <span className={"loader"}></span> : <Text className={"regularText"}>{text}</Text>}
    </button>
  );
};

export default Button;
