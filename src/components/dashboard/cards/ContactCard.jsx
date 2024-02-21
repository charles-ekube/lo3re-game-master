import React from "react";
import Text from "../../../utils/CustomText";
import { SlArrowRight } from "react-icons/sl";
import { PiChatCenteredDotsLight } from "react-icons/pi";
import cardStyles from "../../../assets/styles/cardStyles.module.css";

const ContactCard = () => {
  return (
    <>
      <div className={`${cardStyles.contactCard}`}>
        <div className={`${cardStyles.contactCardIconContainer}`}>
          <PiChatCenteredDotsLight size={22} />
        </div>
        <div>
          <Text
            tag={"p"}
            className={"satoshi-medium-text f16"}
            style={{ color: "#000" }}
          >
            Contact us
          </Text>
          <Text
            tag={"p"}
            className={"satoshi-text f14"}
            style={{ color: "#000" }}
          >
            Chat with a member of our customer support team.
          </Text>
        </div>
        <SlArrowRight />
      </div>
    </>
  );
};

export default ContactCard;
