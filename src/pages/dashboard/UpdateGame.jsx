import React, { useEffect, useRef, useState } from "react";
import Camera from "../../assets/images/camera.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import DatePicker from "react-datepicker";
import { showError } from "../../utils/Alert";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";

const UpdateGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reduxFormState = useSelector((state) => state.general.addLotteryForm);
  const fromPreview = searchParams.get("fromPreview");
  const fileElement = useRef(null);

  const [file, setFile] = useState();

  const localImg = fromPreview ? localStorage["lotteryPhoto"] : null;
  const [preview, setPreview] = useState(undefined);
  const [formState, setFormState] = useState({
    lotteryName: "Jackpot 1",
    ticketPrice: "20",
    jackpotPrize: "20000",
    ticketCapacity: "212",
    lotteryStarts: new Date(),
    lotteryEnds: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia provident, quasi praesentium odio assumenda laudantium error. Iusto blanditiis fugiat dolores exercitationem maxime incidunt omnis, ullam assumenda vel sit! Placeat, doloribus!",
    telegramLink: "",
    facebookLink: "",
    whatsapp: "",
    others: "",
  });

  useEffect(() => {
    if (fromPreview) {
      setFormState((state) => ({ ...state, ...reduxFormState }));
    }
  }, [fromPreview, reduxFormState]);

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
        // const reader = new FileReader();
        // reader.onload = (base64) => {
        //   localStorage["lotteryPhoto"] = reader.result;
        // };
        // reader.readAsDataURL(images[0]);
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

  const submitForm = () => {
    if (
      formState.lotteryName !== "" &&
      formState.ticketPrice !== "" &&
      formState.jackpotPrize !== "" &&
      formState.ticketCapacity !== "" &&
      formState.lotteryStarts !== null &&
      formState.lotteryEnds !== null &&
      formState.description !== ""
    ) {
      //   if (!file && !localImg) {
      //     showError("Upload a cover photo");
      //     return;
      //   }

      navigate("/dashboard/lotteries/view-game/1", {
        replace: true,
      });
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
              {preview || localImg ? (
                <img
                  src={preview || localImg || ""}
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
                  value={formState.lotteryName}
                  onChange={handleOnChange}
                  name="lotteryName"
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
                  value={formState.jackpotPrize}
                  onChange={handleOnChange}
                  name="jackpotPrize"
                />
              </div>
            </div>

            <div className={`flexRow justifyBetween ${lotteryStyles.col3}`}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <div
                  className="flexRow alignCenter"
                  style={{ gap: "5px", marginBottom: "8px" }}
                >
                  <label className="mb-0">Ticket capacity</label>
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
                  value={formState.ticketCapacity}
                  onChange={handleOnChange}
                  name="ticketCapacity"
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
                  selected={formState.lotteryStarts}
                  onChange={(date) =>
                    setFormState({ ...formState, lotteryStarts: date })
                  }
                  className="formInput"
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
                  selected={formState.lotteryEnds}
                  onChange={(date) =>
                    setFormState({ ...formState, lotteryEnds: date })
                  }
                  className="formInput"
                />
              </div>
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
            </div>

            <div
              className={`flexRow justifyBetween ${lotteryStyles.col3} ${lotteryStyles.flexRow}`}
            >
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Telegram link</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.telegramLink}
                  onChange={handleOnChange}
                  placeholder="Optional"
                  name="telegramLink"
                />
              </div>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <label>Facebook link</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.facebookLink}
                  onChange={handleOnChange}
                  placeholder="Optional"
                  name="facebookLink"
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
              />
              <CustomButtonII
                variant={"primary"}
                text={"Save and continue"}
                className="btnLg"
                type="button"
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
