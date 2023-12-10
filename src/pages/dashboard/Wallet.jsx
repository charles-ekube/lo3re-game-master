import React, { useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import BalanceCard from "../../components/dashboard/wallet/BalanceCard";
import { PiBank } from "react-icons/pi";
import { FiPlusCircle } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import TransactionHistory from "../../components/dashboard/wallet/TransactionHistory";
import BankCard from "../../components/dashboard/wallet/BankCard";
import Modal from "../../utils/Modal";
import BankIcon from "../../assets/images/icons/bank.png";
import CardIcon from "../../assets/images/icons/card.png";
import CryptoIcon from "../../assets/images/icons/buy-crypto.png";
import ThreeColumnRow from "../../utils/ThreeColumnRow";
import CustomRadio from "../../utils/CustomRadio";
import CustomButtonII from "../../utils/CustomButtonII";

const Wallet = () => {
  const [fundWalletModal, setFundWalletModal] = useState(false);
  const [action, setAction] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([
    {
      name: "Bank Transfer",
      subtitle: "Transfer to your wallet account number",
      icon: BankIcon,
      isActive: false,
    },
    {
      name: "Debit/Credit Card",
      subtitle: "Fund with Naira cards",
      icon: CardIcon,
      isActive: false,
    },
    {
      name: "Crytocurrency",
      subtitle: "Fund with crypto coins",
      icon: CryptoIcon,
      isActive: false,
    },
  ]);

  const openModal = (action) => {
    setAction(action);
    setFundWalletModal(!fundWalletModal);
  };

  const toggleActive = (clickedMethod) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isActive: method === clickedMethod, // Set to true for the clicked profile, false for others
    }));

    setPaymentMethods(updatedMethods); // Update the state with the new array
  };

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
              onClick={() => openModal("withdraw")}
              disabled={false}
            />
            <CustomButtonII
              text={"Fund wallet"}
              variant={"primary"}
              icon={<FiPlusCircle fontSize={"18px"} />}
              onClick={() => openModal("fund wallet")}
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

      <Modal
        title={action}
        isOpen={fundWalletModal}
        onClose={() => setFundWalletModal(false)}
      >
        {paymentMethods.map((method) => {
          if (
            action.toLowerCase() === "withdraw" &&
            method.name.toLowerCase() === "debit/credit card"
          ) {
            return null;
          }
          return (
            <ThreeColumnRow
              onClick={() => toggleActive(method)}
              title={method.name}
              subtitle={method.subtitle}
              icon={method.icon}
              col2Child={<CustomRadio isChecked={method.isActive} />}
            />
          );
        })}
        <div className="modalFooter">
          <div className="flexRow justifyEnd gap-1">
            <CustomButtonII
              text={"Back"}
              variant={"light"}
              onClick={() => setFundWalletModal(false)}
            />
            <CustomButtonII text={"Accept"} variant={"primary"} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Wallet;
