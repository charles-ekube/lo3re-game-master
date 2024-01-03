import React from "react";
import CustomButtonII from "../utils/CustomButtonII";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const Pagination = ({ limit, curPage, totalItems, paginate }) => {
  const pageNumbers = [];
  const totalPage = Math.ceil(totalItems / limit);

  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="paginationContainer">
      <ul className="pagination">
        <li className="page-item">
          <CustomButtonII
            icon={<IoChevronBackOutline />}
            variant={"ghost"}
            className={"btnSm"}
            onClick={() => paginate(Number(curPage) - 1)}
            disabled={Number(curPage) === 1}
          />
        </li>
        {pageNumbers?.map((pg) => (
          <li key={"pg-" + pg} className="page-item">
            <CustomButtonII
              text={pg}
              variant={Number(curPage) === pg ? "primary" : "ghost"}
              className={"btnSm"}
              onClick={() => paginate(pg)}
            />
          </li>
        ))}
        <li className="page-item">
          <CustomButtonII
            icon={<IoChevronForwardOutline />}
            variant={"ghost"}
            className={"btnSm"}
            onClick={() => paginate(Number(curPage) + 1)}
            disabled={Number(curPage) >= totalPage}
          />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
