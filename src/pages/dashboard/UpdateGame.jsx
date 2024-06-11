import React, { useEffect, useRef, useState } from "react";
import Camera from "../../assets/images/camera.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import DatePicker from "react-datepicker";
import { showError, showSuccess } from "../../utils/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  useUpdateDraftGameMutation,
  useUpdateGameMutation,
} from "../../redux/services/gameApi";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { getImage, imageDb } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import CustomCheckbox from "../../utils/CustomCheckbox";

const UpdateGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const game = location.state?.game;
  const isDraft = location.state?.isDraft;
  // console.log(game);
  const fileElement = useRef(null);

  const [file, setFile] = useState();
  const [preview, setPreview] = useState(undefined);
  const [updateGame, { isLoading: isUpdateGameLoading }] =
    useUpdateGameMutation();
  const [updateDraftGame, { isLoading: isUpdateDraftGameLoading }] =
    useUpdateDraftGameMutation();
  const { dateSubmitFormat } = useTimeFormatter();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formState, setFormState] = useState({
    coverUrl: game?.coverUrl,
    title: game?.title,
    description: game?.description,
    cause: game?.cause,
    ticketPrice: game?.ticketPrice,
    jackpot: game?.jackpot,
    ticketGoal: game?.ticketGoal,
    infinite: Boolean(game?.infinite),
    startOn: new Date(game?.startOn),
    endOn: new Date(game?.endOn),
    telegram: game?.socials?.telegram,
    facebook: game?.socials?.facebook,
    whatsapp: game?.socials?.whatsapp,
    others: game?.socials?.others,
  });

  const handleFile = (e) => {
    let images = e.target.files;

    const allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
    if (!allowedExtensions.exec(e.target.value)) {
      showError("Invalid file type");
      return false;
    }

    const TwoMB = 2000000;
    if (images?.length) {
      if (images[0].size >= TwoMB) {
        showError("File must be less than 2MB");
        return;
      } else {
        setFile(images[0]);
      }
    }
  };

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const clickFileElem = () => {
    if (fileElement.current) {
      fileElement.current.click();
    }
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormState({ ...formState, [name]: value });
  };

  const resetForm = () => {
    setFormState({
      ...formState,
      title: game?.title,
      description: game?.description,
      cause: game?.cause,
      ticketPrice: game?.ticketPrice,
      jackpot: game?.jackpot,
      ticketGoal: game?.ticketGoal,
      infinite: Boolean(game?.infinite),
      startOn: new Date(game?.startOn),
      endOn: new Date(game?.endOn),
      telegram: game?.socials?.telegram,
      facebook: game?.socials?.facebook,
      whatsapp: game?.socials?.whatsapp,
      others: game?.socials?.others,
    });

    setFile(undefined);
  };

  const storageRef = ref(imageDb, `uploads/${v4()}`);
  const submitForm = async () => {
    if (
      formState.title !== "" &&
      formState.ticketPrice !== "" &&
      formState.jackpot !== "" &&
      formState.ticketGoal !== "" &&
      formState.startOn !== "" &&
      formState.endOn !== "" &&
      formState.description !== ""
    ) {
      const {
        title,
        description,
        startOn,
        endOn,
        jackpot,
        ticketGoal,
        ticketPrice,
        coverUrl,
        cause,
      } = formState;

      const fData = {
        title,
        description,
        coverUrl,
        cause,
        startOn: dateSubmitFormat(startOn),
        endOn: dateSubmitFormat(endOn),
        jackpot: Number(jackpot),
        ticketGoal: Number(ticketGoal),
        ticketPrice: Number(ticketPrice),
        gid: game?.id,
        socials: {
          facebook: formState.facebook,
          telegram: formState.telegram,
          whatsapp: formState.whatsapp,
          others: formState.others,
        },
      };

      if (file) {
        setUploadLoading(true);
        console.log("uploading photo");
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
      }

      if (!isDraft) {
        await updateGame(fData)
          .unwrap()
          .then(() => {
            showSuccess("Game updated successfully");
            navigate("/dashboard/lotteries");
          })
          .catch((err) => {
            showError(
              err?.message ||
                err?.data?.message ||
                "An error occurred, try again later"
            );
            console.log(err);
          });
      } else {
        await updateDraftGame(fData)
          .unwrap()
          .then(() => {
            showSuccess("Game updated successfully");
            navigate("/dashboard/lotteries");
          })
          .catch((err) => {
            showError(
              err?.message ||
                err?.data?.message ||
                "An error occurred, try again later"
            );
            console.log(err);
          });
      }
    } else {
      showError("Required fields are missing");
    }
  };

  return (
    <>
      <section className="mainContainer no-aside">
        <div className={`mainContent ${lotteryStyles.addLottery}`}>
          <IoIosArrowRoundBack
            size={34}
            className={"cursor-pointer"}
            onClick={() => navigate(-1)}
            style={{ marginBottom: "16px" }}
          />
          <header className={lotteryStyles.addLotteryHeader}>
            <h2>Update lottery</h2>
          </header>
          <div
            className={`flexRow alignCenter avatarProfileContainer ${lotteryStyles.avatarProfileContainer}`}
          >
            <div className={lotteryStyles.avatar}>
              {preview || formState.coverUrl ? (
                <img
                  src={preview || formState.coverUrl || ""}
                  alt=""
                  className={lotteryStyles.fileImg}
                />
              ) : (
                <img src={Camera} alt="" className={lotteryStyles.cameraImg} />
              )}
            </div>
            <div className={lotteryStyles.content}>
              <button
                className={`uploadBtn ${lotteryStyles.uploadBtn}`}
                onClick={clickFileElem}
              >
                Upload cover photo
              </button>
              <input
                type="file"
                onChange={handleFile}
                ref={fileElement}
                accept="image/*"
                name="pic"
                style={{ display: "none" }}
              />
              <p className="text-muted uploadText">
                At least 800 x 800 px recommended. <br /> JPG or PNG allowed
              </p>
            </div>
          </div>
          <form className={lotteryStyles.lotteryForm}>
            <div className={`flexRow justifyBetween ${lotteryStyles.col3}`}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Lottery Name</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.title}
                  onChange={handleOnChange}
                  name="title"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Ticket price</label>
                <input
                  type="number"
                  className="formInput"
                  value={formState.ticketPrice}
                  onChange={handleOnChange}
                  name="ticketPrice"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Jackpot prize</label>
                <input
                  type="number"
                  className="formInput"
                  value={formState.jackpot}
                  onChange={handleOnChange}
                  name="jackpot"
                />
              </div>
            </div>

            <div className={`flexRow justifyBetween ${lotteryStyles.col3}`}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <div
                  className="flexRow alignCenter"
                  style={{ gap: "5px", marginBottom: "8px" }}
                >
                  <label className="mb-0">Ticket goal</label>
                  <div
                    className="tooltip"
                    data-tooltip="Minimum number of tickets that need to be sold for the lottery game to be considered valid. If the minimum ticket sale is not reached by the end date, the game may be canceled or extended."
                  >
                    <IoIosInformationCircleOutline color="#888" />
                  </div>
                </div>
                <input
                  type="number"
                  className="formInput"
                  value={formState.ticketGoal}
                  onChange={handleOnChange}
                  name="ticketGoal"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <div
                  className="flexRow alignCenter"
                  style={{ gap: "5px", marginBottom: "8px" }}
                >
                  <label className="mb-0">Lottery starts</label>
                  <span
                    className="tooltip"
                    data-tooltip="Date when the lottery game officially begins. Participants can buy tickets and enter the game once it has started."
                  >
                    <IoIosInformationCircleOutline color="#888" />
                  </span>
                </div>
                <DatePicker
                  showTimeSelect
                  selected={formState.startOn}
                  onChange={(date) =>
                    setFormState({ ...formState, startOn: date })
                  }
                  className="formInput"
                  minDate={new Date()}
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <div
                  className="flexRow alignCenter"
                  style={{ gap: "5px", marginBottom: "8px" }}
                >
                  <label className="mb-0">Lottery ends</label>
                  <span
                    className="tooltip"
                    data-tooltip="Date when the lottery game concludes. After this deadline, no more tickets can be purchased, and the winners will be determined based on the game's rules."
                  >
                    <IoIosInformationCircleOutline color="#888" />
                  </span>
                </div>
                <DatePicker
                  showTimeSelect
                  selected={formState.endOn}
                  onChange={(date) =>
                    setFormState({ ...formState, endOn: date })
                  }
                  className="formInput"
                  minDate={new Date()}
                />
              </div>
            </div>

            <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
              <label>Cause</label>
              <input
                type="text"
                className="formInput"
                value={formState.cause}
                onChange={handleOnChange}
                name="cause"
              />
            </div>

            <div className={lotteryStyles.formDesc}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Description</label>
                <textarea
                  className="formInput"
                  value={formState.description}
                  onChange={handleOnChange}
                  name="description"
                  cols="30"
                  rows="5"
                ></textarea>
              </div>

              <CustomCheckbox
                isChecked={formState.infinite}
                label={"Run game indefinitely?"}
                name={"infinite"}
                onChange={(e) =>
                  setFormState({ ...formState, infinite: e.target.checked })
                }
              />
            </div>

            <div
              className={`flexRow justifyBetween ${lotteryStyles.col3} ${lotteryStyles.flexRow}`}
            >
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Telegram link</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.telegram}
                  onChange={handleOnChange}
                  placeholder="Optional"
                  name="telegram"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Facebook link</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.facebook}
                  onChange={handleOnChange}
                  placeholder="Optional"
                  name="facebook"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>WhatsApp</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.whatsapp}
                  onChange={handleOnChange}
                  placeholder="Optional"
                  name="whatsapp"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Others</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.others}
                  onChange={handleOnChange}
                  placeholder="Optional"
                  name="others"
                />
              </div>
            </div>

            <div
              className={`${lotteryStyles.formButtonContainer} ${lotteryStyles.addGame}`}
            >
              <CustomButtonII
                variant={"ghost"}
                text={"Reset"}
                className="btnLg me10"
                type="button"
                centerText={true}
                onClick={resetForm}
              />
              <CustomButtonII
                variant={"primary"}
                text={"Save and continue"}
                className="btnLg"
                type="button"
                loading={
                  isUpdateGameLoading ||
                  uploadLoading ||
                  isUpdateDraftGameLoading
                }
                onClick={submitForm}
                centerText={true}
              />
            </div>
          </form>
        </div>

        {/* aside */}
      </section>
    </>
  );
};

export default UpdateGame;
