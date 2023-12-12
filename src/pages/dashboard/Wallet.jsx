import React, { useState } from "react";
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

const Wallet = () => {
  const [fundWalletModal, setFundWalletModal] = useState(false);
  const [withdrawWalletModal, setWithdrawWalletModal] = useState(false);

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
              subtitle={"Total gains 0%"}
            />
            <BalanceCard
              title={"Total Deposit"}
              figure={"0.00"}
              subtitle={"Total gains 0%"}
            />
            <BalanceCard
              title={"Total Withdrawal"}
              figure={"0.00"}
              subtitle={"Total gains 0%"}
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
              <TransactionHistory isCreditTxn={true} />
              <TransactionHistory isCreditTxn={true} />
              <TransactionHistory isCreditTxn={true} />
              <TransactionHistory isCreditTxn={false} />
              <TransactionHistory isCreditTxn={false} />
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
    </>
  );
};

export default Wallet;
