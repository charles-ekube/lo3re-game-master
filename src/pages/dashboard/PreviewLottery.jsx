import React, { useEffect, useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Camera from "../../assets/images/camera.png";
import HHG from "../../assets/images/hand-holding-gift.png";
import "../../assets/styles/lotteries.css";
import CustomButtonII from "../../utils/CustomButtonII";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../../utils/Modal";
import { updateAddLotteryForm } from "../../redux/features/generalSlice";
import { useCreateLotteryMutation } from "../../redux/services/lotteryApi";
import { showError } from "../../utils/Alert";

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new File(byteArrays, "lottery-photo", { type: contentType });
}

const PreviewLottery = () => {
  const navigate = useNavigate();
  // const [file, setFile] = useState();
  const dispatch = useDispatch();
  const [successModal, setSuccessModal] = useState(false);
  const lotteryForm = useSelector((state) => state.general.addLotteryForm);
  const [createLottery, { isLoading: isCreateLotteryLoading }] =
    useCreateLotteryMutation();
  const localImg = localStorage["lotteryPhoto"];

  const getPhoto = () => {
    let base64 = localStorage["lotteryPhoto"];
    let file = undefined;
    if (base64) {
      let base64Parts = base64.split(",");
      let fileFormat = base64Parts[0].split(";")[0].split(":")[1];
      let fileContent = base64Parts[1];
      file = b64toBlob(fileContent, fileFormat);
    }

    return file;
  };

  useEffect(() => {
    const photo = getPhoto();
    // console.log(photo);
    if (!photo) {
      return;
    }

    // setFile(photo);
  }, []);

  const submitForm = async () => {
    const fData = new FormData();

    fData.append("title", lotteryForm.lotteryName);
    fData.append("description", lotteryForm.description);
    fData.append("cause", "");
    fData.append("ticket_price", lotteryForm.ticketPrice);
    fData.append("jackpot", lotteryForm.jackpotPrize);
    fData.append("ticket_goal", lotteryForm.ticketCapacity);
    fData.append("starts_on", lotteryForm.lotteryStarts);
    fData.append("ends_on", lotteryForm.lotteryEnds);
    fData.append(
      "socials",
      JSON.stringify({
        facebook: lotteryForm.facebookLink,
        telegram: lotteryForm.telegramLink,
        whatsapp: lotteryForm.whatsapp,
        others: lotteryForm.others,
      })
    );

    await createLottery(fData)
      .unwrap()
      .then(() => {
        //   onSuccess open modal and empty reduxLotteryForm
        setSuccessModal(true);
        console.log(lotteryForm);
        dispatch(updateAddLotteryForm({}));
      })
      .catch((err) => {
        showError(err?.message || err?.data?.message || "An error occurred");
      });
  };

  return (
    <>
      <section className="mainContainer">
        <div className="mainContent addLottery">
          <p>
            Lotteries<b>/Create Lottery</b>
          </p>
          <header className="addLotteryHeader">
            <h2>Confirm Details</h2>
            <p>
              Please check and confirm that all hte information you've added
              about this lottery is correct
            </p>
          </header>
          <div className="flexRow alignCenter avatarProfileContainer">
            <div className="avatar">
              {localImg ? (
                <img src={localImg || ""} alt="" className="fileImg" />
              ) : (
                <img src={Camera} alt="" className="cameraImg" />
              )}
            </div>
            <div>
              <h3 className="title capitalize">{lotteryForm.lotteryName}</h3>
              <p className="subtitle">
                Jackpot prize: <b>${lotteryForm.jackpotPrize}</b>
              </p>
              <div className="flexRow text-muted mt-2">
                <p className="me10 f14">
                  Start date:{" "}
                  {lotteryForm.lotteryStarts?.toLocaleString(undefined, {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="f14">
                  End date:{" "}
                  {lotteryForm.lotteryEnds?.toLocaleString(undefined, {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          <form className="lotteryForm">
            <div className="flexRow justifyBetween col2">
              <div className="inputContainer">
                <label>Ticket price</label>
                <input
                  type="text"
                  className="formInput"
                  value={"$" + lotteryForm.ticketPrice}
                  disabled
                  name="ticketPrice"
                />
              </div>
              <div className="inputContainer">
                <label>Ticket capacity</label>
                <input
                  type="number"
                  className="formInput"
                  value={lotteryForm.ticketCapacity}
                  disabled
                  name="ticketCapacity"
                />
              </div>
            </div>

            <div className="formDesc">
              <div className="inputContainer">
                <label>Description</label>
                <textarea
                  className="formInput"
                  value={lotteryForm.description}
                  name="description"
                  cols="30"
                  rows="5"
                  disabled
                ></textarea>
              </div>
            </div>

            <div className="flexRow justifyBetween col3">
              <div className="inputContainer">
                <label>Telegram link</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.telegramLink}
                  placeholder="Optional"
                  name="telegramLink"
                  disabled
                />
              </div>
              <div className="inputContainer">
                <label>Facebook link</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.facebookLink}
                  placeholder="Optional"
                  name="facebookLink"
                  disabled
                />
              </div>
              <div className="inputContainer">
                <label>WhatsApp</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.whatsapp}
                  placeholder="Optional"
                  name="whatsapp"
                  disabled
                />
              </div>
              <div className="inputContainer">
                <label>Others</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.others}
                  placeholder="Optional"
                  name="others"
                  disabled
                />
              </div>
            </div>

            <div className="formButtonContainer col3 gap-1">
              <div className="btnGroup">
                <CustomButtonII
                  variant={"light"}
                  text={"Back"}
                  className="btnLg backBtn"
                  type="button"
                  onClick={() =>
                    navigate("/dashboard/lotteries/add?fromPreview=true", {
                      replace: true,
                    })
                  }
                />
              </div>
              <div className="btnGroup">
                <CustomButtonII
                  variant={"light"}
                  text={"Save to Drafts"}
                  className="btnLg"
                  type="button"
                  disabled={true}
                />
                <CustomButtonII
                  variant={"primary"}
                  text={"Publish"}
                  className="btnLg"
                  type="button"
                  loading={isCreateLotteryLoading}
                  onClick={submitForm}
                />
              </div>
            </div>
          </form>
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

      <Modal isOpen={successModal} hideCloseBtn={true} onClose={() => null}>
        <div className="packageImg">
          <img src={HHG} alt="" />
        </div>
        <div className="text">
          <h2 className="satoshi-text">Package Secured</h2>
          <p>
            Your lottery has been set up and is now awaiting approval. Our team
            will review it shortly.
          </p>
        </div>

        <div className="modalFooter">
          <div className="flexRow justifyCenter">
            <CustomButtonII
              text={"Go to dashboard"}
              variant={"primary"}
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PreviewLottery;
