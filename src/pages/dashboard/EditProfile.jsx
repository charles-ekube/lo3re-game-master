import React from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// import "../../assets/styles/settings.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <section className="mainContainer">
        <div className="content">
          <div className="settingHeader">
            <MdOutlineKeyboardBackspace
              size={34}
              className={"arrow-back"}
              onClick={goBack}
            />
            <div className="headerTitle text-center">Edit Profile</div>
          </div>
          <div className="flexColumn alignCenter avatarProfileContainer">
            <div className="avatar">
              <p>AB</p>
            </div>
            <button className="uploadBtn">Change profile photo</button>
            <p className="text-center text-muted uploadText">
              At least 800 x 800 px recommended. <br /> JPG or PNG allowed
            </p>
          </div>
          <form className="profileForm">
            <div className="flexRow">
              <div className="inputContainer">
                <label>First Name</label>
                <input type="text" className="formInput" />
              </div>
              <div className="inputContainer">
                <label>Last Name</label>
                <input type="text" className="formInput" />
              </div>
            </div>
            <div className="inputContainer">
              <label>Email address</label>
              <input type="email" className="formInput" />
            </div>
            <div className="inputContainer">
              <label>Phone number</label>
              <input type="tel" className="formInput" />
            </div>

            <div className="text-end mt35">
              {/* <IconButton text={"Update"} className="walletButton" /> */}
              <button className="btn btn-dark btn-lg">Update</button>
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

export default EditProfile;
