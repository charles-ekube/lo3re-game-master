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
import {
  useFetchTransactionsQuery,
  useFetchWalletBalanceQuery,
} from "../../redux/services/walletApi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../utils/Loader";
import { showError } from "../../utils/Alert";
import { useFetchProfileQuery } from "../../redux/services/accountApi";
import Modal from "../../utils/Modal";
import Shield from "../../assets/images/shield-keyhole-fill.svg";
import {
  useFetchBankBeneficiariesQuery,
  useFetchCryptoBeneficiariesQuery,
} from "../../redux/services/beneficiariesApi";
import QuickWithdraw from "../../components/dashboard/widgets/QuickWithdraw";

const Wallet = () => {
  const navigate = useNavigate();
  const [fundWalletModal, setFundWalletModal] = useState(false);
  const [no2FAModal, setNo2FAModal] = useState(false);
  const [isQuickWithdrawModalOpen, setQuickWithdrawModal] = useState(false);
  const [quickWithdrawForm, setQuickWithdrawForm] = useState({
    id: "",
    title: "",
    method: "",
    currency: "",
  });
  const [withdrawWalletModal, setWithdrawWalletModal] = useState(false);
  const { data: transactionHistory, isLoading: isTransactionHistoryLoading } =
    useFetchTransactionsQuery("limit=5");
  const {
    data: walletBalance,
    isLoading: isWalletBalanceLoading,
    error: walletBalanceError,
  } = useFetchWalletBalanceQuery();
  const { data: user } = useFetchProfileQuery();

  const { data: bankBeneficiaries, isLoading: isBankBeneLoading } =
    useFetchBankBeneficiariesQuery();
  const { data: cryptoBeneficiaries, isLoading: isCryptoBeneLoading } =
    useFetchCryptoBeneficiariesQuery();
  const [tabs, setTabs] = useState([
    {
      name: "Bank Transfers",
      isActive: true,
    },
    {
      name: "Crypto",
      isActive: false,
    },
  ]);

  const toggleTabs = (clickedItem) => {
    const updatedTabs = tabs.map((item) => ({
      ...item,
      isActive: item === clickedItem,
    }));

    setTabs(updatedTabs);
  };

  const isEmail2faActive = user?.user?.security?.email;
  const isAuthApp2faActive = user?.user?.security["2fa"]
    ? user?.user?.security["2fa"]?.status === "verified"
    : false;

  const openWithdrawModal = () => {
    if (isEmail2faActive || isAuthApp2faActive) {
      setWithdrawWalletModal(true);
    } else {
      setNo2FAModal(true);
    }
  };
  // console.log(error);

  useEffect(() => {
    if (walletBalanceError) {
      console.log(walletBalanceError);
      showError(
        walletBalanceError?.message ||
          walletBalanceError?.data?.message ||
          "An error occurred, could not fetch wallet balance"
      );
    }
  }, [walletBalanceError]);

  const toBeneficiaries = () => {
    navigate("/dashboard/settings/beneficiaries");
  };

  const returnActiveTab = () => {
    const activeTab = tabs.filter((tab) => tab.isActive);
    return activeTab[0];
  };

  const openQuickWithdrawModal = (beneficiary) => {
    if (isEmail2faActive || isAuthApp2faActive) {
      setQuickWithdrawForm({
        ...quickWithdrawForm,
        id: beneficiary?.id,
        title: beneficiary?.title || beneficiary?.account_name,
        method: beneficiary?.coin_id ? "crypto" : "bank_transfer",
        currency: beneficiary?.currency || "usd",
      });

      setQuickWithdrawModal(true);
    } else {
      setNo2FAModal(true);
    }
  };

  const closeQuickWithdrawModal = () => {
    setQuickWithdrawForm({
      ...quickWithdrawForm,
      id: "",
      title: "",
      method: "",
      currency: "",
    });

    setQuickWithdrawModal(false);
  };

  const renderBeneElem = () => {
    if (returnActiveTab()?.name === "Crypto") {
      return (
        <>
          {!cryptoBeneficiaries?.length && !isCryptoBeneLoading ? (
            <p className="text-muted text-center mt40">
              You have not added any crypto beneficiaries yet.
            </p>
          ) : (
            ""
          )}
          {cryptoBeneficiaries?.map((value, index) => {
            if (index > 1) {
              return null;
            }

            return (
              <BankCard
                key={"benn-" + index}
                beneficiary={value}
                onClick={() => openQuickWithdrawModal(value)}
                type={"crypto"}
              />
            );
          })}
        </>
      );
    } else {
      return (
        <>
          {!bankBeneficiaries?.length && !isBankBeneLoading ? (
            <p className="text-muted text-center mt40">
              You have not added any bank transfer beneficiaries yet.
            </p>
          ) : (
            ""
          )}
          {bankBeneficiaries?.map((value, index) => {
            if (index > 1) {
              return null;
            }

            return (
              <BankCard
                key={"benn-" + index}
                beneficiary={value}
                onClick={() => openQuickWithdrawModal(value)}
                type={"bank"}
              />
            );
          })}
        </>
      );
    }
  };

  return (
    <>
      <section className="mainContainer walletContainer">
        <div className="walletContent">
          <div className="cardContainer">
            <BalanceCard
              title={"Wallet Balance"}
              figure={"$" + walletBalance?.balance}
              isBalanceLoading={isWalletBalanceLoading}
              subtitle={"Total gains 0%"}
            />
            <BalanceCard
              title={"Locked Balance"}
              figure={"$" + walletBalance?.locked_balance}
              isBalanceLoading={isWalletBalanceLoading}
              subtitle={"To be credited on 20/10/23"}
            />
            <BalanceCard
              title={"Total Deposit"}
              figure={"$0.00"}
              subtitle={"Updated 36mins ago"}
            />
            <BalanceCard
              title={"Total Withdrawal"}
              figure={"$0.00"}
              subtitle={"Updated 36mins ago"}
            />
          </div>
          <div className="flexRow justifyCenter gap-1">
            <CustomButtonII
              text={"Withdraw"}
              variant={"light"}
              icon={<PiBank fontSize={"18px"} />}
              onClick={openWithdrawModal}
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
              <Link to={"/dashboard/history"} className="blackText">
                <p className="flexRow alignCenter">
                  View all <IoChevronForward fontSize={"20px"} />
                </p>
              </Link>
            </div>
            <div className="historyContent">
              <Loader
                isLoading={isTransactionHistoryLoading}
                variety="dark"
                height="100px"
              />
              {!transactionHistory?.data?.length &&
              !isTransactionHistoryLoading ? (
                <p className="text-muted text-center mt40">
                  You have not performed any transactions yet.
                </p>
              ) : (
                ""
              )}
              {transactionHistory?.data?.map((value) => (
                <TransactionHistory
                  key={"tnx-" + value?.id}
                  txnId={value?.id}
                  type={value?.type}
                  amount={value?.amount}
                  currency={value?.currency}
                  date={value?.createdAt?._seconds}
                  status={value?.status}
                  method={value?.method}
                />
              ))}
              {/* <TransactionHistory
                onTxnOpen={() => setShowTxnModal(true)}
                isCreditTxn={false}
              /> */}
            </div>
          </div>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer"}>
          <div className="bankCardsContainer">
            <h3>Recent Beneficiaries</h3>
            {/* tab switch */}
            <div className="tabContainer">
              <div className="switchTabs twoCols tab100 bgWhite mt-1">
                {tabs.map((tab, index) => (
                  <button
                    key={"tab-" + index}
                    className={`capitalize switchBtn ${
                      tab.isActive ? "active" : ""
                    }`}
                    onClick={() => toggleTabs(tab)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="content">
              <Loader
                isLoading={isBankBeneLoading || isCryptoBeneLoading}
                height={"100px"}
                variety={"dark"}
              />
              {renderBeneElem()}
            </div>
            <button className="cardLinkBtn" onClick={toBeneficiaries}>
              Manage beneficiaries
            </button>
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

      <QuickWithdraw
        isOpen={isQuickWithdrawModalOpen}
        onClose={closeQuickWithdrawModal}
        beneficiary={quickWithdrawForm}
      />

      <Modal isOpen={no2FAModal} onClose={() => setNo2FAModal(false)}>
        <div className="flexRow justifyCenter">
          <img
            src={Shield}
            className="deleteIllustration"
            style={{ height: "180px" }}
            alt=""
          />
        </div>
        <h3 className="deleteTitle">Two-Factor Authentication not enabled</h3>
        <p className="deleteSubtitle">
          Enable Two-Factor Authentication to withdraw
        </p>
        <CustomButtonII
          variant="light"
          text={"Enable 2FA"}
          className={"w100 mt40"}
          centerText={true}
          onClick={() => navigate("/dashboard/settings/2fa")}
        />
      </Modal>
    </>
  );
};

export default Wallet;
