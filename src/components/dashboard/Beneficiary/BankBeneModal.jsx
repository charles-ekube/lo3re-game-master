import React, { useEffect, useState } from "react";
import {
  useAddBankBeneficiaryMutation,
  useUpdateBankBeneficiaryMutation,
  useValidateAccountDetailMutation,
} from "../../../redux/services/beneficiariesApi";
import CustomButtonII from "../../../utils/CustomButtonII";
import Modal from "../../../utils/Modal";
import OtpInput from "../../../utils/CustomOtp";
import CustomDropdown from "../../../utils/CustomDropdown";
import http from "../../../utils/utils";
import { showError, showSuccess } from "../../../utils/Alert";

const accountTypeOptions = [
  { name: "Personal Account", value: "personal" },
  { name: "Business Account", value: "business" },
];

const BankBeneModal = ({ isOpen, onClose, beneficiaryToUpdate = null }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [supportedBanks, setSupportedBanks] = useState([]);
  const [updateBankBeneficiary, { isLoading: isUpdateBankBenLoading }] =
    useUpdateBankBeneficiaryMutation();
  const [addBankBeneficiary, { isLoading: isAddBankBeneficiaryLoading }] =
    useAddBankBeneficiaryMutation();
  const [validateAcctDetail, { isLoading: isValidateAcctLoading }] =
    useValidateAccountDetailMutation();

  const [showWalletPinModal, setShowWalletPinModal] = useState(false);
  const [finalFormState, setFinalFormState] = useState({});
  const [formState, setFormState] = useState({
    title: "",
    currency: "",
    bank_name: "",
    bank_code: "",
    account_name: "",
    account_number: "",
    account_type: "",
    sort_code: "",
    routing_number: "",
    description: "",
    wallet_pin: "",
  });

  useEffect(() => {
    if (beneficiaryToUpdate) {
      if (beneficiaryToUpdate?.currency === "ngn") {
        setFormState((prevState) => ({
          ...prevState,
          currency: beneficiaryToUpdate?.currency || "ngn",
          title: beneficiaryToUpdate?.title,
          bank_name: beneficiaryToUpdate?.bank_name,
          bank_code: beneficiaryToUpdate?.bank_code,
          account_name: beneficiaryToUpdate?.account_name,
          account_number: beneficiaryToUpdate?.account_number,
          description: beneficiaryToUpdate?.description,
        }));
      } else {
        setFormState((prevState) => ({
          ...prevState,
          currency: beneficiaryToUpdate?.currency || "usd",
          title: beneficiaryToUpdate?.title || "",
          bank_name: beneficiaryToUpdate?.bank_name || "",
          bank_code: beneficiaryToUpdate?.bank_code || "",
          account_name: beneficiaryToUpdate?.account_name || "",
          account_number: beneficiaryToUpdate?.account_number || "",
          account_type: beneficiaryToUpdate?.account_type || "",
          sort_code: beneficiaryToUpdate?.sort_code || "",
          routing_number: beneficiaryToUpdate?.routing_number || "",
          description: beneficiaryToUpdate?.description || "",
        }));
      }
    } else {
      setFormState((prevState) => ({
        ...prevState,
        title: "",
        currency: "usd",
        bank_name: "",
        bank_code: "",
        account_name: "",
        account_number: "",
        account_type: "",
        sort_code: "",
        routing_number: "",
        description: "",
      }));
    }
  }, [beneficiaryToUpdate]);

  const onWPinChange = (value) => {
    setFormState({ ...formState, wallet_pin: value });
  };

  const fetchBanks = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-banks`);
      const newArray = res?.data.map((cur) => ({
        ...cur,
        value: cur.code,
      }));

      setSupportedBanks(newArray);
      // console.log("banks", res);
      //   setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      //   setRequestLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
    //   fetchCryptos();
  }, []);

  // validate acct
  useEffect(() => {
    if (formState.currency === "ngn") {
      if (formState.account_number.length === 10 && formState.bank_code) {
        validateAcctDetail({
          account_number: formState.account_number,
          bank_code: formState.bank_code,
        })
          .unwrap()
          .then((resp) => {
            if (resp?.data?.status) {
              const acName = resp?.data?.data?.account_name;
              if (acName) {
                setFormState((prevState) => ({
                  ...prevState,
                  account_name: acName,
                }));
              }
            } else {
              console.log("acct validation err", resp);
              showError("Could not validate account details");
            }
          })
          .catch((err) => {
            showError("Could not validate account details");
            console.log(err);
            setFormState((prevState) => ({ ...prevState, account_name: "" }));
          });
      }
    }
  }, [
    formState.currency,
    formState.account_number,
    formState.bank_code,
    validateAcctDetail,
  ]);

  const handleOnChange = (val, name) => {
    setFormState({ ...formState, [name]: val });
  };

  const handleCurrencyChange = (val) => {
    setFormState({ ...formState, currency: val });
  };

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
        // setFormState((state) => ({ ...state, currency: "usd" }));
        // console.log("currencies", newArray);
      } catch (error) {
        console.log("fetch currency err", error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleSubmit = async () => {
    const { wallet_pin } = formState;
    if (wallet_pin.length < 6 && !beneficiaryToUpdate) {
      showError("Please enter wallet pin");
      return;
    }

    if (beneficiaryToUpdate) {
      await updateBankBeneficiary({
        id: beneficiaryToUpdate?.id,
        data: finalFormState,
      })
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary updated");
          setFormState({
            ...formState,
            title: "",
            currency: "",
            bank_name: "",
            bank_code: "",
            account_name: "",
            account_number: "",
            account_type: "",
            sort_code: "",
            routing_number: "",
            description: "",
            wallet_pin: "",
          });
          setFinalFormState({});
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    } else {
      await addBankBeneficiary(finalFormState)
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary added");
          setFormState({
            ...formState,
            title: "",
            currency: "",
            bank_name: "",
            bank_code: "",
            account_name: "",
            account_number: "",
            account_type: "",
            sort_code: "",
            routing_number: "",
            description: "",
            wallet_pin: "",
          });
          setFinalFormState({});
          setShowWalletPinModal(false);
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    }
  };

  const openWalletPinModal = () => {
    const {
      title,
      currency,
      account_number,
      account_name,
      bank_code,
      routing_number,
      sort_code,
      account_type,
      description,
    } = formState;

    if (formState.currency === "ngn") {
      if (title === "" || account_number === "" || bank_code === "") {
        showError("Required fields are missing");
        return;
      }

      if (account_name === "") {
        showError("Could not verify account number");
        return;
      }

      const selectedBank = supportedBanks.filter(
        (val) => val?.code === formState.bank_code
      );
      let bank_id;
      if (selectedBank.length) {
        bank_id = selectedBank[0].id;
      } else {
        showError("Invalid bank selected");
        return;
      }
      //   console.log(selectedBank);
      //   console.log(supportedBanks);

      setFinalFormState({
        title,
        currency,
        account_number,
        account_name,
        bank_code,
        bank_id,
        description,
      });
    } else {
      if (
        title === "" ||
        routing_number === "" ||
        sort_code === "" ||
        account_number === "" ||
        account_name === "" ||
        account_type === ""
      ) {
        showError("Required fields are missing");
        return;
      }

      setFinalFormState({
        title,
        currency,
        account_number,
        account_name,
        routing_number,
        sort_code,
        account_type,
        description,
      });
    }

    if (beneficiaryToUpdate) {
      handleSubmit();
    } else {
      setShowWalletPinModal(true);
    }
  };

  return (
    <>
      <Modal
        title={`${beneficiaryToUpdate ? "Edit" : "Add"} Bank Beneficiary`}
        isOpen={isOpen}
        onClose={onClose}
      >
        <>
          <div className="inputContainer">
            <label>Title</label>
            <input
              type="text"
              className="formInput"
              value={formState.title}
              onChange={(e) => handleOnChange(e.target.value, "title")}
            />
          </div>

          <div className="inputContainer">
            <label className="text-start">Currency</label>
            <CustomDropdown
              value={formState.currency}
              itemOnClick={handleCurrencyChange}
              dropdownItems={supportedCurrencies}
              disabled={beneficiaryToUpdate ? true : false}
            />
          </div>

          {formState.currency === "ngn" ? (
            <div className="inputContainer">
              <label>Bank Name</label>
              <CustomDropdown
                value={formState.bank_code}
                dropdownItems={supportedBanks}
                itemOnClick={(val) => handleOnChange(val, "bank_code")}
                disabled={beneficiaryToUpdate ? true : false}
              />
            </div>
          ) : (
            <div className="inputContainer">
              <label>Account Type</label>
              <CustomDropdown
                value={formState.account_type}
                dropdownItems={accountTypeOptions}
                itemOnClick={(val) => handleOnChange(val, "account_type")}
                disabled={beneficiaryToUpdate ? true : false}
              />
            </div>
          )}
          <div className="inputContainer">
            <label>Account Number</label>
            <input
              type="number"
              className="formInput"
              value={formState.account_number}
              onChange={(e) => handleOnChange(e.target.value, "account_number")}
              disabled={beneficiaryToUpdate ? true : false}
            />
          </div>
          <div className="inputContainer">
            <label>
              {formState.currency === "ngn"
                ? "Account Name"
                : "Receipient Name"}
            </label>
            <input
              type="text"
              className="formInput"
              value={formState.account_name}
              onChange={(e) => handleOnChange(e.target.value, "account_name")}
              readOnly={formState.currency === "ngn"}
              disabled={beneficiaryToUpdate ? true : false}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "8px",
                textAlign: "left",
              }}
            >
              {isValidateAcctLoading ? "Verifying Account..." : ""}
            </p>
          </div>
          {formState.currency === "usd" ? (
            <>
              <div className="inputContainer">
                <label>Sort Code</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.sort_code}
                  onChange={(e) => handleOnChange(e.target.value, "sort_code")}
                  disabled={beneficiaryToUpdate ? true : false}
                />
              </div>
              <div className="inputContainer">
                <label>Routing Number</label>
                <input
                  type="number"
                  className="formInput"
                  value={formState.routing_number}
                  onChange={(e) =>
                    handleOnChange(e.target.value, "routing_number")
                  }
                  disabled={beneficiaryToUpdate ? true : false}
                />
              </div>
            </>
          ) : (
            ""
          )}
          <div className="inputContainer">
            <label>Description</label>
            <textarea
              className="formInput"
              value={formState.description}
              onChange={(e) => handleOnChange(e.target.value, "description")}
              placeholder="Optional"
              cols="30"
              rows="3"
            ></textarea>
          </div>
          <CustomButtonII
            text={"Save"}
            className={"w100"}
            centerText={true}
            onClick={openWalletPinModal}
            loading={isAddBankBeneficiaryLoading || isUpdateBankBenLoading}
          />
        </>
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
            value={formState.wallet_pin}
            onChange={onWPinChange}
          />
        </div>
        <CustomButtonII
          text={"Confirm"}
          className={"w100"}
          onClick={handleSubmit}
          centerText={true}
          loading={isAddBankBeneficiaryLoading || isUpdateBankBenLoading}
        />
      </Modal>
    </>
  );
};

export default BankBeneModal;
