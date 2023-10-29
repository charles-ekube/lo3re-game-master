import React from "react";
import Logo from "../../assets/images/logo.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

const CreatePassword = () => {
  const navigate = useNavigate();
  const reset = () => {
    navigate("/resetDone");
  };
  const login = () => {
    navigate("/");
  };

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          <div style={{ margin: "32px 0" }}>
            <Text tag={"h2"} className={"boldText"}>
              Forgot Password
            </Text>
            <Text tag={"p"}>Your new password should be different from passwords previously used</Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput label={"Password"} type={"password"} />
          </div>
          <div>
            <CustomInput label={"Confirm Password"} type={"password"} />
          </div>
          <div>
            <Button text={"Confirm"} className={"authBtn"} onClick={reset} />
          </div>
          <div className={"flexRow alignCenter justifyCenter"} style={{ gap: "5px", margin: "20px 0" }} onClick={login}>
            <GoArrowLeft color="#8A8A8A" />
            <Text className={"f14 mediumText"} style={{ color: "#8A8A8A" }}>
              Back to Login
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreatePassword;
