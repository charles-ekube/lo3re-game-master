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

const FundWalletModal = ({ isOpen, onClose }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [reqDepositLoading, setReqDepositLoading] = useState(false);
  const [requestDepositStep, setRequestDepositStep] = useState(1);
  const [depositFormStates, setDepositFormStates] = useState({
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
    if (requestDepositStep === 1) {
      if (depositFormStates.amount === "") {
        showError("Amount is required");
        return;
      }

      setReqDepositLoading(true);
      try {
        const res = await http.get(`wallets/deposit-methods`);
        setReqDepositLoading(false);

        const availableMethods = res
          .filter((method) =>
            method.currencies.includes(depositFormStates.currency)
          )
          .map((method) => ({
            ...method,
            isActive: false,
            icon: returnPayMethodIcon(method.code),
          }));

        setPaymentMethods(availableMethods);
        setRequestDepositStep(2);
        // console.log("deposit methods", selectedMethod);
        console.log("deposit methods", res);
      } catch (error) {
        setReqDepositLoading(false);
        console.log("fetch method err", error);
      }
    } else if (requestDepositStep === 2) {
      const activeMethod = paymentMethods.filter(
        (val) => val.isActive === true
      );
      if (!activeMethod.length) {
        showError("Select a payment method");
        return;
      }

      // process deposit request
      onClose();
      setRequestDepositStep(1);
      setDepositFormStates({
        currency: "usd",
        amount: "",
      });
      alert("Deposit request processing");
    }
  };

  const renderRequestComponent = () => {
    if (!reqDepositLoading) {
      if (requestDepositStep === 1) {
        return (
          <div className="inputContainer">
            <label className="text-start">
              How much would you like to deposit?
            </label>
            <CurrancyInput
              amountValue={depositFormStates.amount}
              onChangeAmount={(val) =>
                setDepositFormStates({ ...depositFormStates, amount: val })
              }
              currencyValue={depositFormStates.currency}
              currencyItems={supportedCurrencies}
              onChangeCurrency={(val) =>
                setDepositFormStates({ ...depositFormStates, currency: val })
              }
            />
          </div>
        );
      } else if (requestDepositStep === 2) {
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
    } else {
      return <span className={"loader loader-dark"}></span>;
    }
  };

  return (
    <>
      <Modal title={"Fund Wallet"} isOpen={isOpen} onClose={onClose}>
        <div>{renderRequestComponent()}</div>

        <div className="modalFooter">
          <div className="flexRow justifyEnd gap-1">
            <CustomButtonII
              text={"Back"}
              variant={"light"}
              disabled={requestDepositStep === 1 ? true : false}
              onClick={() =>
                setRequestDepositStep(
                  requestDepositStep > 1 ? requestDepositStep - 1 : 1
                )
              }
            />
            <CustomButtonII
              text={requestDepositStep > 1 ? "Submit" : "Next"}
              variant={"primary"}
              onClick={processFundWallet}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FundWalletModal;
