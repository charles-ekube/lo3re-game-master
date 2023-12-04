import React, { useRef, useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import BalanceCard from "../../components/dashboard/wallet/BalanceCard";
import IconButton from "../../components/dashboard/buttons/IconButton";
import { PiBank } from "react-icons/pi";
import { FiPlusCircle } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import TransactionHistory from "../../components/dashboard/wallet/TransactionHistory";
import BankCard from "../../components/dashboard/wallet/BankCard";
import Modal from "../../utils/Modal";
import WalletAdd from "../../assets/images/icons/wallet-add.png";
import "../../assets/styles/history.css";
import { LuCopy } from "react-icons/lu";
import { AiOutlineCheck } from "react-icons/ai";
import useCopyToClipBoard from "../../hooks/useCopyToClipboard";

const History = () => {
  const [showTxnModal, setShowTxnModal] = useState(false);
  const { handleCopyClick, isCopied } = useCopyToClipBoard();

  return (
    <>
      <section className="mainContainer walletContainer">
        <div className="walletContent">
          <div>
            <div className="flexRow justifyBetween">
              <h3>Transactions history</h3>
              <p className="flexRow alignCenter">
                View all <IoChevronForward fontSize={"20px"} />
              </p>
            </div>
            <div className="historyContent">
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={true}
                status={true}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={true}
                status={true}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={true}
                status={false}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={false}
                status={true}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={false}
                status={false}
              />
            </div>
          </div>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer"}>
          <div className="bankCardsContainer">
            <h3>Banks and Cards</h3>
            <div className="content mt-2">
              <BankCard name={"MasterCard"} />
              <BankCard name={"Sterling"} />
            </div>
            <button className="cardLinkBtn">Link a bank or card</button>
          </div>

          {/* customer corner */}
          <div className={"contactCornerContainer"}>
            <Text tag={"p"} className={"f16 satoshi-bold-text"}>
              Customer corner
            </Text>
            <ContactCard />
          </div>
        </aside>
      </section>

      <Modal isOpen={showTxnModal} onClose={() => setShowTxnModal(false)}>
        <h2 className="modal-amount satoshi-text">+$30.00</h2>
        <span className="f14 text-muted">Transaction successful</span>
        <div className="pill">
          <div className="pill-icon">
            <img src={WalletAdd} />
          </div>
          <p>Wallet Fund | Oct 20, 2023 11:06</p>
        </div>
        <div className="modal-body">
          <div className="flexRow justifyBetween modalItemRow">
            <p className="text-muted">Transaction type</p>
            <p>Bank transfer</p>
          </div>

          <div className="flexRow justifyBetween modalItemRow">
            <p className="text-muted">From</p>
            <p>Lo3re</p>
          </div>

          <div className="flexRow justifyBetween modalItemRow">
            <p className="text-muted">Account name</p>
            <p>Lo3re</p>
          </div>

          <div className="flexRow justifyBetween modalItemRow">
            <p className="text-muted">Bank details</p>
            <div>
              <p className="mb-1">000 000 000</p>
              <p>Sterling Bank</p>
            </div>
          </div>

          <div className="flexRow justifyBetween modalItemRow">
            <p className="text-muted">Transaction ID</p>
            <div className="flexRow alignCenter gap-1">
              <p className="text-muted">000 000 000 000</p>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handleCopyClick("000 000 000 000")}
              >
                {isCopied ? <AiOutlineCheck color="green" /> : <LuCopy />}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default History;
