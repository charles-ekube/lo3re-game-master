import React, { useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../utils/CustomInput";
import { useResetPasswordMutation } from "../../redux/services/accountApi";
import { showError, showSuccess } from "../../utils/Alert";
import CustomButtonII from "../../utils/CustomButtonII";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading: isResetPasswordLoading }] =
    useResetPasswordMutation();
  const [formState, setFormState] = useState({
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

  const handleSubmit = () => {
    if (!formState.newPassword || !formState.confirmPassword) {
      showError("All fields are required");
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      showError("Passwords don't match");
      return;
    }

    resetPassword({
      new_password: formState.newPassword,
      confirm_password: formState.confirmPassword,
    })
      .unwrap()
      .then((resp) => {
        if (resp?.success) {
          showSuccess("Password reset successful ✅");
          setFormState({
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          showError(
            resp?.data?.message ||
              resp?.message ||
              "An error occurred, try again later"
          );
          console.log("reset err", resp);
        }
      })
      .catch((err) => {
        console.log("reset err", err);
        showError(
          err?.data?.message ||
            err?.message ||
            "An error occurred, try again later"
        );
      });
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
                <CustomButtonII
                  text={"Reset"}
                  // className={"w100"}
                  onClick={handleSubmit}
                  loading={isResetPasswordLoading}
                  centerText={true}
                />
                {/* <button className="btn btn-dark btnLg">Reset</button> */}
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
