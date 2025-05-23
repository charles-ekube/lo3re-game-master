import React, { useState, useEffect } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { Link } from "react-router-dom";
import "../../assets/styles/settings.css";
import {
  useFetchFollowersQuery,
  useFetchProfileQuery,
  useFetchUniquePlayersQuery,
} from "../../redux/services/accountApi";
import Modal from "../../utils/Modal";
import Avatar from "../../utils/Avatar";
import { CiSearch } from "react-icons/ci";
// import Pagination from "../../utils/Pagination";
import { useFetchWalletBalanceQuery } from "../../redux/services/walletApi";
import useTextTruncate from "../../hooks/useTextTruncate";
import NameTagContainer from "../../utils/NameTagContainer";

const Settings = () => {
  const { data: user } = useFetchProfileQuery();
  const { data: followers } = useFetchFollowersQuery();
  const { data: uniquePlayers } = useFetchUniquePlayersQuery();

  const [refWallet, setRefWallet] = useState(null);
  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const { formatMoney } = useTextTruncate();
  const [isUniquePlayersModalOpen, setIsUniquePlayersModalOpen] =
    useState(false);
  console.log(isUniquePlayersModalOpen);
  const isEmail2faActive = user?.user?.security?.email;
  const isAuthApp2faActive = user?.user?.security["2fa"]
    ? user?.user?.security["2fa"]?.status === "verified"
    : false;

  const { data: walletBalance, isSuccess: isWalletBalanceSuccess } =
    useFetchWalletBalanceQuery();

  useEffect(() => {
    if (isWalletBalanceSuccess) {
      const refWallet = walletBalance?.filter(
        (val) => val?.type?.toLowerCase() === "affiliate"
      );

      setRefWallet(refWallet[0]);
    }
  }, [isWalletBalanceSuccess, walletBalance]);

  return (
    <>
      <section className="mainContainer">
        <div className="content">
          <div className="avatarStatsContainer">
            <Avatar
              name={user?.name ? user?.name : "User"}
              src={user?.picture}
              boxSize={"115px"}
            />
            <div className="userStats">
              <h3 className="userName capitalize">@{user?.name}</h3>
              <div className="stats">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => setIsFollowerModalOpen(true)}
                >
                  <h3 className="satoshi-text">{followers?.length || 0}</h3>
                  <p className="f14">Followers</p>
                </div>
                <div
                  className="text-center cursor-pointer"
                  onClick={() => setIsUniquePlayersModalOpen(true)}
                >
                  <h3 className="satoshi-text">{uniquePlayers?.length || 0}</h3>
                  <p className="f14">Unique players</p>
                </div>
                <div className="text-center">
                  <h3 className="satoshi-text">{`$${formatMoney(
                    refWallet?.balance || 0
                  )}`}</h3>
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
              <div className="linkContainer">Manage Beneficiaries</div>
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
          {!followers?.length ? (
            <p
              style={{ marginBlock: "50px" }}
              className={"textMuted textCenter"}
            >
              You don't have any followers yet
            </p>
          ) : (
            ""
          )}
          {followers?.map((value, idx) => (
            <NameTagContainer
              key={`foll-${idx}`}
              name={value?.username}
              photo={value?.photoUrl}
            />
          ))}
        </div>
        {/* <Pagination
          limit={1}
          curPage={currentPage}
          totalItems={2}
          paginate={(num) => setCurrentPage(num)}
        /> */}
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
          {!uniquePlayers?.length ? (
            <p
              style={{ marginBlock: "50px" }}
              className={"textMuted textCenter"}
            >
              You don't have any unique players yet
            </p>
          ) : (
            ""
          )}
          {uniquePlayers?.map((value, idx) => (
            <NameTagContainer
              key={`unP-${idx}`}
              name={value?.username}
              photo={value?.photoUrl}
            />
          ))}
        </div>
        {/* <Pagination
          limit={1}
          curPage={currentPage}
          totalItems={2}
          paginate={(num) => setCurrentPage(num)}
        /> */}
      </Modal>
    </>
  );
};

export default Settings;
