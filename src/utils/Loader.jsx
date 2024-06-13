import React from "react";

// variety: white/dark
const Loader = ({
  isLoading,
  itemLength,
  isNullText,
  height = "100vh",
  variety = "white",
}) => {
  const isNull = itemLength && isNullText ? itemLength === 0 : false;

  return isLoading ? (
    <div
      style={{
        width: "100%",
        marginTop: "40px",
        display: "flex",
        height,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={`loader loader-${variety}`}></div>
    </div>
  ) : (
    <>{isNull ? isNullText : ""}</>
  );
};

export default Loader;
