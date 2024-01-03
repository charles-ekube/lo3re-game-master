import React, { useEffect, useState } from "react";
import http from "../../../utils/utils";
import { showError } from "../../../utils/Alert";
import CustomDropdown from "../../../utils/CustomDropdown";
import CustomCheckbox from "../../../utils/CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import {
  setBankTransferBeneficiaryForm,
  setCryptoBeneficiaryForm,
} from "../../../redux/features/generalSlice";

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

  const [supportedBanks, setSupportedBanks] = useState([]);

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
      const res = await http.get(`wallets/supported-banks`);
      const newArray = res?.data.map((cur) => ({
        ...cur,
        value: cur.code,
      }));

      setSupportedBanks(newArray);
      // console.log("banks", res);
      setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      setRequestLoading(false);
    }
  };

  const validateAccount = async () => {
    try {
      const { account_number, bank_code } = bankFormState;
      handleOnChange("...", "account_name");
      const res = await http.post(
        `wallets/withdrawals/validate-bank-details?currency=ngn`,
        {
          account_number,
          bank_code,
        }
      );

      if (res.data?.status) {
        const acName = res?.data?.data?.account_name;
        if (acName) {
          handleOnChange(acName, "account_name");
        }
      } else {
        showError("Could not resolve account name");
        console.log(res);
        handleOnChange("", "account_name");
      }
    } catch (error) {
      showError("Could not resolve account name");
      console.log(error);
      handleOnChange("", "account_name");
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
        validateAccount();
      } else {
        // handleOnChange("", "account_name");
        dispatch(
          setCryptoBeneficiaryForm({
            ...cryptoFormState,
            account_name: "",
          })
        );
      }
    }
  }, [
    bankFormState.account_number,
    currency,
    bankFormState.bank_code,
    dispatch,
    cryptoFormState,
  ]);

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

  // show/hide tag_id input
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

export default AddBeneficiary;
