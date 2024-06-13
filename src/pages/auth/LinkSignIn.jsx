import React from "react";
import Logo from "../../assets/images/logo.svg";
import Text from "../../utils/CustomText";
import Button from "../../utils/CustomButton";
import { useLocation } from "react-router-dom/dist";

const LinkSignIn = () => {
  const location = useLocation();
  const data = location.state;
  console.log(data?.data);

  const recipientEmail = `mailto:${data?.data?.email}`;

  const openEmailClient = () => {
    window.location.href = recipientEmail;
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
              {data?.data?.message}
            </Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <Button text={"Go to mail"} className={"authBtn"} onClick={openEmailClient} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LinkSignIn;
