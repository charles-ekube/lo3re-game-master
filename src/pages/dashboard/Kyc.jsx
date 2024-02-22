import React from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { GoChevronRight } from "react-icons/go";

const Kyc = () => {
  const navigate = useNavigate();

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
            <div className="headerTitle text-center">KYC Verification</div>
          </div>

          <div className="flexColumn" style={{ gap: "21px" }}>
            <KycLevel />
            <KycLevel />
            <KycLevel />
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

const KycLevel = () => {
  return (
    <div className="kyc-level">
      <div>
        <p className="kyc-title">Level 1</p>
        <p className="kyc-type">BVN Verification</p>
      </div>
      <div>
        <div className="status-pill pill-warning btnSm">Action required</div>
        <GoChevronRight fontSize={"30px"} fontWeight={400} />
      </div>
    </div>
  );
};

export default Kyc;
