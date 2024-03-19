import React, { useEffect, useRef, useState } from "react";
import Camera from "../../assets/images/camera.png";
import lotteryStyles from "../../assets/styles/lotteries.module.css";
import CustomButtonII from "../../utils/CustomButtonII";
import DatePicker from "react-datepicker";
import { showError } from "../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateAddLotteryForm } from "../../redux/features/generalSlice";
import { IoIosInformationCircleOutline } from "react-icons/io";

const AddLottery = () => {
  const dispatch = useDispatch();
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
    title: "",
    description: "",
    cause: "",
    ticketPrice: "",
    jackpot: "",
    ticketGoal: "",
    startOn: "",
    endOn: "",
    telegram: "",
    facebook: "",
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
        const reader = new FileReader();
        reader.onload = (base64) => {
          localStorage["lotteryPhoto"] = reader.result;
        };
        reader.readAsDataURL(images[0]);
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
      formState.title !== "" &&
      formState.ticketPrice !== "" &&
      formState.jackpot !== "" &&
      formState.ticketGoal !== "" &&
      formState.startOn !== "" &&
      formState.endOn !== "" &&
      formState.description !== ""
    ) {
      if (!file && !localImg) {
        showError("Upload a cover photo");
        return;
      }

      if (formState.title.length > 50) {
        showError("Title must be less than 50 characters");
        return;
      }

      if (Number(formState.ticketGoal) <= Number(formState.jackpot)) {
        showError("Ticket goal must exceed jackpot");
        return;
      }

      dispatch(updateAddLotteryForm(formState));
      navigate("/dashboard/lotteries/preview");
    } else {
      showError("Required fields are missing");
    }
  };

  return (
    <>
      <section className="mainContainer w75-25">
        <div className={`mainContent ${lotteryStyles.addLottery}`}>
          <header className={lotteryStyles.addLotteryHeader}>
            <h2>Create Lottery</h2>
            <p>Add the basic details about your lottery</p>
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
                  selected={formState.startOn}
                  onChange={(date) =>
                    setFormState({ ...formState, startOn: date })
                  }
                  minDate={new Date()}
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
                  selected={formState.endOn}
                  onChange={(date) =>
                    setFormState({ ...formState, endOn: date })
                  }
                  minDate={new Date()}
                  className="formInput"
                />
              </div>
            </div>

            <div className={`flexRow justifyBetween ${lotteryStyles.col3}`}>
              <div className={`inputContainer ${lotteryStyles.inputContainer}`}>
                <div
                  className="flexRow alignCenter"
                  style={{ gap: "5px", marginBottom: "8px" }}
                >
                  <label className="mb-0">Causes</label>
                  <span
                    className="tooltip"
                    data-tooltip="Specific causes proceeds from ticket sales goes to."
                  >
                    <IoIosInformationCircleOutline color="#888" />
                  </span>
                </div>
                <input
                  type="text"
                  className="formInput"
                  placeholder="Optional"
                  value={formState.cause}
                  onChange={handleOnChange}
                  name="cause"
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
                text={"Back"}
                className="btnLg me10"
                type="button"
                onClick={() =>
                  navigate("/dashboard/lotteries", {
                    replace: true,
                  })
                }
                centerText={true}
              />
              <CustomButtonII
                variant={"primary"}
                text={"Continue"}
                className="btnLg"
                type="button"
                onClick={submitForm}
                centerText={true}
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
            >
              <div className={lotteryStyles.num}>1</div>
              <p>Lottery details</p>
            </div>
            <div
              className={`cursor-pointer ${lotteryStyles.step}`}
              onClick={submitForm}
            >
              <div className={lotteryStyles.num}>2</div>
              <p>Preview</p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
};

export default AddLottery;
