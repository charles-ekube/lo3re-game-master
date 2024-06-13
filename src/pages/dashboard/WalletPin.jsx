import React, { useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomButtonII from "../../utils/CustomButtonII";
import ThreeColumnRow from "../../utils/ThreeColumnRow";
import Modal from "../../utils/Modal";
// import CustomInput from "../../utils/CustomInput";
import { useUpdateWalletPinMutation } from "../../redux/services/walletApi";
import { showError, showSuccess } from "../../utils/Alert";
import OtpInput from "../../utils/CustomOtp";

const finalUpdatePinFormStep = 3;
const WalletPin = () => {
  const navigate = useNavigate();
  const [showUpdatePinModal, setShowUpdatePinModal] = useState(false);
  const [updatePinFormStep, setUpdatePinFormStep] = useState(1);
  const [updatePin, { isLoading: isUpdatePinLoading }] =
    useUpdateWalletPinMutation();
  const [pinFormState, setPinFormState] = useState({
    old_pin: "",
    new_pin: "",
    confirm_pin: "",
  });

  const onOldPinChange = (value) => {
    setPinFormState({ ...pinFormState, old_pin: value });
  };

  const onNewPinChange = (value) => {
    setPinFormState({ ...pinFormState, new_pin: value });
  };

  const onConfirmPinChange = (value) => {
    setPinFormState({ ...pinFormState, confirm_pin: value });
  };

  const goBack = () => {
    navigate(-1);
  };

  const closeUpdatePinModal = () => {
    setPinFormState({
      old_pin: "",
      new_pin: "",
    });
    setUpdatePinFormStep(1);
    setShowUpdatePinModal(false);
  };

  const processUpdatePin = () => {
    if (updatePinFormStep === 1) {
      if (pinFormState.old_pin.length < 6) {
        showError("Enter old pin");
        return;
      }

      setUpdatePinFormStep(2);
    } else if (updatePinFormStep === 2) {
      if (pinFormState.new_pin.length < 6) {
        showError("Enter new pin");
        return;
      }

      setUpdatePinFormStep(3);
    } else if (updatePinFormStep === finalUpdatePinFormStep) {
      if (pinFormState.confirm_pin.length < 6) {
        showError("Enter confirm pin");
        return;
      }

      if (pinFormState.confirm_pin !== pinFormState.new_pin) {
        showError("Confirm pin does not match new pin");
        setPinFormState({ ...pinFormState, new_pin: "", confirm_pin: "" });
        setUpdatePinFormStep(2);
        return;
      }

      updateWalletPin();
    }
  };

  const renderChangeWalletForm = () => {
    if (updatePinFormStep === 1) {
      return (
        <>
          <div className="inputContainer">
            <label className="text-center text-muted">Enter old pin</label>
            <OtpInput
              valueLength={6}
              value={pinFormState.old_pin}
              onChange={onOldPinChange}
            />
          </div>
        </>
      );
    } else if (updatePinFormStep === 2) {
      return (
        <>
          <div className="inputContainer">
            <label className="text-center text-muted">Enter new pin</label>
            <OtpInput
              valueLength={6}
              value={pinFormState.new_pin}
              onChange={onNewPinChange}
            />
          </div>
        </>
      );
    } else if (updatePinFormStep === 3) {
      return (
        <>
          <div className="inputContainer">
            <label className="text-center text-muted">Confirm new pin</label>
            <OtpInput
              valueLength={6}
              value={pinFormState.confirm_pin}
              onChange={onConfirmPinChange}
            />
          </div>
        </>
      );
    }
  };

  const updateWalletPin = async () => {
    const { old_pin, new_pin } = pinFormState;

    await updatePin({ old_pin, new_pin, confirm_new_pin: new_pin })
      .unwrap()
      .then(() => {
        showSuccess("Pin updated successfully");
        setPinFormState({
          old_pin: "",
          new_pin: "",
          confirm_pin: "",
        });
        setUpdatePinFormStep(1);
        setShowUpdatePinModal(false);
      })
      .catch((err) => {
        console.log(err);
        showError(err?.message || err?.data?.message || "An error occurred");
        setUpdatePinFormStep(1);
        setPinFormState({
          old_pin: "",
          new_pin: "",
          confirm_pin: "",
        });
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
        onClose={() => closeUpdatePinModal()}
        zClass={"tFaModal"}
      >
        {renderChangeWalletForm()}
        <CustomButtonII
          text={updatePinFormStep < finalUpdatePinFormStep ? "Next" : "Confirm"}
          className={"w100"}
          centerText={true}
          onClick={processUpdatePin}
          loading={isUpdatePinLoading}
        />
      </Modal>
    </>
  );
};

export default WalletPin;
