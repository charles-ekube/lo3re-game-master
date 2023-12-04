import React from "react";
import { LiaTimesSolid } from "react-icons/lia";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen ? (
        <>
          <div className="overlay z-500" onClick={onClose}></div>
          <div className="modal">
            <div className="flexColumn alignEnd">
              <button
                className="btn btn-ghost text-danger f20"
                onClick={onClose}
              >
                <LiaTimesSolid size={24} />
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
