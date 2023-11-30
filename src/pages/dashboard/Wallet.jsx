import React from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import BalanceCard from "../../components/dashboard/wallet/BalanceCard";
import IconButton from "../../components/dashboard/buttons/IconButton";
import { PiBank } from "react-icons/pi";
import { FiPlusCircle } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import TransactionHistory from "../../components/dashboard/wallet/TransactionHistory";
import BankCard from "../../components/dashboard/wallet/BankCard";

const Wallet = () => {
  return (
    <>
      <section className="walletContainer">
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
            <IconButton
              text={"Withdraw"}
              icon={<PiBank fontSize={"18px"} />}
              className="walletButton"
              disabled={true}
            />
            <IconButton
              text={"Fund wallet"}
              icon={<FiPlusCircle fontSize={"18px"} />}
              className="walletButton"
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
    </>
  );
};

export default Wallet;
