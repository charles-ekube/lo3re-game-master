import React, { useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useCopyToClipBoard from "../../hooks/useCopyToClipboard";
import { LuCopy } from "react-icons/lu";
import { AiOutlineCheck } from "react-icons/ai";
import Modal from "../../utils/Modal";

const Affiliate = () => {
  const navigate = useNavigate();
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const { handleCopyClick, isCopied } = useCopyToClipBoard();

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
            <div className="headerTitle text-center">
              Affiliate and referrals
            </div>
          </div>

          <div className="affiliateContent">
            <h3 className="sub-head">Refer a friend bonus🎉</h3>
            <p>
              Introduce your friends to Lo3re and get bonuses and exclusive
              perks!
            </p>
            <div className="ref-code-box">
              <p>lo3re.adamblake.com</p>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handleCopyClick("lo3re.adamblake.com")}
              >
                {isCopied ? <AiOutlineCheck color="green" /> : <LuCopy />}
              </div>
            </div>
            <div className="ref-box">
              <div className="stat">
                <p className="figure">$20</p>
                <p className="text">Referral commissions</p>
              </div>
              <div className="stat">
                <p className="figure">5</p>
                <p className="text">Friends referred</p>
              </div>
              <button
                className="btn-primary"
                onClick={() => setIsRefModalOpen(true)}
              >
                View list
              </button>
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

        {/* modals */}
        <Modal
          title={"Friends referred"}
          isOpen={isRefModalOpen}
          onClose={() => setIsRefModalOpen(false)}
        >
          <ol className="ref-list">
            <li>Raynera</li>
            <li>Raynera</li>
            <li>Raynera</li>
            <li>Raynera</li>
          </ol>
        </Modal>
      </section>
    </>
  );
};

export default Affiliate;
