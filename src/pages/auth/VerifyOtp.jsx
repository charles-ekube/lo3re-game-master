import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../utils/CustomOtp";

const VerifyOtp = () => {
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
              Unlock Your Lucky Streak🍀✨
            </Text>
            <Text tag={"p"} style={{ lineHeight: "26px" }} className={"f16 regularText"}>
              Check your inbox for our verification email, complete with your verification with your unique code within 24 hours.
            </Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div style={{ marginBottom: "16px" }}>
            <OtpInput valueLength={6} value={pin} onChange={onChange} />
          </div>
          <div>
            <Button text={"Verify"} className={"authBtn"} onClick={verify} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default VerifyOtp;
