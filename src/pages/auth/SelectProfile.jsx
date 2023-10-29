import React, { useState } from "react";
import Logo from "../../assets/images/logo.svg";
import Button from "../../utils/CustomButton";
import Text from "../../utils/CustomText";
import { BsDot } from "react-icons/bs";

const SelectProfile = () => {
  const [profiles, setProfiles] = useState([
    {
      name: "Game Master",
      initials: "GM",
      tag: "You design your winning games",
      active: false,
    },
    {
      name: "Player",
      initials: "P",
      tag: "Participate in a variety of games and win",
      active: false,
    },
  ]);

  const toggleActive = (clickedProfile) => {
    // Create a new array with the updated active property
    const updatedProfiles = profiles.map((profile) => ({
      ...profile,
      active: profile === clickedProfile, // Set to true for the clicked profile, false for others
    }));

    setProfiles(updatedProfiles); // Update the state with the new array
  };
  const renderProfiles = () => {
    return profiles?.map((item, index) => {
      return (
        <li className={"authProfileTab"} onClick={() => toggleActive(item)}>
          <div className={"flexRow alignCenter"} style={{ gap: "10px" }}>
            <div className={"authProfileInitials"}>
              <Text tag={"h3"} className={"f36 boldText"}>
                {item?.initials}
              </Text>
            </div>
            <div>
              <Text tag={"p"}>{item?.name}</Text>
              <Text tag={"p"}>{item?.tag}</Text>
            </div>
          </div>
          <div className={"authProfileTabStatus"} style={{ background: item?.active ? "rgba(16, 16, 16, 1)" : "#fff" }}>
            <BsDot size={25} color="#fff" />
          </div>
        </li>
      );
    });
  };

  return (
    <main className={"authMainContainer"}>
      <section className={"authContainer"}>
        <header>
          <img src={Logo} alt="logo" />
          <div className={"verifyHeaderText"}>
            <Text tag={"h2"} className={"f26 boldText textCenter"}>
              Select Profile
            </Text>
            <Text tag={"p"} style={{ lineHeight: "26px" }} className={"f16 regularText textCenter"}>
              Select a persona that best suites you!!😁⭐️
            </Text>
          </div>
        </header>

        <div className={"formContainer"}>
          <ul>{renderProfiles()}</ul>
          <div>
            <Button text={"Go to dashboard"} className={"authBtn"} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SelectProfile;
