import React, { useState } from "react";
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
import { useFetchProfileQuery } from "../../redux/services/accountApi";

const Mobile =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 4V20H17V4H7ZM6 2H18C18.5523 2 19 2.44772 19 3V21C19 21.5523 18.5523 22 18 22H6C5.44772 22 5 21.5523 5 21V3C5 2.44772 5.44772 2 6 2ZM12 17C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17Z' fill='rgba(16,16,16,1)'%3E%3C/path%3E%3C/svg%3E";

const Mail =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z' fill='rgba(16,16,16,1)'%3E%3C/path%3E%3C/svg%3E";

const QR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M16 17V16H13V13H16V15H18V17H17V19H15V21H13V18H15V17H16ZM21 21H17V19H19V17H21V21ZM3 3H11V11H3V3ZM5 5V9H9V5H5ZM13 3H21V11H13V3ZM15 5V9H19V5H15ZM3 13H11V21H3V13ZM5 15V19H9V15H5ZM18 13H21V15H18V13ZM6 6H8V8H6V6ZM6 16H8V18H6V16ZM16 6H18V8H16V6Z' fill='currentColor'%3E%3C/path%3E%3C/svg%3E";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const [showAuthAppModal, setShowAuthAppModal] = useState(false);
  const [showEmailAuthModal, setShowEmailAuthModal] = useState(false);
  const { handleCopyClick, isCopied } = useCopyToClipBoard();
  const { data: user } = useFetchProfileQuery();

  const isEmail2faActive = user?.user?.security?.email;

  const goBack = () => {
    navigate(-1);
  };

  const emailAuthOnClick = () => {
    if (!emailAuthOnClick) {
      setShowEmailAuthModal(true);
    }
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
                <CustomButtonII
                  text={"Set Up"}
                  variant={"light"}
                  className={"btnSm"}
                />
              }
            />
            <hr className="faintDivider" />
            <ThreeColumnRow
              onClick={() => emailAuthOnClick()}
              title={"Email for Two-Factor Authentication"}
              subtitle={"Use the security code sent to your email as your 2FA"}
              icon={Mail}
              col2Child={
                isEmail2faActive ? (
                  <div className="status-pill pill-success btnSm">Enabled</div>
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

      <Modal
        title={"Enable 2FA Authentication"}
        isOpen={showAuthAppModal}
        onClose={() => setShowAuthAppModal(false)}
        zClass={"tFaModal"}
      >
        <>
          <div className="textLeft text-muted">
            <p>
              Step 1: Download and install an Authenticator App for your phone
              or tablet
            </p>
            <br />
            <p>
              Step 2: Scan below QR code with the app, or you can add account
              manually into the app
            </p>
          </div>
          <hr className="faintDivider" />
          <div className="tFaContent">
            <div>
              <h4 className="mb-1">Manually add account:</h4>
              <p className="mb-1">
                <span className="text-muted fs14">Account Name:</span> Lo3re
                game master
              </p>
              <div className="flexColumn">
                <p className="text-muted">Your Key:</p>{" "}
                <p className="flexRow justifyBetween formInput">
                  <span className="f14">JDKSLWDCCMNDKNDSFM</span>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopyClick("000 000 000 000")}
                  >
                    {isCopied ? <AiOutlineCheck color="green" /> : <LuCopy />}
                  </div>
                </p>
              </div>
            </div>
            <div className="modalQRContainer">
              <img src={QR} alt="" />
            </div>
          </div>
          <hr className="faintDivider" />
          <div>
            <div className="inputContainer">
              <label className="text-start">Enter Authenticator Code</label>
              <input
                type="text"
                placeholder="Enter the code to verify"
                className="formInput"
              />
            </div>
            <CustomButtonII
              text={"Confirm & Enable"}
              className={"w100"}
              centerText={true}
            />
          </div>
        </>
      </Modal>

      <Modal
        title={"Enter Security Code"}
        isOpen={showEmailAuthModal}
        onClose={() => setShowEmailAuthModal(false)}
        zClass={"tFaModal"}
      >
        <div className="inputContainer">
          <label className="text-start text-muted">
            To enable email authentication, please enter the security code we
            emailed to you.
          </label>
          <input
            type="text"
            placeholder="Enter the code to verify"
            className="formInput"
          />
        </div>
        <CustomButtonII
          text={"Confirm & Enable"}
          className={"w100"}
          centerText={true}
        />
      </Modal>
    </>
  );
};

export default TwoFactorAuth;
