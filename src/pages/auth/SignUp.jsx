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
  // GoogleAuthProvider,
  // signInWithPopup,
  signOut,
  sendEmailVerification,
  signInWithPopup,
  getAdditionalUserInfo,
  GoogleAuthProvider,
} from "firebase/auth";
import { setFlow } from "../../utils/Helpers";
import http from "../../utils/utils";
import { showError } from "../../utils/Alert";
import { auth } from "../../firebase";

const SignUp = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/");
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

  // const auth = getAuth(app);
  const { email, password, confirmPassword, referralCode, displayName } = state;

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

  const validateCode = async () => {
    const obj = { referral_code: referralCode };
    setState((state) => ({ ...state, referralCodeError: "" }));
    try {
      const res = await http.post(`auth/affiliate/validate`, obj);
      console.log(res);
      return { failed: false, result: res };
    } catch (error) {
      console.log(error);
      setState((state) => ({
        ...state,
        referralCodeError: error[1].message,
      }));
      return { failed: true, error: error };
    }
  };

  useEffect(() => {
    const validateCode = async () => {
      const obj = { referral_code: referralCode };
      setState((state) => ({ ...state, referralCodeError: "" }));
      try {
        const res = await http.post(`auth/affiliate/validate`, obj);
        console.log(res);
        return { failed: false, result: res };
      } catch (error) {
        console.log(error);
        setState((state) => ({
          ...state,
          referralCodeError: error[1].message,
        }));
        return { failed: true, error: error };
      }
    };

    if (referralCode !== "") {
      validateCode();
    }
  }, [referralCode]);

  const register = async () => {
    if (
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      displayName !== ""
    ) {
      let usernameRegex = RegExp(/\s/);
      if (usernameRegex.test(displayName)) {
        showError("Username cannot contain whitespace");
        return;
      }

      //implement strong password for account security reasons
      if (password === confirmPassword) {
        setState({ ...state, loading: true });
        //implement promo code validation
        if (referralCode !== "") {
          const validationResult = await validateCode();
          if (validationResult.failed) {
            setState({ ...state, loading: false });
            showError(validationResult.error[1]?.message);
            return;
          }
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          console.log(user, "user");
          // Update user profile with display name
          if (user) {
            updateProfile(auth.currentUser, {
              displayName: displayName,
            }).catch((error) => {
              console.log(error, "update user error");
            });
          }

          if (user) {
            sendEmailVerification(auth.currentUser)
              .then((resp) => {
                console.log("vEmail", resp);
                signOut(auth);
                setState({ ...state, loading: false });
                setFlow("signUp");
                navigate("/signup-link", {
                  state: {
                    data: {
                      message:
                        "🟢 Verification link has been sent to email. Please check inbox or spam folder for this link",
                      email: email,
                    },
                  },
                });
              })
              .catch((error) => {
                console.log(error);
                handleFirebaseError(error);
              });
          }
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
          navigate("/dashboard");
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
          {/* <ProgressB /> */}
          <button
            className={"flexRow alignCenter justifyCenter googleAuthBtn"}
            onClick={signInWithGoogle}
          >
            <img src={GoogleLogo} alt="logo" />
            <Text>Sign up with Google</Text>
          </button>
          <img src={Or} alt="or" style={{ width: "100%" }} />
        </header>
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
              label={"Your email"}
              onChange={onChangeEmail}
              value={state.email}
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
            <CustomInput
              label={"Promo code"}
              onChange={onChangeReferralCode}
              value={state.referralCode}
            />
          </div>
          <div>
            <Text
              className={"f10 mediumText"}
              style={{ color: "#B00020", position: "relative", top: "-10px" }}
            >
              {state.referralCodeError}
            </Text>
          </div>
          <div>
            <Button
              text={"Sign up"}
              className={"authBtn"}
              onClick={register}
              loading={state.loading}
            />
          </div>
          <div
            className={"flexRow alignCenter justifyCenter"}
            style={{ gap: "5px", margin: "10px 0", cursor: "pointer" }}
          >
            <Text className={"f14"} style={{ color: "#8A8A8A" }}>
              Already have an account?{" "}
            </Text>
            <Text
              className={"f14 mediumText"}
              style={{ color: "#101010" }}
              onClick={login}
            >
              Login
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
