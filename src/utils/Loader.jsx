import React from "react";

// variety: white/dark
const Loader = ({ isLoading, height = "100vh", variety = "white" }) => {
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
    <></>
  );
};

export default Loader;
