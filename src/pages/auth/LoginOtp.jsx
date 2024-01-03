import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import Text from "../../utils/CustomText";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../utils/CustomOtp";

const LoginOtp = () => {
  const [pin, setPin] = useState("");
  const onChange = (value) => {
    setPin(value);
  };

  const navigate = useNavigate();
  const verify = () => {
    navigate("/confirmVerification");
  };
  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          <div className={"verifyHeaderText"}>
            <Text tag={"h2"} className={"f26 boldText"}>
              Kindly enter your verification code
            </Text>
            <Text tag={"p"} style={{ lineHeight: "26px" }} className={"f16 regularText"}>
              To log in, kindly enter the OTP sent to your email{" "}
            </Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div style={{ marginBottom: "16px" }}>
            <OtpInput valueLength={6} value={pin} onChange={onChange} />
          </div>
          <div>
            <Button text={"Log in into your account"} className={"authBtn"} onClick={verify} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginOtp;
