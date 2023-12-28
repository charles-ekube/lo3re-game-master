import React from "react";
import Text from "./CustomText";

// varaints => primary, secondary, light, danger, ghost-danger
const CustomButtonII = ({
  text,
  onClick,
  className,
  loading,
  icon,
  variant = "primary",
  centerText = false,
  ...otherProps
}) => {
  const combinedClassName =
    `btn-${variant} customButton text semiBoldText f16 ${className}`.trim(); // Combine the general className and the passed className

  return (
    <button className={combinedClassName} onClick={onClick} {...otherProps}>
      {loading ? (
        <div
          className="flexRow justifyCenter alignCenter"
          style={{ width: "100%", height: "100%" }}
        >
          <span className={"loader"}></span>
        </div>
      ) : (
        <Text
          className={`regularText flexRow alignCenter ${
            centerText ? "justifyCenter" : ""
          }`}
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
