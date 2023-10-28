import React from "react";

const Text = ({ tag, className, children, ...otherProps }) => {
  const CustomTag = tag || "span"; // Default to 'span' if no tag is provided
  const combinedClassName = `text ${className}`.trim(); // Combine the general className and the passed className

  return (
    <CustomTag className={combinedClassName} {...otherProps}>
      {children}
    </CustomTag>
  );
};

export default Text;
