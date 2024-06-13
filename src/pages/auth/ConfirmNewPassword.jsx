import React from "react";
import Logo from "../../assets/images/logo.svg";
import Thumbs from "../../assets/images/thumbs.svg";
import Text from "../../utils/CustomText";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";

const ConfirmNewPassword = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/");
  };
  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
        </header>
        <div className={"verifyHeaderText"}>
          <div style={{ textAlign: "center" }}>
            <img src={Thumbs} alt="speaker" style={{ margin: "10px" }} />
          </div>
          <Text tag={"h2"} className={"f26 boldText textCenter"}>
            Password Reset!
          </Text>
          <Text
            tag={"p"}
            style={{ lineHeight: "26px" }}
            className={"f16 regularText textCenter"}
          >
            You’ve successfully reset your password, click below to continue
            your access
          </Text>
        </div>

        <div className={"formContainer"}>
          <div>
            <Button text={"Continue"} className={"authBtn"} onClick={login} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ConfirmNewPassword;
