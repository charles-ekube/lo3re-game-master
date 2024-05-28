import React, { useEffect, useState } from "react";
import Camera from "../../assets/images/camera.png";
import HHG from "../../assets/images/hand-holding-gift.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../../utils/Modal";
import { updateAddLotteryForm } from "../../redux/features/generalSlice";
import { FaCheck } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  useCreateGameMutation,
  useDraftAGameMutation,
} from "../../redux/services/gameApi";
import { showError } from "../../utils/Alert";
import ConfettiExplosion from "react-confetti-explosion";
import { useFetchWalletBalanceQuery } from "../../redux/services/walletApi";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { getImage, imageDb } from "../../firebase";
import { v4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import useTextTruncate from "../../hooks/useTextTruncate";

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
  const [file, setFile] = useState();
  const dispatch = useDispatch();
  const [successModal, setSuccessModal] = useState(false);
  const lotteryForm = useSelector((state) => state.general.addLotteryForm);
  const [gameId, setGameId] = useState("");
  const { dateSubmitFormat } = useTimeFormatter();
  const { formatMoney } = useTextTruncate();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadDraftLoading, setUploadDraftLoading] = useState(false);
  const {
    data: walletBalance,
    isLoading: isWalletBalanceLoading,
    isError: isWalletError,
  } = useFetchWalletBalanceQuery();
  const [createGame, { isLoading: isCreateGameLoading }] =
    useCreateGameMutation();
  const [draftGameMutation, { isLoading: isDraftGameLoading }] =
    useDraftAGameMutation();
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

    setFile(photo);
  }, []);

  const draftGame = async () => {
    const {
      title,
      description,
      startOn,
      endOn,
      jackpot,
      ticketGoal,
      ticketPrice,
    } = lotteryForm;
    const mainWallet = walletBalance?.filter(
      (val) => val?.type?.toLowerCase() === "main"
    );

    const fData = {
      title,
      description,
      startOn: dateSubmitFormat(startOn),
      endOn: dateSubmitFormat(endOn),
      jackpot: Number(jackpot),
      ticketGoal: Number(ticketGoal),
      ticketPrice: Number(ticketPrice),
      coverUrl: "",
      cause: lotteryForm.cause,
      walletId: mainWallet.length ? mainWallet[0]?.id : null,
      socials: {
        facebook: lotteryForm.facebook,
        twitter: lotteryForm.twitter,
        telegram: lotteryForm.telegram,
        whatsapp: lotteryForm.whatsapp,
        others: lotteryForm.others,
      },
    };

    if (!isWalletError) {
      if (!mainWallet.length || !mainWallet[0]?.id) {
        showError("An error occured, try again later");
        console.log("Could not fetch main wallet");
        return;
      }
    }

    setUploadDraftLoading(true);
    await uploadBytes(storageRef, file)
      .then(async (snapshot) => {
        // console.log(snapshot);
        const photoUrl = snapshot?.metadata?.fullPath;
        await getImage(photoUrl).then((url) => {
          fData.coverUrl = url;
          setUploadDraftLoading(false);
        });
      })
      .catch((err) => {
        setUploadDraftLoading(false);
        console.log(err);
      });

    await draftGameMutation(fData)
      .unwrap()
      .then((resp) => {
        //   open onSuccess modal and empty reduxLotteryForm
        setGameId(resp?.data?.game?.id);
        setSuccessModal(true);
        dispatch(updateAddLotteryForm({}));
      })
      .catch((err) => {
        showError(err?.message || err?.data?.message || "An error occurred");
        console.log(err);
      });
  };

  const storageRef = ref(imageDb, `uploads/${v4()}`);
  const submitForm = async () => {
    const {
      title,
      description,
      startOn,
      endOn,
      jackpot,
      ticketGoal,
      ticketPrice,
    } = lotteryForm;
    const mainWallet = walletBalance?.filter(
      (val) => val?.type?.toLowerCase() === "main"
    );

    const fData = {
      title,
      description,
      startOn: dateSubmitFormat(startOn),
      endOn: dateSubmitFormat(endOn),
      jackpot: Number(jackpot),
      ticketGoal: Number(ticketGoal),
      ticketPrice: Number(ticketPrice),
      coverUrl: "",
      cause: lotteryForm.cause,
      walletId: mainWallet.length ? mainWallet[0]?.id : null,
      socials: {
        facebook: lotteryForm.facebook,
        twitter: lotteryForm.twitter,
        telegram: lotteryForm.telegram,
        whatsapp: lotteryForm.whatsapp,
        others: lotteryForm.others,
      },
    };

    if (!isWalletBalanceLoading) {
      if (!mainWallet.length || !mainWallet[0]?.id) {
        showError("An error occured, try again later");
        console.log("Could not fetch main wallet");
        return;
      }
    }

    setUploadLoading(true);
    await uploadBytes(storageRef, file)
      .then(async (snapshot) => {
        // console.log(snapshot);
        const photoUrl = snapshot?.metadata?.fullPath;
        await getImage(photoUrl).then((url) => {
          fData.coverUrl = url;
          setUploadLoading(false);
        });
      })
      .catch((err) => {
        setUploadLoading(false);
        console.log(err);
      });

    await createGame(fData)
      .unwrap()
      .then((resp) => {
        //   open onSuccess modal and empty reduxLotteryForm
        setGameId(resp?.data?.game?.id);
        setSuccessModal(true);
        dispatch(updateAddLotteryForm({}));
      })
      .catch((err) => {
        showError(err?.message || err?.data?.message || "An error occurred");
        console.log(err);
      });
  };

  return (
    <>
      <section className="mainContainer w75-25">
        <div className={`mainContent ${lotteryStyles.addLottery}`}>
          <IoIosArrowRoundBack
            size={34}
            className={"cursor-pointer"}
            onClick={() =>
              navigate("/dashboard/lotteries/add?fromPreview=true", {
                replace: true,
              })
            }
            style={{ marginBottom: "16px" }}
          />
          <header className={lotteryStyles.addLotteryHeader}>
            <h2>Confirm Details</h2>
            <p>
              Please check and confirm that all the information you've added
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
              <h3 className="title capitalize">{lotteryForm.title}</h3>
              <p className="subtitle">
                Jackpot prize: <b>${formatMoney(lotteryForm.jackpot)}</b>
              </p>
              <p className="subtitle">
                Cause: <b>{lotteryForm.cause}</b>
              </p>
              <div
                className={`flexRow text-muted mt-2 ${lotteryStyles.formDates}`}
              >
                <p className="me10 f14">
                  Start date:{" "}
                  {lotteryForm.startOn?.toLocaleString(undefined, {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="f14">
                  End date:{" "}
                  {lotteryForm.endOn?.toLocaleString(undefined, {
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
                  value={"$" + formatMoney(lotteryForm.ticketPrice)}
                  readOnly
                  name="ticketPrice"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Ticket goal</label>
                <input
                  type="text"
                  className="formInput"
                  value={`$${formatMoney(lotteryForm.ticketGoal)}`}
                  readOnly
                  name="ticketGoal"
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
                  value={lotteryForm.telegram}
                  placeholder="Optional"
                  name="telegram"
                  readOnly
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Facebook link</label>
                <input
                  type="text"
                  className="formInput"
                  value={lotteryForm.facebook}
                  placeholder="Optional"
                  name="facebook"
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
              className={`${lotteryStyles.formButtonContainer} ${lotteryStyles.addGame}`}
            >
              <CustomButtonII
                variant={"ghost"}
                text={"Save to Drafts"}
                className="btnLg me10"
                type="button"
                readOnly={true}
                centerText={true}
                loading={isDraftGameLoading || uploadDraftLoading}
                onClick={draftGame}
              />
              <CustomButtonII
                variant={"primary"}
                text={"Publish"}
                className="btnLg"
                type="button"
                centerText={true}
                loading={isCreateGameLoading || uploadLoading}
                onClick={submitForm}
              />
            </div>
          </form>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer hideOnMobile"}>
          <h3 className="fs17 boldText">Create Lottery</h3>
          <div className={lotteryStyles.lotterySteps}>
            <div
              className={`cursor-pointer ${lotteryStyles.step} ${lotteryStyles.active}`}
              onClick={() =>
                navigate("/dashboard/lotteries/add?fromPreview=true", {
                  replace: true,
                })
              }
            >
              <div className={lotteryStyles.num}>
                <FaCheck fontSize={"14px"} />
              </div>
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

      <Modal
        isOpen={successModal}
        hideCloseBtn={true}
        onClose={() => null}
        zClass={"z600"}
        glassOverlay={true}
      >
        <div className={lotteryStyles.packageImg}>
          <img src={HHG} alt="" />
        </div>
        <div className={lotteryStyles.modalText}>
          <ConfettiExplosion
            zIndex={1500}
            force={0.8}
            duration={3000}
            particleCount={250}
            width={1600}
          />
          <h2 className="satoshi-text">Package Secured</h2>
          <p>
            Your lottery has been set up and is now awaiting approval. Our team
            will review it shortly.
          </p>
        </div>

        <div className="modalFooter">
          <div className="flexRow justifyCenter">
            <CustomButtonII
              text={"Proceed to game"}
              variant={"primary"}
              onClick={() =>
                navigate(`/dashboard/lotteries/view-single-game/${gameId}`)
              }
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PreviewLottery;
