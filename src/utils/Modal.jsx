import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  hideCloseBtn = false,
  title = null,
  zClass = "",
  glassOverlay = false,
  children,
}) => {
  return (
    <>
      {isOpen ? (
        <>
          {glassOverlay && <div className="glassMorph"></div>}
          <div className={`overlay z500 ${zClass}`} onClick={onClose}></div>
          <div className={`modal ${zClass}`}>
            <div className={`flexRow justifyBetween alignCenter posRelative`}>
              <h3 className="modalTitle">{title}</h3>
              <button
                className={`btn btn-ghost no-hover textDanger closeBtn ${
                  hideCloseBtn ? "dNone" : ""
                }`}
                onClick={onClose}
              >
                <FaTimes size={16} />
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
