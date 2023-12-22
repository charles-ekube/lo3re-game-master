import React from "react";
import { LiaTimesSolid } from "react-icons/lia";

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
              <h3 className="capitalize">{title}</h3>
              <button
                className={`btn btn-ghost text-danger f20 closeBtn ${
                  hideCloseBtn ? "dNone" : ""
                }`}
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
