import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch } from "react-redux";
import { app } from "../../firebase";
import { showError } from "../../utils/Alert";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import http from "../../utils/utils";
import { setFlow } from "../../utils/Helpers";

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

  const auth = getAuth(app);
  const { email } = state;
  const dispatch = useDispatch();

  const [error, setError] = React.useState(null);

  const handleFirebaseError = (firebaseError) => {
    if (firebaseError.code && firebaseError.message) {
      const errorMessage = firebaseError.message;

      // Check if the message starts with the expected prefix
      if (errorMessage.startsWith("Firebase: Error (")) {
        // Extract the part after the prefix
        const startIndex = "Firebase: Error (".length;
        const endIndex = errorMessage.indexOf(")");
        setError(errorMessage.substring(startIndex, endIndex));
        showError(errorMessage.substring(startIndex, endIndex));
      } else {
        setError(errorMessage);
        showError(errorMessage);
      }
    } else {
      setError("An unexpected error occurred.");
    }
  };
  // auth / signin;

  const login = async () => {
    const obj = { email: email };
    try {
      const res = await http.post(`auth/recover`, obj);
      console.log(res, "res login");
      setState({ ...state, loading: false });
      navigate("/reset-link", { state: { data: { message: res?.message, email: email } } });
      setFlow("reset");
    } catch (error) {
      console.log(error);
      showError(error[1].message);
      setState({ ...state, loading: false });
    }
  };

  // sendPasswordResetEmail(auth, email)
  //   .then(() => {
  //     // Password reset email sent!
  //     // ..
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // ..
  //   });
  const register = async () => {
    if (email !== "") {
      setState({ ...state, loading: true });
      try {
        const loginDetails = await sendPasswordResetEmail(auth, email);
        const details = loginDetails;
        console.log(details, "login details");

        login();

        // Other logic...
      } catch (error) {
        handleFirebaseError(error);
        setState({ ...state, loading: false });
      } finally {
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
            <CustomInput label={"Your email"} value={state.email} onChange={onChangeEmail} />
          </div>
          <div>
            <Button text={"Reset password"} className={"authBtn"} onClick={register} loading={state.loading} />
          </div>
          <div className={"flexRow alignCenter justifyCenter"} style={{ gap: "5px", margin: "20px 0" }} onClick={login}>
            <GoArrowLeft color="#8A8A8A" />
            <Text className={"f14 mediumText"} style={{ color: "#8A8A8A" }} onClick={() => navigate('/')}>
              Back to Login
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
