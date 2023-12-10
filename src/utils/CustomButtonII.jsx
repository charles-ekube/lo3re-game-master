import React from "react";
import Text from "./CustomText";

// varaints => primary, secondary, light
const CustomButtonII = ({
  text,
  onClick,
  className,
  loading,
  icon,
  variant,
  ...otherProps
}) => {
  const combinedClassName =
    `btn-${variant} customButton text semiBoldText f16 ${className}`.trim(); // Combine the general className and the passed className

  return (
    <button className={combinedClassName} onClick={onClick} {...otherProps}>
      {loading ? (
        <span className={"loader"}></span>
      ) : (
        <Text
          className={"regularText flexRow alignCenter"}
          style={{ gap: "8px" }}
        >
          {text}
          {icon}
        </Text>
      )}
    </button>
  );
};

export default CustomButtonII;
