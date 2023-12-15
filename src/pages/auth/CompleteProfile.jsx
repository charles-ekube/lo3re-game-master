import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updatePassword,
} from "firebase/auth";
import { setFlow } from "../../utils/Helpers";
import http from "../../utils/utils";
import { showError, showSuccess } from "../../utils/Alert";
import { auth } from "../../firebase";

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    password: "",
    displayName: "",
    confirmPassword: "",
    error: null,
    loading: false,
  });

  const onChangeUserName = (e) => {
    setState({ ...state, displayName: e.target.value });
  };
  const onChangePassword = (e) => {
    setState({ ...state, password: e.target.value });
  };
  const onChangeConfirmPassword = (e) => {
    setState({ ...state, confirmPassword: e.target.value });
  };

  const { password, confirmPassword, displayName } = state;

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

  const updateUser = async () => {
    if (password !== "" || confirmPassword !== "" || displayName !== "") {
      //implement strong password for account security reasons
      if (password === confirmPassword) {
        setState({ ...state, loading: true });
        try {
          await updateProfile(auth.currentUser, {
            displayName: displayName,
          });
          await updatePassword(auth.currentUser, confirmPassword);
          setState({ ...state, loading: false });
          window.localStorage.setItem(
            "accessToken",
            auth.currentUser.accessToken
          );
          showSuccess("Successful 👍");
          navigate("/dashboard");
        } catch (error) {
          handleFirebaseError(error);
          setState({ ...state, loading: false });
        }
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
        <div className={"formContainer"}>
          <div>
            <CustomInput
              label={"Username"}
              onChange={onChangeUserName}
              value={state.displayName}
            />
          </div>
          <div>
            <CustomInput
              label={"Password"}
              type={"password"}
              onChange={onChangePassword}
              value={state.password}
            />
          </div>
          <div>
            <CustomInput
              label={"Confirm password"}
              type={"password"}
              onChange={onChangeConfirmPassword}
              value={state.confirmPassword}
            />
          </div>
          <div>
            <Button
              text={"Proceed"}
              className={"authBtn"}
              onClick={updateUser}
              loading={state.loading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CompleteProfile;
