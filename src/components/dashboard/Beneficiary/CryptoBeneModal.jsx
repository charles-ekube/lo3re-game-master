import React, { useEffect, useState } from "react";
import {
  useAddCryptoBeneficiaryMutation,
  useUpdateCryptoBeneficiaryMutation,
} from "../../../redux/services/beneficiariesApi";
import CustomButtonII from "../../../utils/CustomButtonII";
import Modal from "../../../utils/Modal";
import OtpInput from "../../../utils/CustomOtp";
import CustomDropdown from "../../../utils/CustomDropdown";
import http from "../../../utils/utils";
import { showError, showSuccess } from "../../../utils/Alert";

const CryptoBeneModal = ({
  isOpen,
  onClose,
  cryptoBeneficiaryToUpdate = null,
}) => {
  const [formState, setFormState] = useState({
    title: "",
    coin_id: "",
    network: "",
    address: "",
    tag_id: "",
    description: "",
    wallet_pin: "",
  });
  const [showWalletPinModal, setShowWalletPinModal] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [supportedCryptos, setSupportedCryptos] = useState([]);
  const [cyrptoNetworks, setCryptoNetworks] = useState([]);
  const [updateCryptoBeneficiary, { isLoading: isUpdateCryptoBenLoading }] =
    useUpdateCryptoBeneficiaryMutation();
  const [addCryptoBeneficiary, { isLoading: isAddCryptoBeneficiaryLoading }] =
    useAddCryptoBeneficiaryMutation();

  const onWPinChange = (value) => {
    setFormState({ ...formState, wallet_pin: value });
  };

  const handleOnChange = (val, name) => {
    setFormState({ ...formState, [name]: val });
  };

  const fetchCryptos = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-coins`);
      const newArray = res.map((crypto) => ({
        ...crypto,
        value: crypto.id,
        name: crypto.name.toUpperCase(),
        icon: crypto.logo_url,
      }));

      // setBanks(res);
      setSupportedCryptos(newArray);
      //   setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      //   setRequestLoading(false);
    }
  };

  // fetch supported banks/cryptos
  useEffect(() => {
    fetchCryptos();
  }, []);

  useEffect(() => {
    if (cryptoBeneficiaryToUpdate) {
      setFormState((prevState) => ({
        ...prevState,
        title: cryptoBeneficiaryToUpdate?.title,
        coin_id: cryptoBeneficiaryToUpdate?.coin_id,
        network: cryptoBeneficiaryToUpdate?.network,
        address: cryptoBeneficiaryToUpdate?.address,
        tag_id: cryptoBeneficiaryToUpdate?.tag_id,
        description: cryptoBeneficiaryToUpdate?.description,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        title: "",
        coin_id: "",
        network: "",
        address: "",
        tag_id: "",
        description: "",
        wallet_pin: "",
      }));
    }
  }, [cryptoBeneficiaryToUpdate]);

  useEffect(() => {
    const selectedCoin = supportedCryptos.filter(
      (val) => val.id === formState.coin_id
    );
    if (selectedCoin.length) {
      const networkArr = selectedCoin[0].networks.map((val) => ({
        name: val,
        value: val,
      }));
      setCryptoNetworks(networkArr);
      //   console.log(networkArr);
    }
  }, [formState.coin_id, supportedCryptos]);

  // show/hide tag_id input
  useEffect(() => {
    const selectedCoin = supportedCryptos.filter(
      (val) => val.id === formState.coin_id
    );
    if (selectedCoin.length && selectedCoin[0].name === "RIPPLE") {
      setShowTagInput(true);
    } else {
      setShowTagInput(false);
    }
  }, [formState.coin_id, supportedCryptos]);

  const handleSubmit = async () => {
    const { wallet_pin } = formState;
    if (wallet_pin.length < 6 && !cryptoBeneficiaryToUpdate) {
      showError("Please enter wallet pin");
      return;
    }

    if (cryptoBeneficiaryToUpdate) {
      await updateCryptoBeneficiary({
        id: cryptoBeneficiaryToUpdate?.id,
        data: formState,
      })
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary updated");
          setFormState({
            ...formState,
            title: "",
            coin_id: "",
            network: "",
            address: "",
            tag_id: "",
            description: "",
            wallet_pin: "",
          });
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    } else {
      await addCryptoBeneficiary(formState)
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary added");
          setFormState({
            ...formState,
            title: "",
            coin_id: "",
            network: "",
            address: "",
            tag_id: "",
            description: "",
            wallet_pin: "",
          });
          setShowWalletPinModal(false);
          onClose();
        })
        .catch((err) => {
          console.log(err);
          setFormState({ ...formState, wallet_pin: "" });
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    }
  };

  const openWalletPinModal = async () => {
    if (
      formState.title === "" ||
      formState.coin_id === "" ||
      formState.network === "" ||
      formState.address === ""
    ) {
      showError("Required fields are missing");
      return;
    }

    if (cryptoBeneficiaryToUpdate) {
      handleSubmit();
    } else {
      setShowWalletPinModal(true);
    }
  };

  return (
    <>
      <Modal
        title={`${
          cryptoBeneficiaryToUpdate ? "Edit" : "Add"
        } Crypto Beneficiary`}
        isOpen={isOpen}
        onClose={onClose}
      >
        <>
          {/* fields: select crypto, select network, enter addr, opt tag_id */}
          <div className="inputContainer">
            <label>Title</label>
            <input
              type={"text"}
              className="formInput"
              value={formState.title}
              onChange={(e) => handleOnChange(e.target.value, "title")}
            />
          </div>
          <div className="inputContainer">
            <label>Select Coin</label>
            <CustomDropdown
              value={formState.coin_id}
              dropdownItems={supportedCryptos}
              itemOnClick={(val) => handleOnChange(val, "coin_id")}
              disabled={cryptoBeneficiaryToUpdate ? true : false}
            />
          </div>
          <div className="inputContainer">
            <label>Select Network</label>
            <CustomDropdown
              value={formState.network}
              dropdownItems={cyrptoNetworks}
              itemOnClick={(val) => handleOnChange(val, "network")}
              disabled={cryptoBeneficiaryToUpdate ? true : false}
            />
          </div>
          <div className="inputContainer">
            <label>Wallet address</label>
            <input
              type={"text"}
              className="formInput"
              value={formState.address}
              onChange={(e) => handleOnChange(e.target.value, "address")}
              disabled={cryptoBeneficiaryToUpdate ? true : false}
            />
          </div>
          {showTagInput && (
            <div className="inputContainer">
              <label>Tag ID</label>
              <input
                type={"text"}
                className="formInput"
                value={formState.tag_id}
                onChange={(e) => handleOnChange(e.target.value, "tag_id")}
                disabled={cryptoBeneficiaryToUpdate ? true : false}
              />
            </div>
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
            loading={isAddCryptoBeneficiaryLoading || isUpdateCryptoBenLoading}
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
          loading={isAddCryptoBeneficiaryLoading || isUpdateCryptoBenLoading}
        />
      </Modal>
    </>
  );
};

export default CryptoBeneModal;
