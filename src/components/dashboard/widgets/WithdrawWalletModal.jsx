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
import CustomDropdown from "../../../utils/CustomDropdown";

const WithdrawWalletModal = ({ isOpen, onClose }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [rate, setRate] = useState({
    rate: "1",
    symbol: "$",
  });
  const [formStep, setFormStep] = useState(1);
  const [withdrawalFormStates, setWithdrawalFormStates] = useState({
    currency: "usd",
    amount: "",
    amountToRecieve: 0,
  });

  const [paymentMethods, setPaymentMethods] = useState();
  const [beneficiaries, setBeneficiaries] = useState([
    {
      name: "John Doe",
      addressLabel: "Access Bank",
      address: "2343453243",
      icon: BankIcon,
      isActive: false,
    },
    {
      name: "Jane Doe",
      addressLabel: "Access Bank",
      address: "2343453243",
      icon: BankIcon,
      isActive: false,
    },
    {
      name: "James Doe",
      addressLabel: "Access Bank",
      address: "2343453243",
      icon: BankIcon,
      isActive: false,
    },
  ]);

  const toggleActive = (clickedMethod) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isActive: method === clickedMethod,
    }));

    setPaymentMethods(updatedMethods);
  };

  const toggleBeneficiaryActive = (clickedItem) => {
    const updatedItems = beneficiaries.map((item) => ({
      ...item,
      isActive: item === clickedItem,
    }));

    setBeneficiaries(updatedItems);
  };

  const handleAmountChange = (val) => {
    setWithdrawalFormStates({
      ...withdrawalFormStates,
      amount: val,
    });
  };

  const handleCurrencyChange = (val) => {
    setWithdrawalFormStates({ ...withdrawalFormStates, currency: val });

    let getRate = supportedCurrencies.filter((cur) => cur.code === val);
    setRate({
      rate: getRate.length ? getRate[0]?.rates[0]?.usd?.rate : 0,
      symbol: getRate[0].symbol,
    });
  };

  useEffect(() => {
    let amountToRecieve = withdrawalFormStates.amount * rate.rate;
    setWithdrawalFormStates((curState) => ({ ...curState, amountToRecieve }));
  }, [rate.rate, withdrawalFormStates.amount]);

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
      if (withdrawalFormStates.amount === "") {
        showError("Amount is required");
        return;
      }

      setRequestLoading(true);
      try {
        const res = await http.get(`wallets/withdrawal-methods`);
        setRequestLoading(false);

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
        setFormStep(2);
        // console.log("withdrawal methods", res);
      } catch (error) {
        setRequestLoading(false);
        showError(error[0]);
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

      // fetch beneficiaries
      // let url = "";
      // if (activeMethod[0].code === "bank_transfer") {
      //   url = "wallets/withdrawals/bank-details";
      // } else if (activeMethod[0].code === "crypto") {
      //   url = "wallets/withdrawals/crypto";
      // }

      // setRequestLoading(true);
      // try {
      //   const res = await http.get(url);
      //   setRequestLoading(false);

      //   console.log(res);
      // } catch (error) {
      //   setRequestLoading(false);
      //   console.log(error);
      // }
      setFormStep(3);
    } else if (formStep === 3) {
      // process withdrawal request & reset form
      // TODO: remeber to submit amountToReceived not amount
      onClose();
      setFormStep(1);
      setRate({
        rate: "1",
        symbol: "$",
      });
      setWithdrawalFormStates({
        currency: "usd",
        amount: "",
      });
      alert("Withdraw request processing");
    }
  };

  const renderRequestComponent = () => {
    if (!requestLoading) {
      if (formStep === 1) {
        return (
          <>
            <div className="inputContainer">
              <label className="text-start">Currency</label>
              <CustomDropdown
                value={withdrawalFormStates.currency}
                itemOnClick={handleCurrencyChange}
                dropdownItems={supportedCurrencies}
              />
            </div>

            <div className="inputContainer">
              <label className="text-start">
                How much would you like to withdraw?
              </label>
              <CurrancyInput
                amountValue={withdrawalFormStates.amount}
                onChangeAmount={(val) => handleAmountChange(val)}
                currencyValue={"usd"}
                currencyDisabled={true}
                currencyItems={[{ name: "USD", value: "usd" }]}
                onChangeCurrency={() => null}
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
                amountValue={withdrawalFormStates.amountToRecieve}
                onChangeAmount={() => null}
                currencyValue={withdrawalFormStates.currency}
                currencyItems={supportedCurrencies}
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
      } else if (formStep === 3) {
        return (
          <>
            <h4 className="text-start mb-2">Select beneficiary</h4>
            {beneficiaries.map((ben, index) => (
              <ThreeColumnRow
                key={`ben-${index}`}
                onClick={() => toggleBeneficiaryActive(ben)}
                title={ben.name}
                subtitle={
                  <>
                    <small>{ben.addressLabel}:</small> <b>{ben.address}</b>
                  </>
                }
                icon={ben.icon}
                col2Child={<CustomRadio isChecked={ben.isActive} />}
              />
            ))}
            <CustomButtonII
              text={"Add New Beneficiary"}
              variant={"light"}
              className={"w100 justifyCenter"}
              centerText={true}
            />
          </>
        );
      }
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
              disabled={formStep === 1 ? true : false}
              onClick={() => setFormStep(formStep > 1 ? formStep - 1 : 1)}
            />
            <CustomButtonII
              text={formStep > 2 ? "Submit" : "Next"}
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
