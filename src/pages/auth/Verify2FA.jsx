import React, { useEffect, useState } from "react";
import CustomButtonII from "../../utils/CustomButtonII";
import Modal from "../../utils/Modal";
import { showError, showSuccess } from "../../utils/Alert";
import { useNavigate } from "react-router-dom";
import { useVerifyTFAMutation } from "../../redux/services/twoFAApi";

const Verify2FA = () => {
  const navigate = useNavigate();
  const [verifyTFA, { isLoading: isVerifyTFALoading }] = useVerifyTFAMutation();
  const [code, setCode] = useState("");
  const token = localStorage.getItem("axxToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleSubmit = async () => {
    if (code === "") {
      showError("Enter code");
      return;
    }

    await verifyTFA({ code })
      .unwrap()
      .then((resp) => {
        if (resp?.success) {
          localStorage.setItem("TFAVerified", JSON.stringify(true));
          showSuccess("Successful 👍");
          navigate("/dashboard");
        } else {
          showError("An unknown error occurred");
        }
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

  return (
    <>
      <Modal
        title={"Enter Security Code"}
        glassOverlay={true}
        isOpen={true}
        onClose={() => null}
        hideCloseBtn={true}
        zClass={"z600"}
      >
        <div className="inputContainer">
          <label className="text-start text-muted">
            To login, please enter the security code from your Authenticator App
          </label>
          <input
            type="text"
            placeholder="Enter the code to verify"
            className="formInput"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <CustomButtonII
          text={"Confirm"}
          className={"w100"}
          onClick={handleSubmit}
          centerText={true}
          loading={isVerifyTFALoading}
        />
      </Modal>
    </>
  );
};

export default Verify2FA;
