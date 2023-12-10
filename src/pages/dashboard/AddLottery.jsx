import React, { useEffect, useRef, useState } from "react";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Camera from "../../assets/images/camera.png";
import "../../assets/styles/lotteries.css";
import CustomButtonII from "../../utils/CustomButtonII";
import DatePicker from "react-datepicker";
import { showError } from "../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateAddLotteryForm } from "../../redux/features/generalSlice";

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
    lotteryName: "",
    ticketPrice: "",
    jackpotPrize: "",
    ticketCapacity: "",
    lotteryStarts: new Date(),
    lotteryEnds: new Date(),
    description: "",
    telegramLink: "",
    facebookLink: "",
    whatsapp: "",
    others: "",
  });

  useEffect(() => {
    if (fromPreview) {
      setFormState({ ...formState, ...reduxFormState });
    }
  }, [fromPreview]);

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
      formState.lotteryName !== "" &&
      formState.ticketPrice !== "" &&
      formState.jackpotPrize !== "" &&
      formState.ticketCapacity !== "" &&
      formState.lotteryStarts !== null &&
      formState.lotteryEnds !== null &&
      formState.description !== ""
    ) {
      if (!file && !localImg) {
        showError("Upload a cover photo");
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
      <section className="mainContainer">
        <div className="mainContent addLottery">
          <p>
            Lotteries<b>/Create Lottery</b>
          </p>
          <header className="addLotteryHeader">
            <h2>Lottery Details</h2>
            <p>Add the basic details about your lottery</p>
          </header>
          <div className="flexRow alignCenter avatarProfileContainer">
            <div className="avatar">
              {preview || localImg ? (
                <img
                  src={preview || localImg || ""}
                  alt=""
                  className="fileImg"
                />
              ) : (
                <img src={Camera} alt="" className="cameraImg" />
              )}
            </div>
            <div>
              <button className="uploadBtn" onClick={clickFileElem}>
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
          <form className="lotteryForm">
            <div className="flexRow justifyBetween col3">
              <div className="inputContainer">
                <label>Lottery Name</label>
                <input
                  type="text"
                  className="formInput"
                  value={formState.lotteryName}
                  onChange={handleOnChange}
                  name="lotteryName"
                />
              </div>
              <div className="inputContainer">
                <label>Ticket price</label>
                <input
                  type="number"
                  className="formInput"
                  value={formState.ticketPrice}
                  onChange={handleOnChange}
                  name="ticketPrice"
                />
              </div>
              <div className="inputContainer">
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

            <div className="flexRow justifyBetween col3">
              <div className="inputContainer">
                <label>Ticket capacity</label>
                <input
                  type="number"
                  className="formInput"
                  value={formState.ticketCapacity}
                  onChange={handleOnChange}
                  name="ticketCapacity"
                />
              </div>
              <div className="inputContainer">
                <label>Lottery starts</label>
                <DatePicker
                  selected={formState.lotteryStarts}
                  onChange={(date) =>
                    setFormState({ ...formState, lotteryStarts: date })
                  }
                  className="formInput"
                />
              </div>
              <div className="inputContainer">
                <label>Lottery ends</label>
                <DatePicker
                  selected={formState.lotteryEnds}
                  onChange={(date) =>
                    setFormState({ ...formState, lotteryEnds: date })
                  }
                  className="formInput"
                />
              </div>
            </div>

            <div className="formDesc">
              <div className="inputContainer">
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

            <div className="flexRow justifyBetween col3">
              <div className="inputContainer">
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
              <div className="inputContainer">
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
              <div className="inputContainer">
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
              <div className="inputContainer">
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

            <div className="formButtonContainer">
              <CustomButtonII
                variant={"light"}
                text={"Exit"}
                className="btnLg me10"
                type="button"
                disabled={true}
              />
              <CustomButtonII
                variant={"primary"}
                text={"Continue"}
                className="btnLg"
                type="button"
                onClick={submitForm}
              />
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
    </>
  );
};

export default AddLottery;
