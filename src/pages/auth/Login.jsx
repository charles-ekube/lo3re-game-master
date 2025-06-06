import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.svg";
import Text from "../../utils/CustomText";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { showError, showSuccess } from "../../utils/Alert";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFetchProfileQuery } from "../../redux/services/accountApi";
import { handleFirebaseError } from "../../utils/Helpers";

const Login = ({ signInEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userSkip, setUserSkip] = useState(true);
  const singUp = () => {
    navigate("/signUp");
  };
  const forgotPassword = () => {
    navigate("/forgotPassword");
  };

  const {
    data: user,
    error: userError,
    isSuccess: isFetchUserSuccess,
  } = useFetchProfileQuery(null, { skip: userSkip });
  const [state, setState] = useState({
    email: signInEmail,
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
  const { email, password } = state;
  const from = location.state?.from?.pathname || "/dashboard";
  // clg
  useEffect(() => {
    if (userError) {
      setState((prevState) => ({ ...prevState, loading: false }));
      showError(
        userError?.message ||
          userError?.data?.message ||
          "An error occurred, could not validate user"
      );
      // invalidate
      localStorage.removeItem("axxToken");
    }
  }, [userError]);

  useEffect(() => {
    if (isFetchUserSuccess) {
      setState((state) => ({ ...state, loading: false }));
      const isWalletPinActive = user?.user?.security?.wallet_pin;
      const isAuthApp2faActive =
        user?.user?.security && user?.user?.security["2fa"]
          ? user?.user?.security["2fa"]?.status === "verified"
          : false;
      if (!isWalletPinActive) {
        navigate("/activate-wallet-pin");
      } else if (isAuthApp2faActive) {
        navigate("/verify-2fa");
      } else {
        // sign user in
        showSuccess("Successful 👍");
        navigate(from);
      }
    }
  }, [isFetchUserSuccess, user, navigate, from]);

  const loginUser = async () => {
    if (email !== "" && password !== "") {
      if (email !== signInEmail) {
        showError("Email must match signIn email");
      }

      setState({ ...state, loading: true });
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        // validate
        localStorage.setItem("axxToken", res.user.accessToken);
        setUserSkip(false);

        // rest is handled in useEffect
      } catch (error) {
        handleFirebaseError(error);
        setState({ ...state, loading: false });
      } finally {
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
              Login
            </Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput
              label={"Your email"}
              value={state.email}
              onChange={onChangeEmail}
              readOnly={true}
            />
          </div>
          <div>
            <CustomInput
              label={"Password"}
              type={"password"}
              value={state.password}
              onChange={onChangePassword}
            />
          </div>
          <button className={"forgotBtn"} onClick={forgotPassword}>
            <Text>Forgot password?</Text>
          </button>
          <div>
            <Button
              text={"Login"}
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

export default Login;
