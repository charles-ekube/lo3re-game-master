import React, { useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { Link } from "react-router-dom";
import "../../assets/styles/settings.css";
import { useFetchProfileQuery } from "../../redux/services/accountApi";
import Modal from "../../utils/Modal";
import Avatar from "../../utils/Avatar";
import { CiSearch } from "react-icons/ci";
import Pagination from "../../utils/Pagination";

const Settings = () => {
  const { data: user } = useFetchProfileQuery();

  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUniquePlayersModalOpen, setIsUniquePlayersModalOpen] =
    useState(false);
  const isEmail2faActive = user?.user?.security?.email;
  const isAuthApp2faActive = user?.user?.security["2fa"]
    ? user?.user?.security["2fa"]?.status === "verified"
    : false;

  // Check if name is a string and not empty
  let firstLetter = "";
  let lastLetter = "";
  if (typeof user?.name !== "string" || user?.name.length === 0) {
    firstLetter = "X";
    lastLetter = "X";
  } else {
    firstLetter = user?.name[0];
    lastLetter = user?.name[user?.name.length - 1];
  }

  return (
    <>
      <section className="mainContainer">
        <div className="content">
          <div className="avatarStatsContainer">
            <div className="avatar">
              <p>
                {firstLetter
                  ? firstLetter?.toUpperCase() + lastLetter?.toUpperCase()
                  : "XX"}
              </p>
            </div>
            <div className="userStats">
              <h3 className="userName capitalize">@{user?.name}</h3>
              <div className="stats">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => setIsFollowerModalOpen(true)}
                >
                  <h3 className="satoshi-text">20</h3>
                  <p className="f14">Followers</p>
                </div>
                <div
                  className="text-center cursor-pointer"
                  onClick={() => setIsUniquePlayersModalOpen(true)}
                >
                  <h3 className="satoshi-text">20</h3>
                  <p className="f14">Unique players</p>
                </div>
                <div className="text-center">
                  <h3 className="satoshi-text">$20</h3>
                  <p className="f14">Referral commissions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="settings">
            <p className="text-muted">Profile</p>
            <div className="linkContainer">
              <Link to={"edit-profile"} className={"link"}>
                Edit Profile
              </Link>
            </div>
            <Link to={"kyc"} className={"link"}>
              <div className="linkContainer flexRow justifyBetween alignCenter">
                KYC Verification
                <div className="status-pill pill-invalid btnSm">
                  Not verified
                </div>
              </div>
            </Link>
            <Link to={"beneficiaries"} className={"link"}>
              <div className="linkContainer">Accounts and Cards</div>
            </Link>
            <div className="linkContainer">
              <Link to={"affiliate"} className={"link"}>
                Affiliate and Referrals
              </Link>
            </div>
          </div>

          <div className="settings">
            <p className="text-muted">Insights</p>
            <div className="linkContainer">
              <p className="link" onClick={() => setIsFollowerModalOpen(true)}>
                Followers
              </p>
            </div>
            <div className="linkContainer">
              <p
                className="link"
                onClick={() => setIsUniquePlayersModalOpen(true)}
              >
                Unique players
              </p>
            </div>
          </div>

          <div className="settings">
            <p className="text-muted">Security</p>
            <Link to={"#"} className={"link"}>
              <div className="linkContainer">Allow Notifications</div>
            </Link>
            <Link to={"password-reset"} className={"link"}>
              <div className="linkContainer">Password Reset</div>
            </Link>
            <Link to={"wallet-pin"} className={"link"}>
              <div className="linkContainer">Wallet Pin</div>
            </Link>
            <Link to={"2fa"} className={"link"}>
              <div className="linkContainer flexRow justifyBetween alignCenter">
                <span>Two-Factor Authentication</span>
                {isEmail2faActive || isAuthApp2faActive ? (
                  <div className="status-pill pill-success btnSm">Enabled</div>
                ) : (
                  <div className="status-pill pill-invalid btnSm">
                    Not Enabled
                  </div>
                )}
              </div>
            </Link>
          </div>

          <div className="settings">
            <p className="text-muted">About Lo3re</p>
            <div className="linkContainer">
              <Link to={"terms"} className={"link"}>
                Terms and Conditions
              </Link>
            </div>
            <div className="linkContainer">
              <Link to={"privacy"} className={"link"}>
                Privacy Policy
              </Link>
            </div>
            <div className="linkContainer">
              <Link to={"faq"} className={"link"}>
                FAQs
              </Link>
            </div>
            <div className="linkContainer">
              <Link to={"contact"} className={"link"}>
                Contact Us
              </Link>
            </div>
            <div className="linkContainer">
              <Link to={"#"} className={"link"}>
                Visit our website
              </Link>
            </div>
          </div>
        </div>

        {/* aside */}
        <aside className={"asideViewContainer hideOnMobile"}>
          <CardSlider />
          <div className={"contactCornerContainer"}>
            <Text tag={"p"} className={"f16 satoshi-bold-text"}>
              Customer corner
            </Text>
            <ContactCard />
          </div>
        </aside>
      </section>

      {/* modals */}
      <Modal
        title={"Followers"}
        isOpen={isFollowerModalOpen}
        onClose={() => setIsFollowerModalOpen(false)}
      >
        <div className="topNavSearchContainer followerSearchContainer">
          <CiSearch size={22} />
          <input placeholder="Search everything" />
        </div>
        <div className="follower-list">
          <NameTagContainer />
          <NameTagContainer />
          <NameTagContainer />
          <NameTagContainer />
        </div>
        <Pagination
          limit={1}
          curPage={currentPage}
          totalItems={2}
          paginate={(num) => setCurrentPage(num)}
        />
      </Modal>

      <Modal
        title={"Unique players"}
        isOpen={isUniquePlayersModalOpen}
        onClose={() => setIsUniquePlayersModalOpen(false)}
      >
        <div className="topNavSearchContainer followerSearchContainer">
          <CiSearch size={22} />
          <input placeholder="Search everything" />
        </div>
        <div className="follower-list">
          <NameTagContainer />
          <NameTagContainer />
          <NameTagContainer />
          <NameTagContainer />
        </div>
        <Pagination
          limit={1}
          curPage={currentPage}
          totalItems={2}
          paginate={(num) => setCurrentPage(num)}
        />
      </Modal>
    </>
  );
};

const NameTagContainer = () => {
  return (
    <div className="flexRow alignCenter" style={{ gap: "8px" }}>
      <Avatar name={"Adam Clarkb"} />
      <Text
        className={"satoshi-text f14 capitalize"}
        style={{ color: "rgba(16, 16, 16, 1)" }}
      >
        Adam Clarke
      </Text>
    </div>
  );
};

export default Settings;
