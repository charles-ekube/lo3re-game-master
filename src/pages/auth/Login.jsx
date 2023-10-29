import React from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";

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
          <button className={"flexRow alignCenter justifyCenter googleAuthBtn"}>
            <img src={GoogleLogo} alt="logo" />
            <Text className={"satoshi-medium-text"}>Continue with Google</Text>
          </button>
          <img src={Or} alt="or" style={{ width: "100%" }} />
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput label={"Your email"} />
          </div>
          <div>
            <CustomInput label={"Password"} type={"password"} />
          </div>
          <button className={"forgotBtn"} onClick={forgotPassword}>
            <Text>Forgot password?</Text>
          </button>
          <div>
            <Button text={"Login"} className={"authBtn"} onClick={verify} />
          </div>
          <div className={"flexRow alignCenter justifyCenter"} style={{ gap: "5px", margin: "10px 0" }}>
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
