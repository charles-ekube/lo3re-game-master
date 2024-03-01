import React, { useState } from "react";
import WalletAdd from "../../../assets/images/icons/wallet-add.png";
import WalletMinus from "../../../assets/images/icons/wallet-minus.png";
import Modal from "../../../utils/Modal";
import useCopyToClipBoard from "../../../hooks/useCopyToClipboard";
import { LuCopy } from "react-icons/lu";
import { AiOutlineCheck } from "react-icons/ai";
import CustomButtonII from "../../../utils/CustomButtonII";
import historyStyles from "../../../assets/styles/history.module.css";

const TransactionHistory = ({
  type,
  amount,
  currency,
  date,
  method,
  txnId,
  status,
  disableModal = false,
  checkoutUrl = "",
}) => {
  const [showTxnModal, setShowTxnModal] = useState(false);
  const { handleCopyClick, isCopied } = useCopyToClipBoard();
  const isCreditTxn = type === "deposit";
  let newDate = new Date(date * 1000);
  newDate = newDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusClass = () => {
    let txt = "textWarning";
    if (
      status?.toLowerCase() === "success" ||
      status?.toLowerCase() === "completed"
    ) {
      txt = "textSuccess";
    } else if (
      status?.toLowerCase() === "failed" ||
      status?.toLowerCase() === "expired"
    ) {
      txt = "textDanger";
    }

    return txt;
  };

  const redirectToCheckout = () => {
    window.open(checkoutUrl, "_blank");
  };

  return (
    <>
      <div
        className={`flexRow justifyBetween historyRow py-1 list-divider`}
        onClick={() => setShowTxnModal(!disableModal)}
      >
        <div className="flexRow alignCenter">
          <div
            className={`icon ${
              isCreditTxn ? "iconBg-success" : "iconBg-danger"
            }`}
          >
            <img src={isCreditTxn ? WalletAdd : WalletMinus} alt="" />
          </div>
          <div className="FlexColumn justifyCenter">
            <p className="title capitalize">{type}</p>
            <p className="date">{newDate}</p>
          </div>
        </div>
        <div className="FlexColumn justifyEnd text-end">
          <p className="amount">
            {isCreditTxn ? "+" + amount : "-" + amount} {currency.toUpperCase()}
          </p>
          <p className={"capitalize " + statusClass()}>{status}</p>
        </div>
      </div>

      <Modal isOpen={showTxnModal} onClose={() => setShowTxnModal(false)}>
        <h2 className={`${historyStyles.modalAmount} satoshi-text`}>
          {isCreditTxn ? "+" + amount : "-" + amount} {currency.toUpperCase()}
        </h2>
        <div
          className={`${historyStyles.pill} ${
            isCreditTxn ? "iconBg-success" : "iconBg-danger"
          }`}
        >
          <div className={historyStyles.pillIcon}>
            <img src={isCreditTxn ? WalletAdd : WalletMinus} alt="" />
          </div>
          <p>
            <span className="capitalize">{type}</span> | {newDate}
          </p>
        </div>
        <div className={historyStyles.modalBody}>
          <div
            className={`flexRow justifyBetween ${historyStyles.modalItemRow}`}
          >
            <p className="text-muted">Transaction method</p>
            <p className="capitalize">{method.replace(/_/g, " ")}</p>
          </div>

          <div
            className={`flexRow justifyBetween ${historyStyles.modalItemRow}`}
          >
            <p className="text-muted">Status</p>
            <p className={"capitalize " + statusClass()}>{status}</p>
          </div>
          {/* <div className={`flexRow justifyBetween ${historyStyles.modalItemRow}`}>
            <p className="text-muted">From</p>
            <p>-</p>
          </div>

          <div className={`flexRow justifyBetween ${historyStyles.modalItemRow}`}>
            <p className="text-muted">Account name</p>
            <p>-</p>
          </div>

          <div className={`flexRow justifyBetween ${historyStyles.modalItemRow}`}>
            <p className="text-muted">Bank details</p>
            <div>
              <p className="mb-1">-</p>
              <p>-</p>
            </div>
          </div> */}

          <div
            className={`flexRow justifyBetween ${historyStyles.modalItemRow}`}
          >
            <p className="text-muted">Transaction ID</p>
            <div className="flexRow alignCenter gap-1">
              <p className="text-muted">{txnId}</p>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handleCopyClick(txnId)}
              >
                {isCopied ? <AiOutlineCheck color="green" /> : <LuCopy />}
              </div>
            </div>
          </div>
          {status?.toLowerCase() === "pending" && isCreditTxn ? (
            <div>
              <CustomButtonII
                text={"Checkout"}
                variant={"light"}
                className={"w100 mt35"}
                onClick={redirectToCheckout}
                centerText
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </Modal>
    </>
  );
};

export default TransactionHistory;
