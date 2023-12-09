import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import Text from "../../utils/CustomText";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { showError } from "../../utils/Alert";
import { sendPasswordResetEmail } from "firebase/auth";
import { setFlow } from "../../utils/Helpers";
import { auth } from "../../firebase";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: "",
    error: null,
    loading: false,
  });
  const onChangeEmail = (e) => {
    setState({ ...state, email: e.target.value });
  };

  const { email } = state;

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
      showError("An unexpected error occurred");
    }
  };

  const register = async () => {
    if (email !== "") {
      setState({ ...state, loading: true });
      try {
        const loginDetails = await sendPasswordResetEmail(auth, email);
        const details = loginDetails;
        console.log(details, "login details");

        setState({ ...state, loading: false });
        navigate("/reset-link", {
          state: {
            data: {
              message: "🟢 Password reset email sent successfully",
              email: email,
            },
          },
        });
        setFlow("reset");

        // Other logic...
      } catch (error) {
        handleFirebaseError(error);
        setState({ ...state, loading: false });
      }
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
            <Text tag={"p"}>No worries, we’ll send reset instructions.</Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput
              label={"Your email"}
              value={state.email}
              onChange={onChangeEmail}
            />
          </div>
          <div>
            <Button
              text={"Reset password"}
              className={"authBtn"}
              onClick={register}
              loading={state.loading}
            />
          </div>
          <div
            className={"flexRow alignCenter justifyCenter"}
            style={{ gap: "5px", margin: "20px 0" }}
          >
            <GoArrowLeft color="#8A8A8A" />
            <Text
              className={"f14 mediumText"}
              style={{ color: "#8A8A8A" }}
              onClick={() => navigate("/")}
            >
              Back to Login
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
