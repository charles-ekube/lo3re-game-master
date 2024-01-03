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
import CustomDropdown from "../../../utils/CustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  resetBankTransferBeneficiaryForm,
  resetCryptoBeneficiaryForm,
} from "../../../redux/features/generalSlice";
import OtpInput from "../../../utils/CustomOtp";
import {
  useCheckWalletPinMutation,
  useFetchSupportedBanksQuery,
  useFetchSupportedCryptosQuery,
  useRequestWithdrawalMutation,
} from "../../../redux/services/walletApi";
import { useFetchProfileQuery } from "../../../redux/services/accountApi";
import AddBeneficiary from "./AddBeneficiary";

const WithdrawWalletModal = ({ isOpen, onClose }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const { data: supportedBanks } = useFetchSupportedBanksQuery();
  const { data: supportedCryptos } = useFetchSupportedCryptosQuery();
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
  const [showEmailCodeModal, setShowEmailCodeModal] = useState(false);
  const [showWalletPinModal, setShowWalletPinModal] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
  const [checkWalletPin, { isLoading: isCheckWalletPinLoading }] =
    useCheckWalletPinMutation();
  const [reqWithdraw, { isLoading: isReqWithdrawLoading }] =
    useRequestWithdrawalMutation();
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
    wallet_pin: "",
    code: "",
  });

  const { data: user } = useFetchProfileQuery();

  const isAuthApp2faActive = user?.user?.security["2fa"]
    ? user?.user?.security["2fa"]?.status === "verified"
    : false;
  const [paymentMethods, setPaymentMethods] = useState();
  const [beneficiaries, setBeneficiaries] = useState([]);

  const closeModal = () => {
    onClose();
    setFormStep(1);
    setShowEmailCodeModal(false);
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
      wallet_pin: "",
      code: "",
    });
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

  useEffect(() => {
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
          setWithdrawalFormStates((state) => ({ ...state, currency: "usd" }));
        }
        // console.log("currencies", newArray);
      } catch (error) {
        console.log("fetch currency err", error);
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

  const returnBankName = (bank_code) => {
    const bank = supportedBanks.filter((val) => val?.code === bank_code);
    if (bank.length) {
      return bank[0]?.name;
    }
    return null;
  };

  const returnCoin = (coin_id) => {
    const coin = supportedCryptos.filter((val) => val.id === coin_id);
    console.log("cid", coin_id);
    supportedCryptos.map((val) => console.log("vid", val.id));
    if (coin.length) {
      return coin[0];
    }

    return null;
  };

  const requestWithdrawal = async () => {
    if (finalFormState.code === "") {
      showError("Enter code");
      return;
    }

    await reqWithdraw(finalFormState)
      .unwrap()
      .then((resp) => {
        console.log(resp);
        showSuccess("Withdrawal request sent");

        closeModal();
      })
      .catch((err) => {
        console.log(err);
        showError(
          err?.message ||
            err?.data?.message ||
            "An error occurred, try again later"
        );
      });
  };

  const requestWalletPin = () => {
    setShowWalletPinModal(true);
  };

  const onWPinChange = (value) => {
    setFinalFormState({ ...finalFormState, wallet_pin: value });
  };

  const validateWalletPin = async () => {
    if (finalFormState.wallet_pin < 6) {
      showError("Provide wallet pin");
      return;
    }

    await checkWalletPin({ pin: finalFormState.wallet_pin })
      .unwrap()
      .then(async (resp) => {
        if (resp?.success) {
          if (isAuthApp2faActive) {
            setShowWalletPinModal(false);
            setShowEmailCodeModal(true);
          } else {
            setIsSendOtpLoading(true);
            const res = await http.get("/auth/mfa/email");
            setIsSendOtpLoading(false);
            if (res?.success) {
              setShowWalletPinModal(false);
              setShowEmailCodeModal(true);
              showSuccess("A code has been sent to your email");
            } else {
              showError(
                res?.message ||
                  res?.data?.message ||
                  "An error occurred, could not send email code"
              );
            }
          }
        } else {
          showError("check pin failed");
          console.log(resp);
        }
      })
      .catch((err) => {
        console.log(err);
        showError(err?.message || err?.data?.message || "An error occurred");
      });
  };

  const processFundWallet = async () => {
    if (formStep === 1) {
      if (withdrawalFormStates.amount === "") {
        showError("Amount is required");
        return;
      }

      if (withdrawalFormStates.currency === "") {
        showError("Currency is required");
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
      let url = "";
      if (activeMethod[0].code === "bank_transfer") {
        url = "wallets/withdrawals/bank-details";
      } else if (activeMethod[0].code === "crypto") {
        url = "wallets/withdrawals/crypto";
      }

      setRequestLoading(true);
      try {
        const res = await http.get(url);
        const newArray = res?.data?.map((val) => ({
          ...val,
          isActive: false,
          icon:
            activeMethod[0].code === "bank_transfer"
              ? BankIcon
              : returnCoin(val?.coin_id)?.logo_url,
        }));

        setBeneficiaries(newArray);
        setRequestLoading(false);
        console.log(res);
      } catch (error) {
        setRequestLoading(false);
        console.log(error);
      }
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
        destination_id: activeBen[0]?.id,
      });

      requestWalletPin();
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

          requestWalletPin();
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

          requestWalletPin();
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

        requestWalletPin();
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
            {!beneficiaries.length ? (
              <p className="text-muted mb-2">
                You have not added any beneficiaries yet
              </p>
            ) : (
              ""
            )}
            {beneficiaries.map((ben, index) => (
              <ThreeColumnRow
                key={`ben-${index}`}
                onClick={() => toggleBeneficiaryActive(ben)}
                title={ben?.title || ben?.account_name || ben?.address}
                subtitle={
                  <>
                    <small>
                      {returnBankName(ben?.bank_code) ||
                        ben?.network ||
                        "Account number"}
                      :
                    </small>{" "}
                    <b>{ben?.account_number || ben?.address}</b>
                  </>
                }
                icon={ben.icon}
                col2Child={<CustomRadio isChecked={ben.isActive} />}
              />
            ))}
            <CustomButtonII
              text={"New Beneficiary"}
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

      <Modal
        title={"Enter Wallet Pin"}
        isOpen={showWalletPinModal}
        onClose={() => setShowWalletPinModal(false)}
        zClass={"z600"}
        glassOverlay={true}
      >
        <div className="inputContainer">
          <label className="text-center text-muted">
            Enter Your 6-Digit wallet PIN
          </label>
          <OtpInput
            valueLength={6}
            value={finalFormState.wallet_pin}
            onChange={onWPinChange}
          />
        </div>
        <CustomButtonII
          text={"Confirm"}
          className={"w100"}
          onClick={validateWalletPin}
          centerText={true}
          loading={isCheckWalletPinLoading || isSendOtpLoading}
        />
      </Modal>

      <Modal
        title={"Enter Security Code"}
        isOpen={showEmailCodeModal}
        onClose={() => setShowEmailCodeModal(false)}
        zClass={"z600"}
        glassOverlay={true}
      >
        <div className="inputContainer">
          <label className="text-start text-muted">
            {isAuthApp2faActive
              ? "To confirm this request, please enter the security code from your Authenticator App"
              : "To confirm this request, please enter the security code we emailed to you"}
          </label>
          <input
            type="text"
            placeholder="Enter the code to verify"
            className="formInput"
            value={finalFormState.code}
            onChange={(e) =>
              setFinalFormState({ ...finalFormState, code: e.target.value })
            }
          />
        </div>
        <CustomButtonII
          text={"Confirm"}
          className={"w100"}
          onClick={requestWithdrawal}
          loading={isReqWithdrawLoading}
          centerText={true}
        />
      </Modal>
    </>
  );
};

export default WithdrawWalletModal;
