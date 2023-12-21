import React, { useEffect, useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import BalanceCard from "../../components/dashboard/wallet/BalanceCard";
import { PiBank } from "react-icons/pi";
import { FiPlusCircle } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import TransactionHistory from "../../components/dashboard/wallet/TransactionHistory";
import BankCard from "../../components/dashboard/wallet/BankCard";
import CustomButtonII from "../../utils/CustomButtonII";
import FundWalletModal from "../../components/dashboard/widgets/FundWalletModal";
import WithdrawWalletModal from "../../components/dashboard/widgets/WithdrawWalletModal";
import Modal from "../../utils/Modal";
import WalletAdd from "../../assets/images/icons/wallet-add.png";
import useCopyToClipBoard from "../../hooks/useCopyToClipboard";
import { LuCopy } from "react-icons/lu";
import { AiOutlineCheck } from "react-icons/ai";
// import http from "../../utils/utils";
// import { useFetchWalletQuery } from "../../redux/services/accountApi";

const Wallet = () => {
  const [fundWalletModal, setFundWalletModal] = useState(false);
  const [withdrawWalletModal, setWithdrawWalletModal] = useState(false);
  const [showTxnModal, setShowTxnModal] = useState(false);
  const { handleCopyClick, isCopied } = useCopyToClipBoard();
  // const { data: wallet, error } = useFetchWalletQuery();
  // console.log(wallet);
  // console.log(error);

  // const fetchWallet = async () => {
  //   const res = await http.get("wallets");
  //   console.log(res);
  // };

  // useEffect(() => {
  //   fetchWallet();
  // }, []);

  return (
    <>
      <section className="mainContainer walletContainer">
        <div className="walletContent">
          <div className="cardContainer">
            <BalanceCard
              title={"Wallet Balance"}
              figure={"0.00"}
              subtitle={"Total gains 0%"}
            />
            <BalanceCard
              title={"Locked Balance"}
              figure={"0.00"}
              subtitle={"To be credited on 20/10/23"}
            />
            <BalanceCard
              title={"Total Deposit"}
              figure={"0.00"}
              subtitle={"Updated 36mins ago"}
            />
            <BalanceCard
              title={"Total Withdrawal"}
              figure={"0.00"}
              subtitle={"Updated 36mins ago"}
            />
          </div>
          <div className="flexRow justifyCenter gap-1">
            <CustomButtonII
              text={"Withdraw"}
              variant={"light"}
              icon={<PiBank fontSize={"18px"} />}
              onClick={() => setWithdrawWalletModal(true)}
              disabled={false}
            />
            <CustomButtonII
              text={"Fund wallet"}
              variant={"primary"}
              icon={<FiPlusCircle fontSize={"18px"} />}
              onClick={() => setFundWalletModal(true)}
            />
          </div>
          <div className="historyContainer">
            <div className="flexRow justifyBetween">
              <h3>Recent Transactions</h3>
              <p className="flexRow alignCenter">
                View all <IoChevronForward fontSize={"20px"} />
              </p>
            </div>
            <div className="historyContent">
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={true}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={true}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={true}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={false}
              />
              <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={false}
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

      <FundWalletModal
        isOpen={fundWalletModal}
        onClose={() => setFundWalletModal(false)}
      />
      <WithdrawWalletModal
        isOpen={withdrawWalletModal}
        onClose={() => setWithdrawWalletModal(false)}
      />

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

export default Wallet;
