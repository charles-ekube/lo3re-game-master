import React, { useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../utils/CustomInput";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    const { value, name } = e.target;

    setFormState({ ...formState, [name]: value });
  };

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
            <div className="headerTitle text-center">Password reset</div>
          </div>

          <div className="password-reset-content">
            <div>
              <CustomInput
                label={"Old password"}
                type={"password"}
                name={"oldPassword"}
                onChange={handleInput}
                value={formState.oldPassword}
              />
            </div>
            <div>
              <CustomInput
                label={"New password"}
                type={"password"}
                name={"newPassword"}
                onChange={handleInput}
                value={formState.newPassword}
              />
            </div>
            <div>
              <CustomInput
                label={"Confirm password"}
                type={"password"}
                name={"confirmPassword"}
                onChange={handleInput}
                value={formState.confirmPassword}
              />

              <div className="text-end mt35">
                <button className="btn btn-dark btnLg">Reset</button>
              </div>
            </div>
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
    </>
  );
};

export default PasswordReset;
