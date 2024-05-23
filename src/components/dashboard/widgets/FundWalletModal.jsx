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
import { showError, showSuccess } from "../../../utils/Alert";
import { handleFirebaseError } from "../../../utils/Helpers";
import { useRequestDepositMutation } from "../../../redux/services/walletApi";

const FundWalletModal = ({ isOpen, onClose }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [requestDeposit, { isLoading: isRequestDepositLoading }] =
    useRequestDepositMutation();
  const [rate, setRate] = useState({
    rate: "1",
    symbol: "$",
  });
  const [depositFormStates, setDepositFormStates] = useState({
    currency: "",
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

    if (val === "ngn") {
      let getRate = supportedCurrencies.filter((cur) => cur.code === "ngn");
      setRate({
        rate: getRate.length ? getRate[0]?.rates?.usd?.rate : 0,
        symbol: getRate.length ? getRate[0].symbol : "?",
      });
    } else if (val === "usd") {
      setRate({
        rate: 1,
        symbol: "$",
      });
    }
  };

  useEffect(() => {
    let amountToRecieve = depositFormStates.amount / rate.rate;
    amountToRecieve = parseFloat(amountToRecieve.toFixed(2));
    setDepositFormStates((curState) => ({ ...curState, amountToRecieve }));
  }, [rate.rate, depositFormStates.amount]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      if (formStep === 1) {
        try {
          const res = await http.get(`wallets/supported-currencies`);
          const newArray = res.map((cur) => ({
            ...cur,
            title: cur.name,
            value: cur.code,
            name: cur.code.toUpperCase(),
          }));

          setSupportedCurrencies(newArray);
          setDepositFormStates((state) => ({ ...state, currency: "usd" }));
          // console.log("currencies", newArray);
        } catch (error) {
          console.log("fetch currency err", error);
        }
      }
    };

    fetchCurrencies();
  }, [formStep]);

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
      if (
        depositFormStates.amount === "" ||
        depositFormStates.currency === ""
      ) {
        showError("Amount and currency are required");
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
      const payMethod = paymentMethods.filter((val) => val.isActive === true);
      const fData = {
        ...depositFormStates,
        method: payMethod[0]?.code,
      };
      await requestDeposit(fData)
        .unwrap()
        .then((resp) => {
          let checkoutUrl = "";
          if (depositFormStates.currency === "ngn") {
            checkoutUrl = resp?.meta?.data?.authorization_url;
          } else {
            if (payMethod[0]?.code === "credit_card") {
              checkoutUrl = resp?.meta?.url;
            } else if (payMethod[0]?.code === "crypto") {
              checkoutUrl = resp?.meta?.hosted_url;
            }
          }

          window.open(checkoutUrl, "_blank");
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
          showSuccess(
            "Request processing, you will be redirected to a checkout page"
          );
        })
        .catch((err) => {
          console.log(err);
          handleFirebaseError(err);
        });
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
              loading={isRequestDepositLoading}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FundWalletModal;
