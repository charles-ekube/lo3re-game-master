import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import Text from "../../utils/CustomText";
import CustomInput from "../../utils/CustomInput";
import { GoDotFill } from "react-icons/go";
import Button from "../../utils/CustomButton";
import { showError } from "../../utils/Alert";
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

const SleepScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const genIv = localStorage.getItem("iv");
  const cipher = localStorage.getItem("accessToken");
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [formState, setFormState] = useState({
    password: "",
    loading: false,
  });

  const decrypt = async (ciphertext, iv, key) => {
    // prepare the secret key
    const secretKey = await crypto.subtle.importKey(
      "raw",
      buffer.from(key, "base64"),
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    // decrypt the encrypted text "ciphertext" with the secret key and IV
    const cleartext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: buffer.from(iv, "base64"),
      },
      secretKey,
      buffer.from(ciphertext, "base64")
    );

    // decode the text and return it
    return new TextDecoder().decode(cleartext);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (formState.password === "") {
      showError("Password required");
      return;
    }

    try {
      const key = await generateKeyFromString(formState.password, 256);
      const txt = await decrypt(cipher, genIv, key);
      dispatch(updateAccessToken(txt));
      navigate(from, { replace: true });
      //   console.log("decr", txt);
    } catch (error) {
      showError("Incorrect password");
      console.log(error);
    }
    // alert("decryption successful");
  };

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          <div style={{ margin: "32px 0" }}>
            {/* <Text tag={"h2"} className={"boldText"}>
              Login
            </Text> */}
            <div
              className="flexRow alignCenter justifyCenter"
              style={{ gap: "8px" }}
            >
              <GoDotFill color={"#06C167"} />
              <span className="fs18 mediumText text-muted">Active</span>
            </div>
          </div>
        </header>
        <div className={"formContainer"}>
          <div>
            <CustomInput
              label={"Password"}
              type={"password"}
              value={formState.password}
              onChange={({ target }) =>
                setFormState({ ...formState, password: target.value })
              }
            />
          </div>
          <button
            className={"forgotBtn"}
            onClick={() => navigate("/forgotPassword")}
          >
            <Text>Forgot password?</Text>
          </button>
          <div>
            <Button
              text={"Login"}
              className={"authBtn"}
              onClick={submitForm}
              loading={formState.loading}
            />
          </div>
          <div
            className={"flexRow alignCenter justifyCenter"}
            style={{ gap: "5px", margin: "10px 0", cursor: "pointer" }}
          >
            <Text className={"f14"} style={{ color: "#8A8A8A" }}>
              Don’t have an account?{" "}
            </Text>
            <Text
              className={"f14 mediumText"}
              style={{ color: "#101010" }}
              onClick={() => navigate("/signUp")}
            >
              Sign up
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SleepScreen;
