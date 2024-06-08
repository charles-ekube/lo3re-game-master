import React, { useEffect, useState } from "react";
import { useFetchProfileQuery } from "../../../redux/services/accountApi";
import {
  useCheckWalletPinMutation,
  useRequestWithdrawalMutation,
} from "../../../redux/services/walletApi";
import { showError, showSuccess } from "../../../utils/Alert";
import CurrancyInput from "../../../utils/CurrancyInput";
import CustomButtonII from "../../../utils/CustomButtonII";
import CustomDropdown from "../../../utils/CustomDropdown";
import OtpInput from "../../../utils/CustomOtp";
import Modal from "../../../utils/Modal";
import http from "../../../utils/utils";

const payMethods = [
  {
    name: "Bank Transfer",
    value: "bank_transfer",
  },
  {
    name: "Crypto",
    value: "crypto",
  },
];

const QuickWithdraw = ({ isOpen, onClose, beneficiary }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [showWalletPinModal, setShowWalletPinModal] = useState(false);
  const [showEmailCodeModal, setShowEmailCodeModal] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
  const { data: user } = useFetchProfileQuery();
  const [reqWithdraw, { isLoading: isReqWithdrawLoading }] =
    useRequestWithdrawalMutation();
  const [checkWalletPin, { isLoading: isCheckWalletPinLoading }] =
    useCheckWalletPinMutation();
  const [formState, setFormState] = useState({
    currency: "",
    amount: "",
    amountToRecieve: 0,
    method: "",
    destination_id: "",
    title: "",
    wallet_pin: "",
    code: "",
  });
  const [rate, setRate] = useState({
    rate: "1",
    symbol: "$",
  });
  const handleAmountChange = (val) => {
    setFormState({
      ...formState,
      amount: val,
    });
  };

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      currency: beneficiary?.currency,
      method: beneficiary?.method,
      destination_id: beneficiary?.id,
      title: beneficiary?.title,
    }));
  }, [beneficiary]);

  // calc amtToRec
  useEffect(() => {
    let amountToRecieve = formState.amount * rate.rate;
    amountToRecieve = parseFloat(amountToRecieve.toFixed(2));
    setFormState((curState) => ({ ...curState, amountToRecieve }));
  }, [rate.rate, formState.amount]);

  // set rate
  useEffect(() => {
    if (formState.currency === "ngn") {
      let getRate = supportedCurrencies.filter((cur) => cur.code === "usd");
      setRate({
        rate: getRate.length ? getRate[0]?.rates?.usd?.rate : 0,
        symbol: getRate.length ? getRate[0].symbol : "?",
      });
    } else if (formState.currency === "usd") {
      setRate({
        rate: 1,
        symbol: "$",
      });
    }
  }, [formState.currency, supportedCurrencies]);

  // fetch currencies
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
      } catch (error) {
        console.log("fetch currency err", error);
      }
    };

    fetchCurrencies();
  }, []);

  const isAuthApp2faActive = user?.user?.security["2fa"]
    ? user?.user?.security["2fa"]?.status === "verified"
    : false;

  const closeModal = () => {
    setFormState({
      currency: "",
      amount: "",
      amountToRecieve: 0,
      method: "",
      destination_id: "",
      title: "",
      wallet_pin: "",
      code: "",
    });

    onClose();
  };

  const requestWalletPin = () => {
    if (formState.amount === "") {
      showError("Enter amount");
      return;
    }

    if (formState.destination_id === "") {
      showError("Sorry, could not validate beneficiary");
      return;
    }

    setShowWalletPinModal(true);
  };

  const onWPinChange = (value) => {
    setFormState({ ...formState, wallet_pin: value });
  };

  const validateWalletPin = async () => {
    if (formState.wallet_pin < 6) {
      showError("Provide wallet pin");
      return;
    }

    await checkWalletPin({ pin: formState.wallet_pin })
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
        setFormState({ ...formState, wallet_pin: "" });
      });
  };

  const requestWithdrawal = async () => {
    if (formState.code === "") {
      showError("Enter code");
      return;
    }

    await reqWithdraw(formState)
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} title={"Withdraw"}>
        <div className="inputContainer">
          <label className="text-start">Beneficiary</label>
          <input
            type="text"
            className="formInput"
            value={formState.title}
            disabled
          />
        </div>

        <div className="inputContainer">
          <label className="text-start">Method</label>
          <CustomDropdown
            value={formState.method}
            dropdownItems={payMethods}
            disabled={true}
          />
        </div>
        <div className="inputContainer">
          <label className="text-start">Currency</label>
          <CustomDropdown
            value={formState.currency}
            dropdownItems={supportedCurrencies}
            disabled={true}
          />
        </div>

        <div className="inputContainer">
          <label className="text-start">
            How much would you like to withdraw?
          </label>
          <CurrancyInput
            amountValue={formState.amount}
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
            amountValue={formState.amountToRecieve}
            onChangeAmount={() => null}
            currencyValue={formState.currency}
            currencyItems={supportedCurrencies}
            onChangeCurrency={() => null}
            currencyDisabled={true}
            disabled
          />
        </div>

        <div className="modalFooter">
          <CustomButtonII
            text={"Submit"}
            className={"w100"}
            centerText={true}
            variant={"primary"}
            onClick={requestWalletPin}
          />
        </div>
      </Modal>

      {/* security modals */}
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
            value={formState.wallet_pin}
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
            value={formState.code}
            onChange={(e) =>
              setFormState({ ...formState, code: e.target.value })
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

export default QuickWithdraw;
