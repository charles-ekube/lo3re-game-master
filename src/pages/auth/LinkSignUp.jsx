import React from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";

const LinkSignUp = () => {
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
              Check your inbox for our verification email, complete with your verification by clicking on the link within 24 hours.{" "}
            </Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <Button text={"Go to mail"} className={"authBtn"} />
          </div>
          <div className={""} style={{ gap: "5px", margin: "10px 0" }}>
            <Text className={"f14 textCenter"} tag={"p"} style={{ color: "#8A8A8A", margin: "5px 0" }}>
              Don't see the email? Check your spam folder or
            </Text>
            <Text className={"f14 mediumText textCenter"} tag={"p"} style={{ color: "#101010" }}>
              Resend verification email
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LinkSignUp;
