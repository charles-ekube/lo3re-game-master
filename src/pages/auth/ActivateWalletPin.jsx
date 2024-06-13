import React, { useEffect, useState } from "react";
import { useActivateWalletPinMutation } from "../../redux/services/walletApi";
import CustomButtonII from "../../utils/CustomButtonII";
import OtpInput from "../../utils/CustomOtp";
import Modal from "../../utils/Modal";
import { showError, showSuccess } from "../../utils/Alert";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { accountApi } from "../../redux/services/accountApi";

const finalFormStep = 2;
const ActivateWalletPin = () => {
  const navigate = useNavigate();
  const [activateWalletPin, { isLoading: isActivateWalletLoading }] =
    useActivateWalletPinMutation();
  const [formStep, setFormStep] = useState(1);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const dispatch = useDispatch();
  const token = localStorage.getItem("axxToken");
  const onChange = (value) => {
    setPin(value);
  };

  const onChangeConfirm = (value) => {
    setPinConfirm(value);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const renderForm = () => {
    if (formStep === 1) {
      return (
        <div className="inputContainer">
          <label className="text-center text-muted">
            Create Your 6-Digit PIN
          </label>
          <OtpInput valueLength={6} value={pin} onChange={onChange} />
        </div>
      );
    } else if (formStep === 2) {
      return (
        <div className="inputContainer">
          <label className="text-center text-muted">
            Confirm Your 6-Digit PIN
          </label>
          <OtpInput
            valueLength={6}
            value={pinConfirm}
            onChange={onChangeConfirm}
          />
        </div>
      );
    }
  };

  const setWalletPin = async () => {
    if (pinConfirm === "" || pinConfirm.length < 6) {
      showError("Enter your 6-digit wallet pin");
      return;
    }

    if (pin !== pinConfirm) {
      showError("Confirm pin does not match pin");
      setPin("");
      setPinConfirm("");
      setFormStep(1);
      return;
    }

    await activateWalletPin({ pin, confirm_pin: pin })
      .unwrap()
      .then(() => {
        showSuccess("Pin activated successfully");
        dispatch(accountApi.util.invalidateTags(["profile"]));
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        showError(
          err?.message ||
            err?.data?.message ||
            "An error occured try again later"
        );
      });
  };

  const handleSubmit = () => {
    if (formStep < finalFormStep) {
      if (pin === "" || pin.length < 6) {
        showError("Enter your 6-digit wallet pin");
        return;
      }

      setFormStep(formStep + 1);
    } else {
      setWalletPin();
    }
  };

  return (
    <>
      <Modal
        title={
          formStep < finalFormStep ? "Set Wallet Pin" : "Confirm Wallet Pin"
        }
        isOpen={true}
        onClose={() => null}
        hideCloseBtn={true}
        zClass={"tFaModal"}
      >
        {renderForm()}
        <CustomButtonII
          text={formStep < finalFormStep ? "Next" : "Confirm"}
          className={"w100"}
          onClick={handleSubmit}
          centerText={true}
          loading={isActivateWalletLoading}
        />
      </Modal>
    </>
  );
};

export default ActivateWalletPin;
