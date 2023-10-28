import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import Speaker from "../../assets/images/speaker.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../utils/CustomOtp";

const ConfirmVerify = () => {
  const [pin, setPin] = useState("");
  const onChange = (value) => {
    setPin(value);
  };
  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
        </header>
        <div className={"verifyHeaderText"}>
          <div style={{ textAlign: "center" }}>
            <img src={Speaker} alt="speaker" style={{ margin: "10px" }} />
          </div>
          <Text tag={"h2"} className={"f26 boldText textCenter"}>
            Your email has been verified✨
          </Text>
          <Text tag={"p"} style={{ lineHeight: "26px" }} className={"f16 regularText textCenter"}>
            You’ve successfully verified your email. Just one more step and you’re good to go!
          </Text>
        </div>

        <div className={"formContainer"}>
          <div>
            <Button text={"Proceed"} className={"authBtn"} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ConfirmVerify;
