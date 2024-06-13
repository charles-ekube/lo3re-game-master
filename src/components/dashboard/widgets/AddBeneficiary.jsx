import React, { useEffect, useState } from "react";
import { showError } from "../../../utils/Alert";
import CustomDropdown from "../../../utils/CustomDropdown";
import CustomCheckbox from "../../../utils/CustomCheckbox";
import {
  useFetchSupportedBanksQuery,
  useFetchSupportedCoinsQuery,
  useValidateAccountDetailMutation,
} from "../../../redux/services/beneficiariesApi";

const AddBeneficiary = ({
  currency,
  payMethod,
  bankFormState,
  cryptoFormState,
  handleChange,
}) => {
  const accountTypeOptions = [
    { name: "Personal Account", value: "personal" },
    { name: "Business Account", value: "business" },
  ];

  const [supportedBanks, setSupportedBanks] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [cyrptoNetworks, setCryptoNetworks] = useState([]);
  const [supportedCryptos, setSupportedCryptos] = useState([]);

  const {
    data: fetchedSuppCoins,
    isLoading: isSuppCoinsLoading,
    isSuccess: isFetchedSuppCoinsSuccess,
  } = useFetchSupportedCoinsQuery();
  const {
    data: fetchedSuppBanks,
    isLoading: isSuppBanksLoading,
    isSuccess: isFetchedSuppBanksSuccess,
  } = useFetchSupportedBanksQuery();
  const [validateAcctDetail, { isLoading: isValidateAcctLoading }] =
    useValidateAccountDetailMutation();

  //   process fetched supported banks
  useEffect(() => {
    if (isFetchedSuppBanksSuccess) {
      const newArray = fetchedSuppBanks?.map((bank) => ({
        ...bank,
        value: bank?.code,
      }));

      setSupportedBanks(newArray);
    }
  }, [isFetchedSuppBanksSuccess, fetchedSuppBanks]);

  //   process fetched supported coins
  useEffect(() => {
    if (isFetchedSuppCoinsSuccess) {
      const newArray = fetchedSuppCoins?.map((crypto) => ({
        ...crypto,
        value: crypto.id,
        name: crypto.name.toUpperCase(),
        icon: crypto.logo_url,
      }));

      setSupportedCryptos(newArray);
    }
  }, [isFetchedSuppCoinsSuccess, fetchedSuppCoins]);

  // validate acct
  useEffect(() => {
    if (currency === "ngn") {
      if (
        bankFormState.account_number.length === 10 &&
        bankFormState.bank_code
      ) {
        validateAcctDetail({
          account_number: bankFormState.account_number,
          bank_code: bankFormState.bank_code,
        })
          .unwrap()
          .then((resp) => {
            if (resp?.data?.status) {
              const acctName = resp?.data?.data?.account_name;
              if (acctName) {
                handleChange(acctName, "account_name");
              }
            } else {
              console.log("acct validation err", resp);
              showError("Could not validate account details");
              handleChange("", "account_name");
            }
          })
          .catch((err) => {
            showError("Could not validate account details");
            console.log(err);
            handleChange("", "account_name");
          });
      }
    }
  }, [
    currency,
    bankFormState.account_number,
    bankFormState.bank_code,
    validateAcctDetail,
    handleChange,
  ]);

  // add/pop network
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
    if (!isSuppCoinsLoading && !isSuppBanksLoading) {
      if (payMethod?.code === "bank_transfer") {
        return (
          <>
            {currency === "ngn" ? (
              <div className="inputContainer">
                <label>Bank Name</label>
                <CustomDropdown
                  value={bankFormState.bank_code}
                  dropdownItems={supportedBanks}
                  itemOnClick={(val) => handleChange(val, "bank_code")}
                />
              </div>
            ) : (
              <div className="inputContainer">
                <label>Account Type</label>
                <CustomDropdown
                  value={bankFormState.account_type}
                  dropdownItems={accountTypeOptions}
                  itemOnClick={(val) => handleChange(val, "account_type")}
                />
              </div>
            )}
            <div className="inputContainer">
              <label>Account Number</label>
              <input
                type="number"
                className="formInput"
                value={bankFormState.account_number}
                onChange={(e) => handleChange(e.target.value, "account_number")}
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
                onChange={(e) => handleChange(e.target.value, "account_name")}
                readOnly={currency === "ngn"}
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
            {currency === "usd" ? (
              <>
                <div className="inputContainer">
                  <label>Sort Code</label>
                  <input
                    type="text"
                    className="formInput"
                    value={bankFormState.sort_code}
                    onChange={(e) => handleChange(e.target.value, "sort_code")}
                  />
                </div>
                <div className="inputContainer">
                  <label>Routing Number</label>
                  <input
                    type="number"
                    className="formInput"
                    value={bankFormState.routing_number}
                    onChange={(e) =>
                      handleChange(e.target.value, "routing_number")
                    }
                  />
                </div>
                <div className="inputContainer">
                  <label>Note</label>
                  <textarea
                    className="formInput"
                    value={bankFormState.description}
                    onChange={(e) => handleChange(e.target.value, "note")}
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
              onChange={(e) => handleChange(e.target.checked, e.target.name)}
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
                itemOnClick={(val) => handleChange(val, "coin_id")}
              />
            </div>
            <div className="inputContainer">
              <label>Select Network</label>
              <CustomDropdown
                value={cryptoFormState.network}
                dropdownItems={cyrptoNetworks}
                itemOnClick={(val) => handleChange(val, "network")}
              />
            </div>
            <div className="inputContainer">
              <label>Wallet address</label>
              <input
                type={"text"}
                className="formInput"
                value={cryptoFormState.address}
                onChange={(e) => handleChange(e.target.value, "address")}
              />
            </div>
            {showTagInput && (
              <div className="inputContainer">
                <label>Tag ID</label>
                <input
                  type={"text"}
                  className="formInput"
                  value={cryptoFormState.tag_id}
                  onChange={(e) => handleChange(e.target.value, "tag_id")}
                />
              </div>
            )}
            <CustomCheckbox
              isChecked={cryptoFormState.saveForLater}
              label={"Save for future transactions"}
              name={"saveForLater"}
              onChange={(e) => handleChange(e.target.checked, e.target.name)}
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
