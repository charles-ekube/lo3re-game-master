import React, { useEffect } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import TransactionHistory from "../../components/dashboard/wallet/TransactionHistory";
import BankCard from "../../components/dashboard/wallet/BankCard";
import "../../assets/styles/history.css";
import { useFetchTransactionsQuery } from "../../redux/services/walletApi";
import Loader from "../../utils/Loader";
import { showError } from "../../utils/Alert";

const History = () => {
  const {
    data: transactionHistory,
    isLoading: isTransactionHistoryLoading,
    error: transactionHistoryError,
  } = useFetchTransactionsQuery();

  useEffect(() => {
    if (transactionHistoryError) {
      console.log(transactionHistoryError);
      showError(
        transactionHistoryError?.message ||
          transactionHistoryError?.data?.message ||
          "An error occurred, could not fetch transaction history"
      );
    }
  }, [transactionHistoryError]);

  return (
    <>
      <section className="mainContainer walletContainer">
        <div className="walletContent">
          <div>
            <div className="flexRow justifyBetween">
              <h3>Transactions history</h3>
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
            </div>
          </div>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer"}>
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

export default History;
