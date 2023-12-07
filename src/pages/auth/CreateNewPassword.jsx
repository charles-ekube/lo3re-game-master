import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import CustomInput from "../../utils/CustomInput";
import { showError } from "../../utils/Alert";
import Button from "../../utils/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";

const CreatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const actionCode = searchParams.get("actionCode");
  const [formState, setFormState] = useState({
    newPassword: "",
    confirmPassword: "",
    loading: false,
  });

  const onChangeNew = (e) => {
    setFormState({ ...formState, newPassword: e.target.value });
  };

  const onChangeConfirm = (e) => {
    setFormState({ ...formState, confirmPassword: e.target.value });
  };

  const login = () => {
    navigate("/");
  };

  const handleFirebaseError = (firebaseError) => {
    if (firebaseError.code && firebaseError.message) {
      const errorMessage = firebaseError.message;

      // Check if the message starts with the expected prefix
      if (errorMessage.startsWith("Firebase: Error (")) {
        // Extract the part after the prefix
        const startIndex = "Firebase: Error (".length;
        const endIndex = errorMessage.indexOf(")");
        showError(errorMessage.substring(startIndex, endIndex));
      } else {
        showError(errorMessage);
      }
    } else {
      showError("An unexpected error occurred.");
    }
  };

  const resetPassword = () => {
    const { newPassword, confirmPassword } = formState;

    if (newPassword !== "" || confirmPassword !== "") {
      if (newPassword === confirmPassword) {
        // Save the new password.
        setFormState({ ...formState, loading: true });
        confirmPasswordReset(auth, actionCode, newPassword)
          .then((resp) => {
            console.log("password reset", resp);
            navigate("/resetDone");
            setFormState({ ...formState, loading: false });
          })
          .catch((error) => {
            console.log(error);
            handleFirebaseError(error);
            setFormState({ ...formState, loading: false });
          });
      } else {
        showError("Passwords do not match");
      }
    } else {
      showError("Required fields are missing");
    }
  };

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          <div style={{ margin: "32px 0" }}>
            <Text tag={"h2"} className={"boldText"}>
              Forgot Password
            </Text>
            <Text tag={"p"}>
              Your new password should be different from passwords previously
              used
            </Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput
              label={"Password"}
              type={"password"}
              value={formState.newPassword}
              onChange={onChangeNew}
            />
          </div>
          <div>
            <CustomInput
              label={"Confirm Password"}
              type={"password"}
              value={formState.confirmPassword}
              onChange={onChangeConfirm}
            />
          </div>
          <div>
            <Button
              text={"Confirm"}
              className={"authBtn"}
              onClick={resetPassword}
            />
          </div>
          <div
            className={"flexRow alignCenter justifyCenter"}
            style={{ gap: "5px", margin: "20px 0" }}
            onClick={login}
          >
            <GoArrowLeft color="#8A8A8A" />
            <Text className={"f14 mediumText"} style={{ color: "#8A8A8A" }}>
              Back to Login
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreatePassword;
