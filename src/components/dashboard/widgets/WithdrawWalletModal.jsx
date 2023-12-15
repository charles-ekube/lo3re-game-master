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
import CustomCheckbox from "../../../utils/CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import {
  resetBankTransferBeneficiaryForm,
  resetCryptoBeneficiaryForm,
  setBankTransferBeneficiaryForm,
  setCryptoBeneficiaryForm,
} from "../../../redux/features/generalSlice";

const WithdrawWalletModal = ({ isOpen, onClose }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const dispatch = useDispatch();
  const beneficiaryForm = useSelector(
    (state) => state.general.bankTransferBeneficiaryForm
  );
  const cryptoBeneficiaryForm = useSelector(
    (state) => state.general.cryptoBeneficiaryForm
  );
  const [rate, setRate] = useState({
    rate: "1",
    symbol: "$",
  });
  const [formStep, setFormStep] = useState(1);
  const [withdrawalFormStates, setWithdrawalFormStates] = useState({
    currency: "",
    amount: "",
    amountToRecieve: 0,
  });
  const [finalFormState, setFinalFormState] = useState({
    currency: "",
    amount: 0,
    method: "",
    destination_id: "",
    destination: {},
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

  const closeModal = () => {
    setFormStep(1);
    onClose();
  };

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
    amountToRecieve = parseFloat(amountToRecieve.toFixed(2));
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
      if (formStep === 1) {
        setWithdrawalFormStates({ ...withdrawalFormStates, currency: "usd" });
      }
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

  const requestWithdrawal = () => {
    // process withdrawal request & reset form
    closeModal();
    setFormStep(1);
    setRate({
      rate: "1",
      symbol: "$",
    });
    setWithdrawalFormStates({
      currency: "usd",
      amount: "",
    });
    dispatch(resetBankTransferBeneficiaryForm());
    dispatch(resetCryptoBeneficiaryForm());
    setFinalFormState({
      currency: "",
      amount: 0,
      method: "",
      destination_id: "",
      destination: {},
    });
    alert("Withdraw request processing");
  };

  const processFundWallet = async () => {
    if (formStep === 1) {
      if (
        withdrawalFormStates.amount === "" ||
        withdrawalFormStates.currency === ""
      ) {
        showError("Amount and currency are required");
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
      const activeBen = beneficiaries.filter((val) => val.isActive === true);
      const activeMethod = paymentMethods.filter(
        (val) => val.isActive === true
      );

      if (!activeBen.length) {
        showError("Select a beneficiary");
        return;
      }

      setFinalFormState({
        ...finalFormState,
        currency: withdrawalFormStates.currency,
        amount: withdrawalFormStates.amountToRecieve,
        method: activeMethod[0]?.code,
        destination_id: activeBen[0]?.address,
      });

      requestWithdrawal();
    } else if (formStep === 4) {
      const activeMethod = paymentMethods.filter(
        (val) => val.isActive === true
      );

      if (activeMethod?.length && activeMethod[0]?.code === "bank_transfer") {
        if (withdrawalFormStates.currency === "ngn") {
          if (
            beneficiaryForm.account_number === "" ||
            beneficiaryForm.bank_code === ""
          ) {
            showError("Required fields are missing");
            return;
          }

          if (beneficiaryForm.account_name === "") {
            showError("Could not verify account number");
            return;
          }

          // TODO: if user checked saveForLater save beneficiary and use destination_id returned else pass detination obj
          // TODO: scratch all that👆🏽👆🏽, just pass saveBene & ask BE to perform above task on BE for better performance

          setFinalFormState({
            ...finalFormState,
            currency: withdrawalFormStates.currency,
            amount: withdrawalFormStates.amountToRecieve,
            method: activeMethod[0]?.code,
            destination: {
              account_number: beneficiaryForm.account_number,
              account_name: beneficiaryForm.account_name,
              bank_code: beneficiaryForm.bank_code,
              save_beneficiary: beneficiaryForm.saveForLater,
            },
          });

          requestWithdrawal();
        } else if (withdrawalFormStates.currency === "usd") {
          if (
            beneficiaryForm.routing_number === "" ||
            beneficiaryForm.sort_code === "" ||
            beneficiaryForm.account_number === "" ||
            beneficiaryForm.account_name === "" ||
            beneficiaryForm.account_type === ""
          ) {
            showError("Required fields are missing");
            return;
          }

          setFinalFormState({
            ...finalFormState,
            currency: withdrawalFormStates.currency,
            amount: withdrawalFormStates.amountToRecieve,
            method: activeMethod[0]?.code,
            destination: {
              account_number: beneficiaryForm.account_number,
              account_name: beneficiaryForm.account_name,
              recipient_name: beneficiaryForm.account_name,
              routing_number: beneficiaryForm.routing_number,
              sort_code: beneficiaryForm.sort_code,
              account_type: beneficiaryForm.account_type,
              save_beneficiary: beneficiaryForm.saveForLater,
            },
          });

          requestWithdrawal();
        } else {
          showError("Unknown currency");
        }
      } else if (activeMethod?.length && activeMethod[0]?.code === "crypto") {
        if (
          cryptoBeneficiaryForm.coin_id === "" ||
          cryptoBeneficiaryForm.network === "" ||
          cryptoBeneficiaryForm.address === ""
        ) {
          showError("Required fields are missing");
          return;
        }

        setFinalFormState({
          ...finalFormState,
          currency: withdrawalFormStates.currency,
          amount: withdrawalFormStates.amountToRecieve,
          method: activeMethod[0]?.code,
          destination: {
            coin_id: cryptoBeneficiaryForm.coin_id,
            address: cryptoBeneficiaryForm.address,
            tag_id: cryptoBeneficiaryForm.tag_id,
            save_beneficiary: cryptoBeneficiaryForm.saveForLater,
          },
        });

        requestWithdrawal();
      } else {
        showError("Unknown payment method");
        console.log("method is:", activeMethod);
      }
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
              onClick={() => setFormStep(4)}
            />
          </>
        );
      } else if (formStep === 4) {
        return (
          <AddBeneficiary
            currency={withdrawalFormStates.currency}
            payMethod={
              paymentMethods
                ? paymentMethods.filter((val) => val.isActive === true)[0]
                : ""
            }
          />
        );
      }
    } else {
      return <span className={"loader loader-dark"}></span>;
    }
  };

  return (
    <>
      <Modal title={"Withdraw Wallet"} isOpen={isOpen} onClose={closeModal}>
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

const AddBeneficiary = ({ currency, payMethod }) => {
  // const [formStep, setFormStep] = useState(1);
  const [requestLoading, setRequestLoading] = useState(false);
  const dispatch = useDispatch();
  const bankFormState = useSelector(
    (state) => state.general.bankTransferBeneficiaryForm
  );
  const cryptoFormState = useSelector(
    (state) => state.general.cryptoBeneficiaryForm
  );
  const accountTypeOptions = [
    { name: "Personal Account", value: "personal" },
    { name: "Business Account", value: "business" },
  ];

  const [showTagInput, setShowTagInput] = useState(false);
  const [supportedCryptos, setSupportedCryptos] = useState([]);
  const [cyrptoNetworks, setCryptoNetworks] = useState([]);

  const [supportedBanks] = useState([
    {
      name: "Access bank",
      value: "37sd89",
    },
    {
      name: "Access bank",
      value: "37sd89",
    },
    {
      name: "Access bank",
      value: "37sd89",
    },
  ]);

  const handleOnChange = (val, name) => {
    if (payMethod?.code === "bank_transfer") {
      dispatch(
        setBankTransferBeneficiaryForm({
          ...bankFormState,
          [name]: val,
        })
      );
    } else {
      dispatch(
        setCryptoBeneficiaryForm({
          ...cryptoFormState,
          [name]: val,
        })
      );
    }
  };

  const fetchBanks = async () => {
    setRequestLoading(true);
    try {
      // 👇🏽👇🏽 not return all banks
      const res = await http.get(`wallets/supported-banks`);

      // setBanks(res);
      console.log("banks", res);
      setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      setRequestLoading(false);
    }
  };

  const fetchCryptos = async () => {
    setRequestLoading(true);
    try {
      // 👇🏽👇🏽 not return all banks
      const res = await http.get(`wallets/supported-coins`);
      const newArray = res.map((crypto) => ({
        ...crypto,
        value: crypto.id,
        name: crypto.name.toUpperCase(),
        icon: crypto.logo_url,
      }));

      // setBanks(res);
      setSupportedCryptos(newArray);
      console.log("cryptos", res);
      setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      setRequestLoading(false);
    }
  };

  // fetch supported banks/cryptos
  useEffect(() => {
    if (payMethod?.code === "bank_transfer") {
      if (currency?.toLowerCase() === "ngn") {
        fetchBanks();
      }
    } else {
      fetchCryptos();
    }
  }, [currency, payMethod]);

  // validate acct
  useEffect(() => {
    if (currency === "ngn") {
      if (bankFormState.account_number.length === 10) {
        // TODO: validate acct
        handleOnChange("Tobe Fetched onValidateAcct", "account_name");
      } else {
        handleOnChange("", "account_name");
      }
    }
  }, [bankFormState.account_number, currency]);

  // add network
  useEffect(() => {
    const selectedCoin = supportedCryptos.filter(
      (val) => val.id === cryptoFormState.coin_id
    );
    if (selectedCoin.length) {
      const networkArr = selectedCoin[0].networks.map((val) => ({
        name: val,
        value: val,
      }));
      setCryptoNetworks(networkArr);
      console.log(networkArr);
    }
  }, [cryptoFormState.coin_id, supportedCryptos]);

  useEffect(() => {
    const selectedCoin = supportedCryptos.filter(
      (val) => val.id === cryptoFormState.coin_id
    );
    if (selectedCoin.length && selectedCoin[0].name === "RIPPLE") {
      setShowTagInput(true);
    } else {
      setShowTagInput(false);
    }
  }, [cryptoFormState.coin_id, supportedCryptos]);

  const renderElem = () => {
    if (!requestLoading) {
      if (payMethod?.code === "bank_transfer") {
        return (
          <>
            {currency === "ngn" ? (
              <div className="inputContainer">
                <label>Bank Name</label>
                <CustomDropdown
                  value={bankFormState.bank_code}
                  dropdownItems={supportedBanks}
                  itemOnClick={(val) => handleOnChange(val, "bank_code")}
                />
              </div>
            ) : (
              <div className="inputContainer">
                <label>Account Type</label>
                <CustomDropdown
                  value={bankFormState.account_type}
                  dropdownItems={accountTypeOptions}
                  itemOnClick={(val) => handleOnChange(val, "account_type")}
                />
              </div>
            )}
            <div className="inputContainer">
              <label>Account Number</label>
              <input
                type="number"
                className="formInput"
                value={bankFormState.account_number}
                onChange={(e) =>
                  handleOnChange(e.target.value, "account_number")
                }
              />
            </div>
            <div className="inputContainer">
              <label>
                {currency === "ngn" ? "Account Name" : "Receipient Name"}
              </label>
              <input
                type="text"
                className="formInput"
                value={bankFormState.account_name}
                onChange={(e) => handleOnChange(e.target.value, "account_name")}
                readOnly={currency === "ngn"}
              />
            </div>
            {currency === "usd" ? (
              <>
                <div className="inputContainer">
                  <label>Sort Code</label>
                  <input
                    type="text"
                    className="formInput"
                    value={bankFormState.sort_code}
                    onChange={(e) =>
                      handleOnChange(e.target.value, "sort_code")
                    }
                  />
                </div>
                <div className="inputContainer">
                  <label>Routing Number</label>
                  <input
                    type="number"
                    className="formInput"
                    value={bankFormState.routing_number}
                    onChange={(e) =>
                      handleOnChange(e.target.value, "routing_number")
                    }
                  />
                </div>
                <div className="inputContainer">
                  <label>Note</label>
                  <textarea
                    className="formInput"
                    value={bankFormState.description}
                    onChange={(e) => handleOnChange(e.target.value, "note")}
                    placeholder="Optional"
                    cols="30"
                    rows="3"
                  ></textarea>
                </div>
              </>
            ) : (
              ""
            )}
            <CustomCheckbox
              isChecked={bankFormState.saveForLater}
              label={"Save for future transactions"}
              name={"saveForLater"}
              onChange={(e) => handleOnChange(e.target.checked, e.target.name)}
            />
          </>
        );
      } else if (payMethod?.code === "crypto") {
        return (
          <>
            {/* fields: select crypto, select network, enter addr, opt tag_id */}
            <div className="inputContainer">
              <label>Select Coin</label>
              <CustomDropdown
                value={cryptoFormState.coin_id}
                dropdownItems={supportedCryptos}
                itemOnClick={(val) => handleOnChange(val, "coin_id")}
              />
            </div>
            <div className="inputContainer">
              <label>Select Network</label>
              <CustomDropdown
                value={cryptoFormState.network}
                dropdownItems={cyrptoNetworks}
                itemOnClick={(val) => handleOnChange(val, "network")}
              />
            </div>
            <div className="inputContainer">
              <label>Wallet address</label>
              <input
                type={"text"}
                className="formInput"
                value={cryptoFormState.address}
                onChange={(e) => handleOnChange(e.target.value, "address")}
              />
            </div>
            {showTagInput && (
              <div className="inputContainer">
                <label>Tag ID</label>
                <input
                  type={"text"}
                  className="formInput"
                  value={cryptoFormState.tag_id}
                  onChange={(e) => handleOnChange(e.target.value, "tag_id")}
                />
              </div>
            )}
            <CustomCheckbox
              isChecked={cryptoFormState.saveForLater}
              label={"Save for future transactions"}
              name={"saveForLater"}
              onChange={(e) => handleOnChange(e.target.checked, e.target.name)}
            />
          </>
        );
      }
    } else {
      return <span className={"loader loader-dark"}></span>;
    }
  };

  return <>{renderElem()}</>;
};



export default WithdrawWalletModal;
