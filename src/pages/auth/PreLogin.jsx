import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase";
import { showError } from "../../utils/Alert";
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  getAdditionalUserInfo,
  updateProfile,
} from "firebase/auth";
import { setFlow } from "../../utils/Helpers";

const PreLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const singUp = () => {
    navigate("/signUp");
  };

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
      showError("An unexpected error occurred.");
    }
  };

  const loginUser = async () => {
    if (email !== "") {
      setState({ ...state, loading: true });
      try {
        const actionCodeSettings = {
          url: `http://localhost:3000/verify?mode=signIn&email=${email}`, // Replace with your app's URL
          handleCodeInApp: true,
        };
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
          .then(() => {
            setFlow("login");
            localStorage.setItem("emailForSignIn", email);
            navigate("/signin-link", {
              state: {
                data: {
                  message: "🟢 Sign in link has been sent to your email.",
                  email: email,
                },
              },
            });
          })
          .catch((error) => {
            console.log(error);
            handleFirebaseError(error);
            setState({ ...state, loading: false });
            // showError("An error occured while sending signin link");
          });
      } catch (error) {
        handleFirebaseError(error);
        setState({ ...state, loading: false });
      } finally {
      }
    } else {
      showError("Required fields are missing");
    }
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);
        const fullName = user?.displayName;
        if (additionalInfo?.isNewUser && fullName) {
          // TODO: check for wallet pin & 2fa as usual for login flow
          updateProfile(user, {
            displayName: fullName.split(" ")[0],
          })
            .catch((error) => {
              console.log(error, "update user error");
            })
            .finally(() => {
              // @ts-ignore
              localStorage.setItem("axxToken", user?.accessToken);
              navigate("/activate-wallet-pin");
            });
        } else {
          // @ts-ignore
          localStorage.setItem("axxToken", user?.accessToken);
          navigate(from);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(
          "Google Sign-In error:",
          errorCode,
          errorMessage,
          email,
          credential
        );
        handleFirebaseError(error);
      });
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
          <button
            className={"flexRow alignCenter justifyCenter googleAuthBtn"}
            onClick={signInWithGoogle}
          >
            <img src={GoogleLogo} alt="logo" />
            <Text className={"satoshi-medium-text"}>Continue with Google</Text>
          </button>
          <img src={Or} alt="or" style={{ width: "100%" }} />
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
              text={"Send link"}
              className={"authBtn"}
              onClick={loginUser}
              loading={state.loading}
            />
          </div>
          <div
            className={"flexRow alignCenter justifyCenter"}
            style={{ gap: "5px", margin: "10px 0", cursor: "pointer" }}
          >
            <Text className={"f14"} style={{ color: "#8A8A8A" }}>
              Don’t have an account?{" "}
            </Text>
            <Text
              className={"f14 mediumText"}
              style={{ color: "#101010" }}
              onClick={singUp}
            >
              Sign up
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PreLogin;
