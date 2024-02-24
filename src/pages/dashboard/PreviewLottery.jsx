import React, { useEffect, useState } from "react";
import Camera from "../../assets/images/camera.png";
import HHG from "../../assets/images/hand-holding-gift.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../../utils/Modal";
import { updateAddLotteryForm } from "../../redux/features/generalSlice";
// import { useCreateLotteryMutation } from "../../redux/services/lotteryApi";
// import { showError } from "../../utils/Alert";

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
  // const [createLottery, { isLoading: isCreateLotteryLoading }] =
  //   useCreateLotteryMutation();
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

    setSuccessModal(true);
    dispatch(updateAddLotteryForm({}));

    // await createLottery(fData)
    //   .unwrap()
    //   .then(() => {
    //     //   onSuccess open modal and empty reduxLotteryForm
    //     setSuccessModal(true);
    //     console.log(lotteryForm);
    //     dispatch(updateAddLotteryForm({}));
    //   })
    //   .catch((err) => {
    //     showError(err?.message || err?.data?.message || "An error occurred");
    //   });
  };

  return (
    <>
      <section className="mainContainer">
        <div className={`mainContent ${lotteryStyles.addLottery}`}>
          <p>
            Lotteries<b>/Create Lottery</b>
          </p>
          <header className={lotteryStyles.addLotteryHeader}>
            <h2>Confirm Details</h2>
            <p>
              Please check and confirm that all hte information you've added
              about this lottery is correct
            </p>
          </header>
          <div
            className={`flexRow alignCenter avatarProfileContainer ${lotteryStyles.avatarProfileContainer}`}
          >
            <div className={lotteryStyles.avatar}>
              {localImg ? (
                <img
                  src={localImg || ""}
                  alt=""
                  className={lotteryStyles.fileImg}
                />
              ) : (
                <img src={Camera} alt="" className={lotteryStyles.cameraImg} />
              )}
            </div>
            <div className={lotteryStyles.content}>
              <h3 className="title capitalize">{lotteryForm.lotteryName}</h3>
              <p className="subtitle">
                Jackpot prize: <b>${lotteryForm.jackpotPrize}</b>
              </p>
              <div
                className={`flexRow text-muted mt-2 ${lotteryStyles.formDates}`}
              >
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
          <form className={lotteryStyles.lotteryForm}>
            <div className={`flexRow justifyBetween ${lotteryStyles.col2}`}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Ticket price</label>
                <input
                  type="text"
                  className="formInput"
                  value={"$" + lotteryForm.ticketPrice}
                  readOnly
                  name="ticketPrice"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Ticket capacity</label>
                <input
                  type="number"
                  className="formInput"
                  value={lotteryForm.ticketCapacity}
                  readOnly
                  name="ticketCapacity"
                />
              </div>
            </div>

            <div className={lotteryStyles.formDesc}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Description</label>
                <textarea
                  className="formInput"
                  value={lotteryForm.description}
                  name="description"
                  cols="30"
                  rows="5"
                  readOnly
                ></textarea>
              </div>
            </div>

            <div
              className={`flexRow justifyBetween ${lotteryStyles.col3} ${lotteryStyles.flexRow}`}
            >
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Telegram link</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.telegramLink}
                  placeholder="Optional"
                  name="telegramLink"
                  readOnly
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Facebook link</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.facebookLink}
                  placeholder="Optional"
                  name="facebookLink"
                  readOnly
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>WhatsApp</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.whatsapp}
                  placeholder="Optional"
                  name="whatsapp"
                  readOnly
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Others</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.others}
                  placeholder="Optional"
                  name="others"
                  readOnly
                />
              </div>
            </div>

            <div
              className={`${lotteryStyles.formButtonContainer} ${lotteryStyles.col3} gap-1`}
            >
              <div className={lotteryStyles.btnGroup}>
                <CustomButtonII
                  variant={"light"}
                  text={"Back"}
                  className={`btnLg ${lotteryStyles.backBtn}`}
                  type="button"
                  centerText={true}
                  onClick={() =>
                    navigate("/dashboard/lotteries/add?fromPreview=true", {
                      replace: true,
                    })
                  }
                />
              </div>
              <div className={lotteryStyles.btnGroup}>
                <CustomButtonII
                  variant={"light"}
                  text={"Save to Drafts"}
                  className="btnLg"
                  type="button"
                  readOnly={true}
                  centerText={true}
                />
                <CustomButtonII
                  variant={"primary"}
                  text={"Publish"}
                  className="btnLg"
                  type="button"
                  centerText={true}
                  // loading={isCreateLotteryLoading}
                  onClick={submitForm}
                />
              </div>
            </div>
          </form>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer"}>
          <h3 className="fs17 mediumText">Create Lottery</h3>
          <div className={lotteryStyles.lotterySteps}>
            <div
              className={`cursor-pointer ${lotteryStyles.step}`}
              onClick={() =>
                navigate("/dashboard/lotteries/add?fromPreview=true", {
                  replace: true,
                })
              }
            >
              <div className={lotteryStyles.num}>1</div>
              <p>Lottery details</p>
            </div>
            <div
              className={`cursor-pointer ${lotteryStyles.step} ${lotteryStyles.active}`}
            >
              <div className={lotteryStyles.num}>2</div>
              <p>Preview</p>
            </div>
          </div>
        </aside>
      </section>

      <Modal isOpen={successModal} hideCloseBtn={true} onClose={() => null}>
        <div className={lotteryStyles.packageImg}>
          <img src={HHG} alt="" />
        </div>
        <div className={lotteryStyles.modalText}>
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
