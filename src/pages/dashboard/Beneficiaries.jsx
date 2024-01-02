import React, { useEffect, useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  useFetchBankBeneficiariesQuery,
  useFetchCryptoBeneficiariesQuery,
} from "../../redux/services/beneficiariesApi";
import Loader from "../../utils/Loader";
import CustomButtonII from "../../utils/CustomButtonII";
import CryptoBeneficiaryRow from "../../components/dashboard/Beneficiary/CryptoBeneficiaryRow";
import CryptoBeneModal from "../../components/dashboard/Beneficiary/CryptoBeneModal";
import BankBeneModal from "../../components/dashboard/Beneficiary/BankBeneModal";
import BeneficiaryRow from "../../components/dashboard/Beneficiary/BeneficiaryRow";

const Beneficiaries = () => {
  const navigate = useNavigate();
  const [showAddBankBeneModal, setShowAddBankBeneModal] = useState(false);
  const [showAddCryptoBeneModal, setShowAddCryptoBeneModal] = useState(false);
  const { data: bankBeneficiaries, isLoading: isBankBeneLoading } =
    useFetchBankBeneficiariesQuery();
  const { data: cryptoBeneficiaries, isLoading: isCryptoBeneLoading } =
    useFetchCryptoBeneficiariesQuery();
  const [selectedBenecficiary, setSelectedBenecficiary] = useState(null);
  const [selectedCryptoBenecficiary, setSelectedCryptoBenecficiary] =
    useState(null);
  const [tabs, setTabs] = useState([
    {
      name: "Bank Transfers",
      isActive: true,
    },
    {
      name: "Crypto",
      isActive: false,
    },
  ]);

  const returnActiveTab = () => {
    const activeTab = tabs.filter((tab) => tab.isActive);
    return activeTab[0];
  };

  const toggleTabs = (clickedItem) => {
    const updatedTabs = tabs.map((item) => ({
      ...item,
      isActive: item === clickedItem, // Set to true for the clicked profile, false for others
    }));

    setTabs(updatedTabs); // Update the state with the new array
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleAddBenModalClose = () => {
    setSelectedBenecficiary(null);
    setShowAddBankBeneModal(false);
  };

  const handleAddCryptoBenModalClose = () => {
    setSelectedCryptoBenecficiary(null);
    setShowAddCryptoBeneModal(false);
  };

  const openEditModal = (value) => {
    setSelectedBenecficiary(value);
    setShowAddBankBeneModal(true);
  };

  const openEditCryptoModal = (value) => {
    setSelectedCryptoBenecficiary(value);
    setShowAddCryptoBeneModal(true);
  };

  const handleAddNewBeneficiary = () => {
    if (returnActiveTab().name === "Crypto") {
      setShowAddCryptoBeneModal(true);
    } else {
      setShowAddBankBeneModal(true);
    }
  };

  const renderElem = () => {
    if (returnActiveTab()?.name === "Crypto") {
      return (
        <>
          {!cryptoBeneficiaries?.length && !isCryptoBeneLoading ? (
            <p className="text-muted text-center mt40">
              You have not added any crypto beneficiaries yet.
            </p>
          ) : (
            ""
          )}
          {cryptoBeneficiaries?.map((value) => (
            <CryptoBeneficiaryRow
              key={`ben-${value?.id}`}
              onClick={() => openEditCryptoModal(value)}
              beneficiary={value}
            />
          ))}
        </>
      );
    } else {
      return (
        <>
          {!bankBeneficiaries?.length && !isBankBeneLoading ? (
            <p className="text-muted text-center mt40">
              You have not added any bank transfer beneficiaries yet.
            </p>
          ) : (
            ""
          )}
          {bankBeneficiaries?.map((value) => (
            <BeneficiaryRow
              key={`ben-${value?.id}`}
              onClick={() => openEditModal(value)}
              beneficiary={value}
            />
          ))}
        </>
      );
    }
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
            <div className="headerTitle text-center">Manage Beneficiaries</div>
          </div>
          {/* tab switch */}
          <div className="tabContainer">
            <div className="switchTabs twoCols">
              {tabs.map((tab, index) => (
                <button
                  key={"tab-" + index}
                  className={`capitalize switchBtn ${
                    tab.isActive ? "active" : ""
                  }`}
                  onClick={() => toggleTabs(tab)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
          {/* content */}
          <div className="settingContent">
            <Loader
              isLoading={isBankBeneLoading || isCryptoBeneLoading}
              variety="dark"
              height="100px"
            />
            {renderElem()}
            <CustomButtonII
              text={"Add New Beneficiary"}
              variant={"light"}
              className={"w100 justifyCenter mt40"}
              centerText={true}
              onClick={handleAddNewBeneficiary}
            />
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

      <BankBeneModal
        isOpen={showAddBankBeneModal}
        onClose={handleAddBenModalClose}
        beneficiaryToUpdate={selectedBenecficiary}
      />

      <CryptoBeneModal
        isOpen={showAddCryptoBeneModal}
        onClose={handleAddCryptoBenModalClose}
        cryptoBeneficiaryToUpdate={selectedCryptoBenecficiary}
      />
    </>
  );
};

export default Beneficiaries;
