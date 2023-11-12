import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.svg";
import Speaker from "../../assets/images/speaker.svg";
import GoogleLogo from "../../assets/images/google.svg";
import Text from "../../utils/CustomText";
import Or from "../../assets/images/or.svg";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "../../utils/CustomOtp";
import { getAuth } from "firebase/auth";

const ConfirmVerify = () => {
  const [pin, setPin] = useState("");
  const onChange = (value) => {
    setPin(value);
  };
  const navigate = useNavigate();
  const selectProfile = () => {
    navigate("/selectProfile");
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const apiKey = searchParams.get("apiKey");

  const [apiKeyContent, setApiKeyContent] = useState("");

  const getUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
    }
  };

  const renderTemplate = () => {
    if (apiKey) {
      return (
        <div>
          <div className={"verifyHeaderText"}>
            <div style={{ textAlign: "center" }}>
              <img src={Speaker} alt="speaker" style={{ margin: "10px" }} />
            </div>
            <Text tag={"h2"} className={"f26 boldText textCenter"}>
              Your email has been verified✨Login
            </Text>
            <Text tag={"p"} style={{ lineHeight: "26px" }} className={"f16 regularText textCenter"}>
              You’ve successfully verified your email. Just one more step and you’re good to go!
            </Text>
          </div>

          <div className={"formContainer"}>
            <div>
              <Button text={"Proceed"} className={"authBtn"} onClick={selectProfile} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
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
              <Button text={"Proceed"} className={"authBtn"} onClick={selectProfile} />
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (apiKey) {
      getUser();
    }
    //  if (apiKey) {
    //    // Display "Login Successful" logic
    //    console.log("Login Successful");
    //  } else {
    //    // Display "Email Verified" logic
    //    console.log("Email Verified");
    //  }

    //  // Store the apiKey content in state for future use
    //  setApiKeyContent(apiKey || "");
  }, [apiKey]);

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
        </header>
        {renderTemplate()}
      </section>
    </main>
  );
};

export default ConfirmVerify;
