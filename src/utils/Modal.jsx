import React from "react";
import { LiaTimesSolid } from "react-icons/lia";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen ? (
        <>
          <div className="overlay z-500" onClick={onClose}></div>
          <div className="modal">
            <div className="flexColumn alignEnd p-1">
              <button
                className="btn btn-ghost text-danger f20"
                onClick={onClose}
              >
                <LiaTimesSolid />
              </button>
            </div>
            <div className="modal-content">{children}</div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Modal;
