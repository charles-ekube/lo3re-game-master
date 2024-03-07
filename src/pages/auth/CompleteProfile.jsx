import React, { useState } from "react";
import Text from "../../utils/CustomText";
import CustomInput from "../../utils/CustomInput";
import Button from "../../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import { updateProfile, updatePassword } from "firebase/auth";
import { showError, showSuccess } from "../../utils/Alert";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { updateAccessToken } from "../../redux/features/authSlice";
const buffer = require("buffer/").Buffer;

async function generateKeyFromString(str, keySize) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Derive a key from the input data using PBKDF2
  const key = await window.crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive the actual key material using PBKDF2 with SHA-256
  const derivedKey = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(16),
      iterations: 10000,
      hash: "SHA-256",
    },
    key,
    keySize
  );

  // Convert the derived key material to a base64-encoded string
  const base64Key = btoa(
    String.fromCharCode.apply(null, new Uint8Array(derivedKey))
  );
  return base64Key;
}

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    password: "",
    displayName: "",
    confirmPassword: "",
    error: null,
    loading: false,
  });

  const onChangeUserName = (e) => {
    setState({ ...state, displayName: e.target.value });
  };
  const onChangePassword = (e) => {
    setState({ ...state, password: e.target.value });
  };
  const onChangeConfirmPassword = (e) => {
    setState({ ...state, confirmPassword: e.target.value });
  };

  const { password, confirmPassword, displayName } = state;

  const encryptData = async (data, key) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encodedKey = await window.crypto.subtle.importKey(
      "raw",
      buffer.from(key, "base64"),
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      encodedKey,
      encodedData
    );

    return {
      ciphertext: buffer.from(ciphertext).toString("base64"),
      iv: buffer.from(iv).toString("base64"),
    };
  };

  const handleEncrypt = async (token) => {
    try {
      const key = await generateKeyFromString(state.password, 256);
      const { ciphertext, iv } = await encryptData(token, key);
      // validate
      localStorage.setItem("iv", iv);
      localStorage.setItem("accessToken", ciphertext);
      dispatch(updateAccessToken(token));
    } catch (error) {
      console.error("Encryption error:", error);
      showSuccess("Profile updated");
      navigate("/");
    }
  };

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

  const updateUser = async () => {
    if (password !== "" && confirmPassword !== "" && displayName !== "") {
      //implement strong password for account security reasons
      if (password === confirmPassword) {
        setState({ ...state, loading: true });
        try {
          await updateProfile(auth.currentUser, {
            displayName: displayName,
          });
          await updatePassword(auth.currentUser, confirmPassword);
          setState({ ...state, loading: false });
          await handleEncrypt(auth?.currentUser?.accessToken);
          showSuccess("Successful 👍");
          navigate("/dashboard");
        } catch (error) {
          handleFirebaseError(error);
          setState({ ...state, loading: false });
        }
      } else {
        showError("Passwords do not match");
      }
    } else {
      showError("Required fields are missing");
    }
  };

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          {/* <img src={Logo} alt="logo" /> */}
          <div style={{ margin: "32px 0 42px" }}>
            <Text tag={"h2"} className={"boldText"}>
              Kindly complete your profile setup
            </Text>
          </div>
        </header>

        <div className={"formContainer"}>
          <div>
            <CustomInput
              label={"Username"}
              onChange={onChangeUserName}
              value={state.displayName}
            />
          </div>
          <div>
            <CustomInput
              label={"Password"}
              type={"password"}
              onChange={onChangePassword}
              value={state.password}
            />
          </div>
          <div>
            <CustomInput
              label={"Confirm password"}
              type={"password"}
              onChange={onChangeConfirmPassword}
              value={state.confirmPassword}
            />
          </div>
          <div>
            <Button
              text={"Proceed"}
              className={"authBtn"}
              onClick={updateUser}
              loading={state.loading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CompleteProfile;
