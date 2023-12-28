import React, { useCallback, useEffect, useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomButtonII from "../../utils/CustomButtonII";
import ThreeColumnRow from "../../utils/ThreeColumnRow";
import Modal from "../../utils/Modal";
import { LuCopy } from "react-icons/lu";
import { AiOutlineCheck } from "react-icons/ai";
import useCopyToClipBoard from "../../hooks/useCopyToClipboard";
import {
  accountApi,
  useFetchProfileQuery,
} from "../../redux/services/accountApi";
import {
  useRequestTFAQuery,
  useActivateTFAMutation,
  useDeactivateTFAMutation,
  useActivateEmailMFAMutation,
  useDeactivateEmailMFAMutation,
} from "../../redux/services/twoFAApi";
import Loader from "../../utils/Loader";
import { showError, showSuccess } from "../../utils/Alert.jsx";
import QRCode from "qrcode";
import { useDispatch } from "react-redux";
import http from "../../utils/utils";

const Mobile =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 4V20H17V4H7ZM6 2H18C18.5523 2 19 2.44772 19 3V21C19 21.5523 18.5523 22 18 22H6C5.44772 22 5 21.5523 5 21V3C5 2.44772 5.44772 2 6 2ZM12 17C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17Z' fill='rgba(16,16,16,1)'%3E%3C/path%3E%3C/svg%3E";

const Mail =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z' fill='rgba(16,16,16,1)'%3E%3C/path%3E%3C/svg%3E";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const [showAuthAppModal, setShowAuthAppModal] = useState(false);
  const [showEmailAuthModal, setShowEmailAuthModal] = useState(false);
  const { data: user } = useFetchProfileQuery();

  const isEmail2faActive = user?.user?.security?.email;
  const isAuthApp2faActive = user?.user?.security["2fa"]
    ? user?.user?.security["2fa"]?.status === "verified"
    : false;

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <section className="mainContainer">
        <div className="content">
          <div className="settingHeader">
            <IoIosArrowRoundBack
              size={34}
              className={"arrow-back"}
              onClick={goBack}
            />
            <div className="headerTitle text-center">
              Two-Factor Authentication
            </div>
          </div>

          <div className="settingContent">
            <ThreeColumnRow
              onClick={() => setShowAuthAppModal(true)}
              title={"Two-Factor Authentication App"}
              subtitle={"Use an Authentication App as your 2FA"}
              icon={Mobile}
              col2Child={
                isAuthApp2faActive ? (
                  <CustomButtonII
                    style={{ width: "67px" }}
                    text={"Disable"}
                    variant={"light"}
                    className={"btnSm btnDanger"}
                  />
                ) : (
                  <CustomButtonII
                    text={"Set Up"}
                    variant={"light"}
                    className={"btnSm"}
                  />
                )
              }
            />
            <hr className="faintDivider" />
            <ThreeColumnRow
              onClick={() => setShowEmailAuthModal(true)}
              title={"Email for Two-Factor Authentication"}
              subtitle={"Use the security code sent to your email as your 2FA"}
              icon={Mail}
              col2Child={
                isEmail2faActive ? (
                  <CustomButtonII
                    style={{ width: "67px" }}
                    text={"Disable"}
                    variant={"light"}
                    className={"btnSm btnDanger"}
                  />
                ) : (
                  <CustomButtonII
                    style={{ width: "67px" }}
                    text={"Set Up"}
                    variant={"light"}
                    className={"btnSm"}
                  />
                )
              }
            />
          </div>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer"}>
          <CardSlider />
          <div className={"contactCornerContainer"}>
            <Text tag={"p"} className={"f16 satoshi-bold-text"}>
              Customer corner
            </Text>
            <ContactCard />
          </div>
        </aside>
      </section>

      <TFaModal
        isOpen={showAuthAppModal}
        onClose={() => setShowAuthAppModal(false)}
        is2faActive={isAuthApp2faActive}
      />

      <EmailAuthModal
        isOpen={showEmailAuthModal}
        onClose={() => setShowEmailAuthModal(false)}
        is2faActive={isEmail2faActive}
      />
    </>
  );
};

const EmailAuthModal = ({ isOpen, onClose, is2faActive }) => {
  const [activateTFA, { isLoading: isActivateTFALoading }] =
    useActivateEmailMFAMutation();
  const [deactivateTFA, { isLoading: isDeactivateTFALoading }] =
    useDeactivateEmailMFAMutation();
  const [isEmailRequestLoading, setIsEmailRequestLoading] = useState(false);
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const sendOtp = async () => {
      setIsEmailRequestLoading(true);
      const res = await http.get("auth/mfa/email");
      if (!res?.success) {
        showError("Error, could not send code");
        onClose();
        console.log(res);
      }
      setIsEmailRequestLoading(false);
    };
    if (isOpen) {
      sendOtp();
    }
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (code === "") {
      showError("Enter security code");
      return;
    }

    if (is2faActive) {
      await deactivateTFA({ code })
        .unwrap()
        .then((resp) => {
          console.log(resp);
          showSuccess("Token deactivation successful");
          dispatch(accountApi.util.invalidateTags(["profile"]));
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "");
        });
    } else {
      await activateTFA({ code })
        .unwrap()
        .then((resp) => {
          console.log(resp);
          showSuccess("Token activation successful");
          dispatch(accountApi.util.invalidateTags(["profile"]));
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "");
        });
    }
  };

  return (
    <>
      <Modal
        title={`${is2faActive ? "Disable" : "Enable"} Email Authentication`}
        isOpen={isOpen}
        onClose={onClose}
        zClass={"tFaModal"}
      >
        <Loader
          isLoading={isEmailRequestLoading}
          variety="dark"
          height="100px"
        />
        {!isEmailRequestLoading && (
          <>
            <div className="inputContainer">
              <label className="text-start text-muted">
                To {is2faActive ? "disable" : "enable"} email authentication,
                please enter the security code we emailed to you.
              </label>
              <input
                type="text"
                placeholder="Enter the code to verify"
                className="formInput"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <CustomButtonII
              text={is2faActive ? "Disable" : "Confirm & Enable"}
              className={`w100 ${is2faActive ? "btnDanger" : ""}`}
              centerText={true}
              onClick={handleSubmit}
              loading={isActivateTFALoading || isDeactivateTFALoading}
            />
          </>
        )}
      </Modal>
    </>
  );
};

const TFaModal = ({ isOpen, onClose, is2faActive }) => {
  const [skipTFARequest, setSkipTFARequest] = useState(true);
  const { handleCopyClick, isCopied } = useCopyToClipBoard();
  const [activateTFA, { isLoading: isActivateTFALoading }] =
    useActivateTFAMutation();
  const [deactivateTFA, { isLoading: isDeactivateTFALoading }] =
    useDeactivateTFAMutation();
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const {
    data: tfa,
    isSuccess: isTfaSuccess,
    isLoading: isTfaLoading,
  } = useRequestTFAQuery("", { skip: skipTFARequest });

  useEffect(() => {
    if (isOpen && !is2faActive) {
      setSkipTFARequest(false);
    }
  }, [isOpen, is2faActive]);

  const [qr, setQr] = useState("");
  const GenQRCode = useCallback(() => {
    QRCode.toDataURL(
      tfa ? tfa?.uri || tfa?.binding?.uri : " ",
      {
        width: "100%",
        color: {
          dark: "#000",
          light: "#fff",
        },
      },
      (err, url) => {
        if (err) return console.error(err);

        setQr(url);
      }
    );
  }, [tfa]);

  useEffect(() => {
    if (isTfaSuccess) {
      GenQRCode();
    }
  }, [isTfaSuccess, GenQRCode]);

  const handleSubmit = async () => {
    if (code === "") {
      showError("Enter authenticator code");
      return;
    }

    if (is2faActive) {
      await deactivateTFA({ code })
        .unwrap()
        .then((resp) => {
          console.log(resp);
          showSuccess("Token deactivation successful");
          dispatch(accountApi.util.invalidateTags(["profile"]));
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "");
        });
    } else {
      await activateTFA({ code, secret: tfa?.secret || tfa?.binding?.secret })
        .unwrap()
        .then((resp) => {
          console.log(resp);
          showSuccess("Token activation successful");
          dispatch(accountApi.util.invalidateTags(["profile"]));
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "");
        });
    }
  };

  return (
    <>
      <Modal
        title={`${is2faActive ? "Disable" : "Enable"} 2FA Authentication`}
        isOpen={isOpen}
        onClose={onClose}
        zClass={"tFaModal"}
      >
        {is2faActive ? (
          <div className="inputContainer">
            <label className="text-start text-muted">
              To disable 2FA authentication, please enter the security code from
              your Authenticator App.
            </label>
            <input
              type="text"
              placeholder="Enter the code to verify"
              className="formInput"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        ) : (
          <>
            <Loader isLoading={isTfaLoading} variety="dark" height="100px" />
            {!isTfaLoading && (
              <>
                <div className="textLeft text-muted">
                  <p>
                    Step 1: Download and install an Authenticator App for your
                    phone or tablet
                  </p>
                  <br />
                  <p>
                    Step 2: Scan below QR code with the app, or you can add
                    account manually into the app
                  </p>
                </div>
                <hr className="faintDivider" />
                <div className="tFaContent">
                  <div>
                    <h4 className="mb-1">Manually add account:</h4>
                    <p className="mb-1">
                      <span className="text-muted fs14">Account Name:</span>{" "}
                      {tfa?.friendlyName}
                    </p>
                    <div className="flexColumn">
                      <p className="text-muted">Your Key:</p>{" "}
                      <p className="flexRow justifyBetween formInput">
                        <span className="f12">
                          {tfa?.secret || tfa?.binding?.secret}
                        </span>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleCopyClick(tfa?.secret || tfa?.binding?.secret)
                          }
                        >
                          {isCopied ? (
                            <AiOutlineCheck color="green" />
                          ) : (
                            <LuCopy />
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="modalQRContainer">
                    <img src={qr} alt="" />
                  </div>
                </div>
                <hr className="faintDivider" />
                <div>
                  <div className="inputContainer">
                    <label className="text-start">
                      Enter Authenticator Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the code to verify"
                      className="formInput"
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <CustomButtonII
          text={is2faActive ? "Disable" : "Confirm & Enable"}
          className={`w100 ${is2faActive ? "btnDanger" : ""}`}
          centerText={true}
          onClick={handleSubmit}
          loading={isActivateTFALoading || isDeactivateTFALoading}
        />
      </Modal>
    </>
  );
};

export default TwoFactorAuth;
