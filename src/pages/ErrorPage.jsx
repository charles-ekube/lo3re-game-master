import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="flexColumn justifyCenter alignCenter h100">
      <h2>
        {error.status} | {error.statusText || error.message}
      </h2>
    </div>
  );
};

export default ErrorPage;
