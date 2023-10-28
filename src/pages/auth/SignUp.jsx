import React from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const verify = () => {
    navigate("/verification");
  };
  const login = () => {
    navigate("/");
  };
  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          <button className={"flexRow alignCenter justifyCenter googleAuthBtn"}>
            <img src={GoogleLogo} alt="logo" />
            <Text>Sign up with Google</Text>
          </button>
          <img src={Or} alt="or" style={{ width: "100%" }} />
        </header>
        <div className={"formContainer"}>
          <div className={"flexRow alignCenter justifyBetween"} style={{ gap: "10px" }}>
            <div style={{ width: "100%" }}>
              <CustomInput label={"First name"} />
            </div>
            <div style={{ width: "100%" }}>
              <CustomInput label={"Last name"} />
            </div>
          </div>
          <div>
            <CustomInput label={"Your email"} />
          </div>
          <div>
            <CustomInput label={"Password"} type={"password"} />
          </div>
          <div>
            <CustomInput label={"Confirm password"} type={"password"} />
          </div>
          <div>
            <Button text={"Sign up"} className={"authBtn"} onClick={verify} />
          </div>
          <div className={"flexRow alignCenter justifyCenter"} style={{ gap: "5px", margin: "10px 0" }}>
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
