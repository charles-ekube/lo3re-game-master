import React, { useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomButtonII from "../../utils/CustomButtonII";
import ThreeColumnRow from "../../utils/ThreeColumnRow";
import Modal from "../../utils/Modal";
import CustomInput from "../../utils/CustomInput";
import { useUpdateWalletPinMutation } from "../../redux/services/walletApi";
import { showError, showSuccess } from "../../utils/Alert";

const WalletPin = () => {
  const navigate = useNavigate();
  const [showUpdatePinModal, setShowUpdatePinModal] = useState(false);
  const [updatePin, { isLoading: isUpdatePinLoading }] =
    useUpdateWalletPinMutation();
  const [pinFormState, setPinFormState] = useState({
    old_pin: "",
    new_pin: "",
    confirm_new_pin: "",
  });

  const handleOnPinChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    const isNumeric = /^\d+$/.test(value);

    if (value === "" || (isNumeric && value.length <= 6)) {
      setPinFormState({ ...pinFormState, [name]: value });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const updateWalletPin = async () => {
    const { old_pin, new_pin, confirm_new_pin } = pinFormState;
    if (old_pin === "" || new_pin === "" || confirm_new_pin === "") {
      showError("All fields are required");
      return;
    }

    if (new_pin !== confirm_new_pin) {
      showError("New pin does not match confirm pin");
      return;
    }

    await updatePin({ old_pin, new_pin, confirm_new_pin })
      .unwrap()
      .then(() => {
        showSuccess("Pin updated successfully");
        setPinFormState({
          old_pin: "",
          new_pin: "",
          confirm_new_pin: "",
        });
        setShowUpdatePinModal(false);
      })
      .catch((err) => {
        console.log(err);
        showError(err?.message || err?.data?.message || "An error occurred");
      });
  };

  return (
    <>
      <section className="mainContainer">
        <div className="content">
          <div className="settingHeader">
            <IoIosArrowRoundBack
              size={34}
              className={"arrow-back"}
              onClick={goBack}
            />
            <div className="headerTitle text-center">Wallet Pin</div>
          </div>

          <div className="settingContent">
            <ThreeColumnRow
              onClick={() => setShowUpdatePinModal(true)}
              title={"Change Wallet Pin"}
            />
            <hr className="faintDivider" />
            <ThreeColumnRow onClick={() => null} title={"Forgot Wallet Pin"} />
          </div>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer"}>
          <CardSlider />
          <div className={"contactCornerContainer"}>
            <Text tag={"p"} className={"f16 satoshi-bold-text"}>
              Customer corner
            </Text>
            <ContactCard />
          </div>
        </aside>
      </section>

      <Modal
        title={"Change Wallet Pin"}
        isOpen={showUpdatePinModal}
        onClose={() => setShowUpdatePinModal(false)}
        zClass={"tFaModal"}
      >
        <CustomInput
          label={"Wallet Pin"}
          type={"password"}
          placeholder={"Enter old wallet pin"}
          name={"old_pin"}
          value={pinFormState.old_pin}
          onChange={(e) => handleOnPinChange(e)}
        />
        <CustomInput
          label={"New Wallet Pin"}
          type={"password"}
          placeholder={"Enter new wallet pin"}
          name={"new_pin"}
          value={pinFormState.new_pin}
          onChange={(e) => handleOnPinChange(e)}
        />
        <CustomInput
          label={"Confirm Wallet Pin"}
          type={"password"}
          placeholder={"Confirm new wallet pin"}
          name={"confirm_new_pin"}
          value={pinFormState.confirm_new_pin}
          onChange={(e) => handleOnPinChange(e)}
        />
        <CustomButtonII
          text={"Confirm"}
          className={"w100"}
          centerText={true}
          onClick={updateWalletPin}
          loading={isUpdatePinLoading}
        />
      </Modal>
    </>
  );
};

export default WalletPin;
