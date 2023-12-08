import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showError } from "../../utils/Alert";
import {
  verifyPasswordResetCode,
  applyActionCode,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "../../firebase";
import Logo from "../../assets/images/logo.svg";
import Text from "../../utils/CustomText";
import Button from "../../utils/CustomButton";

const HandleEmailActions = () => {
  const location = useLocation();
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFirebaseError = (firebaseError) => {
    if (firebaseError.code && firebaseError.message) {
      const errorMessage = firebaseError.message;

      // Check if the message starts with the expected prefix
      if (errorMessage.startsWith("Firebase: Error (")) {
        // Extract the part after the prefix
        const startIndex = "Firebase: Error (".length;
        const endIndex = errorMessage.indexOf(")");
        showError(errorMessage.substring(startIndex, endIndex));
      } else {
        showError(errorMessage);
      }
    } else {
      showError("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    // Extracting query parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    console.log(searchParams);
    // Get the action to complete.
    const mode = searchParams.get("mode");
    // Get the one-time code from the query parameter.
    const actionCode = searchParams.get("oobCode");
    // (Optional) Get the continue URL & apiKey from the query parameter if available.
    const continueUrl = searchParams.get("continueUrl");
    const apiKey = searchParams.get("apiKey");
    // (Optional) Get the language code if available.
    const lang = searchParams.get("lang") || "en";
    if (mode) {
      switch (mode) {
        case "resetPassword":
          // Display reset password handler and UI.
          handleResetPassword(auth, actionCode, continueUrl, lang);
          break;

        case "verifyEmail":
          // Display email verification handler and UI.
          handleVerifyEmail(auth, actionCode, continueUrl, lang);
          break;

        case "signIn":
          handleSignInUser(auth);
          break;

        default:
          showError("Action unknown");
        // Error: invalid mode.
      }
    }
  }, [location.search]);

  function handleResetPassword(auth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.

    // Verify the password reset code is valid.
    verifyPasswordResetCode(auth, actionCode)
      .then((email) => {
        // const accountEmail = email;
        navigate(`/createPassword?actionCode=${actionCode}`);
      })
      .catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        console.log(error);
        handleFirebaseError(error);
      });
  }

  function handleSignInUser(auth) {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          setMessage(
            "🟢 Login successful, you will be redirected to your dashboard"
          );
          window.localStorage.removeItem("emailForSignIn");
          // console.log(result)
          window.localStorage.setItem("accessToken", result.user.accessToken);
          navigate(`/dashboard`);
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.log("email signin", error);
          handleFirebaseError(error);
        });
    }
  }

  function handleVerifyEmail(auth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.
    applyActionCode(auth, actionCode)
      .then((resp) => {
        console.log("verify email", resp);
        setMessage("🟢 Email confirmation successful");
        setRedirectUrl("/");
      })
      .catch((error) => {
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
        console.log(error);
        handleFirebaseError(error);
      });
  }

  const redirect = () => {
    window.location.href = redirectUrl;
  };

  return (
    <>
      {/* implement custom UI here */}
      <main className={"authMainContainer"}>
        <section className={"authContainer"}>
          <header>
            <img src={Logo} alt="logo" />
            <div className={"verifyHeaderText"}>
              <Text tag={"h2"} className={"f26 boldText"}>
                Unlock Your Lucky Streak🍀✨
              </Text>
              <Text
                tag={"p"}
                style={{ lineHeight: "26px" }}
                className={"f16 regularText"}
              >
                {message}
              </Text>
            </div>
          </header>
          <div className={"formContainer"}>
            {redirectUrl && (
              <div>
                <Button
                  text={"Login"}
                  className={"authBtn"}
                  onClick={redirect}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default HandleEmailActions;
