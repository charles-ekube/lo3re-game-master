import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../../firebase";
import { setToken } from "../../utils/Helpers";
import { useDispatch } from "react-redux";
import http from "../../utils/utils";
import { showError, showSuccess } from "../../utils/Alert";
import { ProgressB } from "../../utils/ProgressBar";

const SignUp = () => {
  const navigate = useNavigate();
  const verify = () => {
    navigate("/verification");
  };
  const login = () => {
    navigate("/");
  };
  const linkSignUp = () => {
    navigate("/linkRequest");
  };

  const [state, setState] = useState({
    email: "",
    password: "",
    displayName: "",
    confirmPassword: "",
    referralCode: "",
    error: null,
    loading: false,
    referralCodeError: "",
  });

  const onChangeUserName = (e) => {
    setState({ ...state, displayName: e.target.value });
  };
  const onChangeEmail = (e) => {
    setState({ ...state, email: e.target.value });
  };
  const onChangePassword = (e) => {
    setState({ ...state, password: e.target.value });
  };
  const onChangeConfirmPassword = (e) => {
    setState({ ...state, confirmPassword: e.target.value });
  };
  const onChangeReferralCode = (e) => {
    setState({ ...state, referralCode: e.target.value });
  };

  const auth = getAuth(app);
  const { email, password, confirmPassword, referralCode, displayName } = state;
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

  const validateCode = async () => {
    const obj = { referral_code: referralCode };
    setState({ ...state, referralCodeError: "" });
    try {
      const res = await http.post(`auth/affiliate/validate`, obj);
      console.log(res);
    } catch (error) {
      console.log(error);
      setState({ ...state, referralCodeError: error[1].message });
    }
  };

  useEffect(() => {
    if (referralCode !== "") {
      validateCode();
    }
  }, []);

  const getEmailLink = async () => {
    const obj = { email: email };
    try {
      const res = await http.post(`auth/verify`, obj);
      setState({ ...state, loading: false });
      navigate("/signup-link", {
        state: { data: { message: res?.message, email: email } },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const register = async () => {
    if (email !== "" || password !== "" || confirmPassword !== "" || displayName !== "" || confirmPassword === password) {
      setState({ ...state, loading: true });

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user, "user");
        // Update user profile with display name
        if (user) {
          updateProfile(auth.currentUser, {
            displayName: displayName,
          })
            .then((res) => {
              // Profile updated!
              // ...
              // console.log(res, "res");
            })
            .catch((error) => {
              // An error occurred
              // ...
              console.log(error, "error");
            });
        }

        console.log("User signed up successfully:", user);

        setToken(user.accessToken);
        if (user) {
          getEmailLink();
        }

        // Other logic...
      } catch (error) {
        handleFirebaseError(error);
        setState({ ...state, loading: false });
      } finally {
        //
      }
    }
  };

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          {/* <ProgressB /> */}
          <button className={"flexRow alignCenter justifyCenter googleAuthBtn"} onClick={linkSignUp}>
            <img src={GoogleLogo} alt="logo" />
            <Text>Sign up with Google</Text>
          </button>
          <img src={Or} alt="or" style={{ width: "100%" }} />
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput label={"Username"} onChange={onChangeUserName} value={state.displayName} />
          </div>
          <div>
            <CustomInput label={"Your email"} onChange={onChangeEmail} value={state.email} />
          </div>
          <div>
            <CustomInput label={"Password"} type={"password"} onChange={onChangePassword} value={state.password} />
          </div>
          <div>
            <CustomInput label={"Confirm password"} type={"password"} onChange={onChangeConfirmPassword} value={state.confirmPassword} />
          </div>
          <div>
            <CustomInput label={"Referral code"} onChange={onChangeReferralCode} value={state.referralCode} />
          </div>
          <div>
            <Text className={"f10 mediumText"} style={{ color: "#B00020", position: "relative", top: "-10px" }}>
              {state.referralCodeError}
            </Text>
          </div>
          <div>
            <Button text={"Sign up"} className={"authBtn"} onClick={register} loading={state.loading} />
          </div>
          <div className={"flexRow alignCenter justifyCenter"} style={{ gap: "5px", margin: "10px 0", cursor: "pointer" }}>
            <Text className={"f14"} style={{ color: "#8A8A8A" }}>
              Don’t have an account?{" "}
            </Text>
            <Text className={"f14 mediumText"} style={{ color: "#101010" }} onClick={login}>
              Login
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
