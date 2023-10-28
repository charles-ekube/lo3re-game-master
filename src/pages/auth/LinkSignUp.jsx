import React from "react";

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
              Check your inbox for our verification email, complete with your verification with your unique code within 24 hours.
            </Text>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <Button text={"Verify"} className={"authBtn"} onClick={verify} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LinkSignUp;
