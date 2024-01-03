import React, { useEffect, useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import TransactionHistory from "../../components/dashboard/wallet/TransactionHistory";
import "../../assets/styles/history.css";
import { useFetchTransactionsQuery } from "../../redux/services/walletApi";
import Loader from "../../utils/Loader";
import { showError } from "../../utils/Alert";
import Pagination from "../../utils/Pagination";

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: transactionHistory,
    isFetching: isTransactionHistoryLoading,
    error: transactionHistoryError,
  } = useFetchTransactionsQuery(`page=${currentPage}`);

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
              {!transactionHistory?.data?.length &&
              !isTransactionHistoryLoading ? (
                <p className="text-muted text-center mt40">
                  You have not performed any transactions yet.
                </p>
              ) : (
                ""
              )}
              {!isTransactionHistoryLoading &&
                transactionHistory?.data?.map((value) => {
                  let checkoutUrl = "";

                  if (value?.currency === "ngn") {
                    checkoutUrl = value?.meta?.data?.authorization_url;
                  } else {
                    if (value?.method === "credit_card") {
                      checkoutUrl = value?.meta?.url;
                    } else if (value?.method === "crypto") {
                      checkoutUrl = value?.meta?.hosted_url;
                    }
                  }
                  return (
                    <TransactionHistory
                      key={"tnx-" + value?.id}
                      txnId={value?.id}
                      type={value?.type}
                      amount={value?.amount}
                      currency={value?.currency}
                      date={value?.createdAt?._seconds}
                      status={value?.status}
                      method={value?.method}
                      checkoutUrl={checkoutUrl}
                    />
                  );
                })}
              <Loader
                isLoading={isTransactionHistoryLoading}
                variety="dark"
                height="50px"
              />
              <Pagination
                limit={transactionHistory?.limit}
                curPage={transactionHistory?.page}
                totalItems={transactionHistory?.total}
                paginate={(num) => setCurrentPage(num)}
              />
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
