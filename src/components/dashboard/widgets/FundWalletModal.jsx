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
  const [requestLoading, setRequestLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [rate, setRate] = useState({
    rate: "1",
    symbol: "$",
  });
  const [depositFormStates, setDepositFormStates] = useState({
    currency: "usd",
    amount: "",
    amountToRecieve: 0,
  });

  const [paymentMethods, setPaymentMethods] = useState();

  const toggleActive = (clickedMethod) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isActive: method === clickedMethod,
    }));

    setPaymentMethods(updatedMethods);
  };

  const handleCurrencyChange = (val) => {
    setDepositFormStates({ ...depositFormStates, currency: val });

    let getRate = supportedCurrencies.filter((cur) => cur.code === val);
    setRate({
      rate: getRate.length ? getRate[0]?.rates[0]?.usd?.rate : 0,
      symbol: getRate.length ? getRate[0].symbol : "?",
    });
  };

  useEffect(() => {
    let amountToRecieve = depositFormStates.amount / rate.rate;
    amountToRecieve = parseFloat(amountToRecieve.toFixed(2));
    setDepositFormStates((curState) => ({ ...curState, amountToRecieve }));
  }, [rate.rate, depositFormStates.amount]);

  const fetchCurrencies = async () => {
    try {
      const res = await http.get(`wallets/supported-currencies`);
      const newArray = res.map((cur) => ({
        ...cur,
        title: cur.name,
        value: cur.code,
        name: cur.code.toUpperCase(),
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
    if (formStep === 1) {
      if (depositFormStates.amount === "") {
        showError("Amount is required");
        return;
      }

      setRequestLoading(true);
      try {
        const res = await http.get(`wallets/deposit-methods`);
        setRequestLoading(false);

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
        setFormStep(2);
        // console.log("deposit methods", selectedMethod);
      } catch (error) {
        setRequestLoading(false);
        console.log("fetch method err", error);
      }
    } else if (formStep === 2) {
      const activeMethod = paymentMethods.filter(
        (val) => val.isActive === true
      );
      if (!activeMethod.length) {
        showError("Select a payment method");
        return;
      }

      // process deposit request
      // const payMethod = paymentMethods.filter((val) => val.isActive === true);
      // setRequestLoading(true);
      // try {
      //   const fData = {
      //     ...depositFormStates,
      //     method: payMethod[0]?.code,
      //   };
      //   const res = await http.post("wallets/deposits", fData);
      //   setRequestLoading(false);
      //   console.log(res);
      // } catch (error) {
      //   console.log(error);
      //   setRequestLoading(false);
      //   showError("An error occurred, try again later");
      // }

      onClose();
      setFormStep(1);
      setRate({
        rate: "1",
        symbol: "$",
      });
      setDepositFormStates({
        currency: "usd",
        amount: "",
      });
      alert("Deposit request processing");
    }
  };

  const renderRequestComponent = () => {
    if (!requestLoading) {
      if (formStep === 1) {
        return (
          <>
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
                onChangeCurrency={(val) => handleCurrencyChange(val)}
              />
              <div className="flexRow">
                <small className="text-start">
                  Rates: <b>$1 = {rate.symbol + rate.rate}</b>
                </small>
              </div>
            </div>

            <div className="inputContainer">
              <label className="text-start">Amount to receive</label>
              <CurrancyInput
                amountValue={depositFormStates.amountToRecieve}
                onChangeAmount={() => null}
                currencyValue={"usd"}
                currencyItems={[{ name: "USD", value: "usd" }]}
                onChangeCurrency={() => null}
                currencyDisabled={true}
                readOnly
              />
            </div>
          </>
        );
      } else if (formStep === 2) {
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
              disabled={formStep === 1 ? true : false}
              onClick={() => setFormStep(formStep > 1 ? formStep - 1 : 1)}
            />
            <CustomButtonII
              text={formStep > 1 ? "Submit" : "Next"}
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
