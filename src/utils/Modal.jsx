import React from "react";
import { LiaTimesSolid } from "react-icons/lia";

const Modal = ({ isOpen, onClose, title = null, children }) => {
  return (
    <>
      {isOpen ? (
        <>
          <div className="overlay z-500" onClick={onClose}></div>
          <div className="modal">
            <div className={`flexRow justifyBetween alignCenter posRelative`}>
              <h3 className="capitalize">{title}</h3>
              <button
                className="btn btn-ghost text-danger f20 closeBtn"
                onClick={onClose}
              >
                <LiaTimesSolid size={24} />
              </button>
            </div>
            <div className="modalContent">{children}</div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Modal;
