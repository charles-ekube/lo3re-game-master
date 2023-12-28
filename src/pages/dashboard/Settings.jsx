import React from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { Link } from "react-router-dom";
import "../../assets/styles/settings.css";
import { useFetchProfileQuery } from "../../redux/services/accountApi";

const Settings = () => {
  const { data: user } = useFetchProfileQuery();

  const isEmail2faActive = user?.user?.security?.email;
  const isAuthApp2faActive = user?.user?.security["2fa"]
    ? user?.user?.security["2fa"]?.status === "verified"
    : false;

  return (
    <>
      <section className="mainContainer">
        <div className="content">
          <div className="avatarStatsContainer">
            <div className="avatar">
              <p>AB</p>
            </div>
            <div className="userStats">
              <h3 className="userName">Adam Blake</h3>
              <div className="stats">
                <div className="text-center">
                  <h3 className="satoshi-text">20</h3>
                  <p className="f14">Followers</p>
                </div>
                <div className="text-center">
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
            <div className="linkContainer">
              <Link to={"beneficiaries"} className={"link"}>
                Accounts and Cards
              </Link>
            </div>
            <div className="linkContainer">
              <Link to={"affiliate"} className={"link"}>
                Affiliate and Referrals
              </Link>
            </div>
          </div>

          <div className="settings">
            <p className="text-muted">Insights</p>
            <div className="linkContainer">
              <Link to={"followers"} className={"link"}>
                Followers
              </Link>
            </div>
            <div className="linkContainer">
              <Link to={"uniques-players"} className={"link"}>
                Unique Players
              </Link>
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

export default Settings;
