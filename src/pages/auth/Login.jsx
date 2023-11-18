import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import http from "../../utils/utils";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { showError } from "../../utils/Alert";
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setFlow } from "../../utils/Helpers";

const Login = () => {
  const navigate = useNavigate();
  const verify = () => {
    navigate("/loginVerification");
  };
  const singUp = () => {
    navigate("/signUp");
  };
  const forgotPassword = () => {
    navigate("/forgotPassword");
  };

  const [state, setState] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });
  const onChangeEmail = (e) => {
    setState({ ...state, email: e.target.value });
  };
  const onChangePassword = (e) => {
    setState({ ...state, password: e.target.value });
  };
  const auth = getAuth(app);
  const { email, password } = state;
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
      const res = await http.post(`auth/signin`, obj);
      console.log(res, "res login");
      setState({ ...state, loading: false });
      navigate("/signin-link", {
        state: { data: { message: res?.message, email: email } },
      });
      setFlow("login");
    } catch (error) {
      console.log(error);
      showError(error[1].message);
      setState({ ...state, loading: false });
      setFlow("login");
    }
  };

  const register = async () => {
    if (email !== "" || password !== "") {
      setState({ ...state, loading: true });
      try {
        const loginDetails = await signInWithEmailAndPassword(auth, email, password);
        const details = loginDetails.user;
        console.log(details, "login details");
        if (details) {
          login();
        }
        // Other logic...
      } catch (error) {
        handleFirebaseError(error);
        setState({ ...state, loading: false });
      } finally {
      }
    }else{
      showError('Required fields are missing');
    }
  };
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      // IdP data available using getAdditionalUserInfo(result)
      // ...

      console.log("Google Sign-In successful:", user);
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      // The email of the user's account used.
      const email = error.customData?.email;

      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.error("Google Sign-In error:", errorCode, errorMessage, email, credential);
      handleFirebaseError(error);
    }
  };

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          <div style={{ margin: "32px 0" }}>
            <Text tag={"h2"} className={"boldText"}>
              Login
            </Text>
          </div>
          <button className={"flexRow alignCenter justifyCenter googleAuthBtn"} onClick={signInWithGoogle}>
            <img src={GoogleLogo} alt="logo" />
            <Text className={"satoshi-medium-text"}>Continue with Google</Text>
          </button>
          <img src={Or} alt="or" style={{ width: "100%" }} />
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput label={"Your email"} value={state.email} onChange={onChangeEmail} />
          </div>
          <div>
            <CustomInput label={"Password"} type={"password"} value={state.password} onChange={onChangePassword} />
          </div>
          <button className={"forgotBtn"} onClick={forgotPassword}>
            <Text>Forgot password?</Text>
          </button>
          <div>
            <Button text={"Login"} className={"authBtn"} onClick={register} loading={state.loading} />
          </div>
          <div className={"flexRow alignCenter justifyCenter"} style={{ gap: "5px", margin: "10px 0", cursor: "pointer" }}>
            <Text className={"f14"} style={{ color: "#8A8A8A" }}>
              Don’t have an account?{" "}
            </Text>
            <Text className={"f14 mediumText"} style={{ color: "#101010" }} onClick={singUp}>
              Sign up
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
