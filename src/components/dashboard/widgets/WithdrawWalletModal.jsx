import React, { useEffect, useState } from "react";
import CurrancyInput from "../../../utils/CurrancyInput";
import CustomButtonII from "../../../utils/CustomButtonII";
import CustomRadio from "../../../utils/CustomRadio";
import Modal from "../../../utils/Modal";
import ThreeColumnRow from "../../../utils/ThreeColumnRow";
import http from "../../../utils/utils";
import BankIcon from "../../../assets/images/icons/bank.png";
import CardIcon from "../../../assets/images/icons/card.png";
import CryptoIcon from "../../../assets/images/icons/buy-crypto.png";
import { showError } from "../../../utils/Alert";

const WithdrawWalletModal = ({ isOpen, onClose }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [reqWithdrawalLoading, setReqWithdrawalLoading] = useState(false);
  const [requestWithdrawalStep, setRequestWithdrawalStep] = useState(1);
  const [withdrawalFormStates, setWithdrawalFormStates] = useState({
    currency: "usd",
    amount: "",
  });

  const [paymentMethods, setPaymentMethods] = useState();

  const toggleActive = (clickedMethod) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isActive: method === clickedMethod,
    }));

    setPaymentMethods(updatedMethods);
  };

  const fetchCurrencies = async () => {
    try {
      const res = await http.get(`wallets/supported-currencies`);
      const newArray = res.map(({ code }) => ({
        value: code,
        name: code.toUpperCase(),
      }));

      setSupportedCurrencies(newArray);
      // console.log("currencies", newArray);
    } catch (error) {
      console.log("fetch currency err", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const returnPayMethodIcon = (code) => {
    if (code === "bank_transfer") {
      return BankIcon;
    } else if (code === "credit_card") {
      return CardIcon;
    } else if (code === "crypto") {
      return CryptoIcon;
    }
  };

  const processFundWallet = async () => {
    if (requestWithdrawalStep === 1) {
      if (withdrawalFormStates.amount === "") {
        showError("Amount is required");
        return;
      }

      setReqWithdrawalLoading(true);
      try {
        const res = await http.get(`wallets/withdrawal-methods`);
        setReqWithdrawalLoading(false);

        const availableMethods = res
          .filter((method) =>
            method.currencies.includes(withdrawalFormStates.currency)
          )
          .map((method) => ({
            ...method,
            isActive: false,
            icon: returnPayMethodIcon(method.code),
          }));

        setPaymentMethods(availableMethods);
        setRequestWithdrawalStep(2);
        // console.log("withdrawal methods", selectedMethod);
        console.log("withdrawal methods", res);
      } catch (error) {
        setReqWithdrawalLoading(false);
        console.log("fetch method err", error);
      }
    } else if (requestWithdrawalStep === 2) {
      const activeMethod = paymentMethods.filter(
        (val) => val.isActive === true
      );
      if (!activeMethod.length) {
        showError("Select a payment method");
        return;
      }

      setRequestWithdrawalStep(3);

      // process withdrawal request
      //   onClose();
      //   setRequestWithdrawalStep(1);
      //   setWithdrawalFormStates({
      //     currency: "usd",
      //     amount: "",
      //   });
      //   alert("Withdraw request processing");
    }
  };

  const renderRequestComponent = () => {
    if (!reqWithdrawalLoading) {
      if (requestWithdrawalStep === 1) {
        return (
          <div className="inputContainer">
            <label className="text-start">
              How much would you like to withdraw?
            </label>
            <CurrancyInput
              amountValue={withdrawalFormStates.amount}
              onChangeAmount={(val) =>
                setWithdrawalFormStates({
                  ...withdrawalFormStates,
                  amount: val,
                })
              }
              currencyValue={withdrawalFormStates.currency}
              currencyItems={supportedCurrencies}
              onChangeCurrency={(val) =>
                setWithdrawalFormStates({
                  ...withdrawalFormStates,
                  currency: val,
                })
              }
            />
          </div>
        );
      } else if (requestWithdrawalStep === 2) {
        return (
          <>
            {paymentMethods.map((method, index) => (
              <ThreeColumnRow
                key={`meth-${index}`}
                onClick={() => toggleActive(method)}
                title={method.name}
                subtitle={method.description}
                icon={method.icon}
                col2Child={<CustomRadio isChecked={method.isActive} />}
              />
            ))}
          </>
        );
      }
    } else if (requestWithdrawalStep === 3) {
      return (
        <div className="inputContainer">
          <label>Select beneficiary</label>
        </div>
      );
    } else {
      return <span className={"loader loader-dark"}></span>;
    }
  };

  return (
    <>
      <Modal title={"Withdraw Wallet"} isOpen={isOpen} onClose={onClose}>
        <div>{renderRequestComponent()}</div>

        <div className="modalFooter">
          <div className="flexRow justifyEnd gap-1">
            <CustomButtonII
              text={"Back"}
              variant={"light"}
              disabled={requestWithdrawalStep === 1 ? true : false}
              onClick={() =>
                setRequestWithdrawalStep(
                  requestWithdrawalStep > 1 ? requestWithdrawalStep - 1 : 1
                )
              }
            />
            <CustomButtonII
              text={requestWithdrawalStep > 2 ? "Submit" : "Next"}
              variant={"primary"}
              onClick={processFundWallet}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WithdrawWalletModal;
