import React, { useEffect, useState } from "react";
import CardSlider from "../../components/dashboard/overview/CardSlider";
import Text from "../../utils/CustomText";
import ContactCard from "../../components/dashboard/cards/ContactCard";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  useAddBankBeneficiaryMutation,
  useAddCryptoBeneficiaryMutation,
  useDeleteBankBeneficiaryMutation,
  useDeleteCryptoBeneficiaryMutation,
  useFetchBankBeneficiariesQuery,
  useFetchCryptoBeneficiariesQuery,
  useUpdateBankBeneficiaryMutation,
  useUpdateCryptoBeneficiaryMutation,
} from "../../redux/services/beneficiariesApi";
import Loader from "../../utils/Loader";
import CustomButtonII from "../../utils/CustomButtonII";
import Modal from "../../utils/Modal";
import CustomDropdown from "../../utils/CustomDropdown";
import http from "../../utils/utils";
import { showError, showSuccess } from "../../utils/Alert";
import BankIcon from "../../assets/images/icons/bank.png";
import ThreeColumnRow from "../../utils/ThreeColumnRow";
import { BsTrash3 } from "react-icons/bs";
import WasteCollection from "../../assets/images/wastecollection.png";

const accountTypeOptions = [
  { name: "Personal Account", value: "personal" },
  { name: "Business Account", value: "business" },
];

const Beneficiaries = () => {
  const navigate = useNavigate();
  const [showAddBankBeneModal, setShowAddBankBeneModal] = useState(false);
  const [showAddCryptoBeneModal, setShowAddCryptoBeneModal] = useState(false);
  const { data: bankBeneficiaries, isLoading: isBankBeneLoading } =
    useFetchBankBeneficiariesQuery();
  const { data: cryptoBeneficiaries, isLoading: isCryptoBeneLoading } =
    useFetchCryptoBeneficiariesQuery();
  const [supportedBanks, setSupportedBanks] = useState([]);
  const [supportedCryptos, setSupportedCryptos] = useState([]);
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

  const returnCoin = (coin_id) => {
    const coin = supportedCryptos.filter((val) => val.id === coin_id);
    if (coin.length) {
      return coin[0];
    }
  };

  const toggleTabs = (clickedItem) => {
    const updatedTabs = tabs.map((item) => ({
      ...item,
      isActive: item === clickedItem, // Set to true for the clicked profile, false for others
    }));

    setTabs(updatedTabs); // Update the state with the new array
  };

  // TODO: call w/rtk query
  const fetchBanks = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-banks`);
      const newArray = res?.data.map((cur) => ({
        ...cur,
        value: cur.code,
      }));

      setSupportedBanks(newArray);
      // console.log("banks", res);
      //   setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      //   setRequestLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
    //   fetchCryptos();
  }, []);

  useEffect(() => {
    fetchBanks();
    //   fetchCryptos();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const fetchCryptos = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-coins`);
      const newArray = res.map((crypto) => ({
        ...crypto,
        value: crypto.id,
        name: crypto.name.toUpperCase(),
        icon: crypto.logo_url,
      }));

      setSupportedCryptos(newArray);
    } catch (error) {
      console.log("fetch bank err", error);
    }
  };

  // fetch supported banks/cryptos
  useEffect(() => {
    fetchCryptos();
  }, []);

  const returnBankName = (bank_code) => {
    const bank = supportedBanks.filter((val) => val?.code === bank_code);
    if (bank.length) {
      return bank[0]?.name;
    } else {
      return "";
    }
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
              coinInfo={returnCoin(value?.coin_id)}
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
              bankName={returnBankName(value?.bank_code)}
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

/************************************
 * Bank beneficiary modal and row
 * ***********************************/
const BeneficiaryRow = ({ beneficiary, bankName, onClick }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteBeneficiary, { isLoading: isDeleteBeneficiaryLoading }] =
    useDeleteBankBeneficiaryMutation();

  const handleDeleteBeneficiary = async () => {
    await deleteBeneficiary(beneficiary?.id)
      .unwrap()
      .then(() => {
        showSuccess("Beneficiary deleted");
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
        showError(err?.message || err?.data?.message || "An error occurred");
      });
  };

  return (
    <>
      <ThreeColumnRow
        onClick={onClick}
        twoWayClick={true}
        onClick2={() => setShowDeleteModal(true)}
        title={beneficiary?.account_name || "--"}
        subtitle={
          <>
            <small>{bankName || "Account number"}:</small>{" "}
            <b>{beneficiary?.account_number || "--"}</b>
          </>
        }
        icon={BankIcon}
        col2Child={<BsTrash3 fontSize={"20px"} color={"#FC7F79"} />}
      />

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="flexRow justifyCenter">
          <img src={WasteCollection} className="deleteIllustration" alt="" />
        </div>
        <h3 className="deleteTitle">Delete Beneficiary</h3>
        <p className="deleteSubtitle">
          Are you sure you want to delete this beneficiary?
        </p>
        <div className="flexRow gap-1 mt35">
          <CustomButtonII
            variant="light"
            text={"Don't delete"}
            className={"w50"}
            centerText={true}
            onClick={() => setShowDeleteModal(false)}
          />
          <CustomButtonII
            variant="ghost-danger"
            text={"Yes, delete"}
            className={"w50"}
            centerText={true}
            loading={isDeleteBeneficiaryLoading}
            onClick={handleDeleteBeneficiary}
          />
        </div>
      </Modal>
    </>
  );
};

const BankBeneModal = ({ isOpen, onClose, beneficiaryToUpdate = null }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [supportedBanks, setSupportedBanks] = useState([]);
  const [updateBankBeneficiary, { isLoading: isUpdateBankBenLoading }] =
    useUpdateBankBeneficiaryMutation();
  const [addBankBeneficiary, { isLoading: isAddBankBeneficiaryLoading }] =
    useAddBankBeneficiaryMutation();
  const [formState, setFormState] = useState({
    currency: "",
    bank_name: "",
    bank_code: "",
    account_name: "",
    account_number: "",
    account_type: "",
    sort_code: "",
    routing_number: "",
    note: "",
  });

  useEffect(() => {
    if (beneficiaryToUpdate) {
      if (beneficiaryToUpdate?.currency === "ngn") {
        setFormState((prevState) => ({
          ...prevState,
          currency: beneficiaryToUpdate?.currency || "ngn",
          bank_name: beneficiaryToUpdate?.bank_name,
          bank_code: beneficiaryToUpdate?.bank_code,
          account_name: beneficiaryToUpdate?.account_name,
          account_number: beneficiaryToUpdate?.account_number,
        }));
      } else {
        setFormState((prevState) => ({
          ...prevState,
          currency: beneficiaryToUpdate?.currency || "usd",
          bank_name: beneficiaryToUpdate?.bank_name || "",
          bank_code: beneficiaryToUpdate?.bank_code || "",
          account_name: beneficiaryToUpdate?.account_name || "",
          account_number: beneficiaryToUpdate?.account_number || "",
          account_type: beneficiaryToUpdate?.account_type || "",
          sort_code: beneficiaryToUpdate?.sort_code || "",
          routing_number: beneficiaryToUpdate?.routing_number || "",
        }));
      }
    } else {
      setFormState((prevState) => ({
        ...prevState,
        currency: "usd",
        bank_name: "",
        bank_code: "",
        account_name: "",
        account_number: "",
        account_type: "",
        sort_code: "",
        routing_number: "",
        note: "",
      }));
    }
  }, [beneficiaryToUpdate]);

  const fetchBanks = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-banks`);
      const newArray = res?.data.map((cur) => ({
        ...cur,
        value: cur.code,
      }));

      setSupportedBanks(newArray);
      // console.log("banks", res);
      //   setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      //   setRequestLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
    //   fetchCryptos();
  }, []);

  const validateAccount = async () => {
    try {
      const { account_number, bank_code } = formState;
      handleOnChange("...", "account_name");
      const res = await http.post(
        `wallets/withdrawals/validate-bank-details?currency=ngn`,
        {
          account_number,
          bank_code,
        }
      );

      if (res.data?.status) {
        const acName = res?.data?.data?.account_name;
        if (acName) {
          handleOnChange(acName, "account_name");
        }
      } else {
        showError("Could not resolve account name");
        console.log(res);
        handleOnChange("", "account_name");
      }
    } catch (error) {
      showError("Could not resolve account name");
      console.log(error);
      handleOnChange("", "account_name");
    }
  };

  // validate acct
  useEffect(() => {
    if (formState.currency === "ngn") {
      if (formState.account_number.length === 10) {
        validateAccount();
      } else {
        handleOnChange("", "account_name");
      }
    }
  }, [formState.account_number, formState.currency, formState.bank_code]);

  const handleOnChange = (val, name) => {
    setFormState({ ...formState, [name]: val });
  };

  const handleCurrencyChange = (val) => {
    setFormState({ ...formState, currency: val });
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await http.get(`wallets/supported-currencies`);
        const newArray = res.map((cur) => ({
          ...cur,
          title: cur.name,
          value: cur.code,
          name: cur.code.toUpperCase(),
        }));

        setSupportedCurrencies(newArray);
        // setFormState((state) => ({ ...state, currency: "usd" }));
        // console.log("currencies", newArray);
      } catch (error) {
        console.log("fetch currency err", error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleSubmit = async () => {
    const {
      currency,
      account_number,
      account_name,
      bank_code,
      routing_number,
      sort_code,
      account_type,
      note,
    } = formState;
    let fData;

    if (formState.currency === "ngn") {
      if (account_number === "" || bank_code === "") {
        showError("Required fields are missing");
        return;
      }

      if (account_name === "") {
        showError("Could not verify account number");
        return;
      }

      const selectedBank = supportedBanks.filter(
        (val) => val?.code === formState.bank_code
      );
      let bank_id;
      if (selectedBank.length) {
        bank_id = selectedBank[0].id;
      } else {
        showError("Invalid bank selected");
        return;
      }
      //   console.log(selectedBank);
      //   console.log(supportedBanks);

      fData = {
        currency,
        account_number,
        account_name,
        bank_code,
        bank_id,
      };
    } else {
      if (
        routing_number === "" ||
        sort_code === "" ||
        account_number === "" ||
        account_name === "" ||
        account_type === ""
      ) {
        showError("Required fields are missing");
        return;
      }

      fData = {
        currency,
        account_number,
        account_name,
        routing_number,
        sort_code,
        account_type,
        note,
      };
    }

    // return;
    if (beneficiaryToUpdate) {
      await updateBankBeneficiary({
        id: beneficiaryToUpdate?.id,
        data: fData,
      })
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary updated");
          setFormState({
            ...formState,
            currency: "",
            bank_name: "",
            bank_code: "",
            account_type: "",
            account_name: "",
            account_number: "",
            sort_code: "",
            routing_number: "",
            note: "",
          });
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    } else {
      await addBankBeneficiary(fData)
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary added");
          setFormState({
            ...formState,
            currency: "",
            bank_name: "",
            bank_code: "",
            account_type: "",
            account_name: "",
            account_number: "",
            sort_code: "",
            routing_number: "",
            note: "",
          });
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    }
  };

  return (
    <Modal
      title={`${beneficiaryToUpdate ? "Edit" : "Add"} Bank Beneficiary`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <div className="inputContainer">
          <label className="text-start">Currency</label>
          <CustomDropdown
            value={formState.currency}
            itemOnClick={handleCurrencyChange}
            dropdownItems={supportedCurrencies}
          />
        </div>

        {formState.currency === "ngn" ? (
          <div className="inputContainer">
            <label>Bank Name</label>
            <CustomDropdown
              value={formState.bank_code}
              dropdownItems={supportedBanks}
              itemOnClick={(val) => handleOnChange(val, "bank_code")}
            />
          </div>
        ) : (
          <div className="inputContainer">
            <label>Account Type</label>
            <CustomDropdown
              value={formState.account_type}
              dropdownItems={accountTypeOptions}
              itemOnClick={(val) => handleOnChange(val, "account_type")}
            />
          </div>
        )}
        <div className="inputContainer">
          <label>Account Number</label>
          <input
            type="number"
            className="formInput"
            value={formState.account_number}
            onChange={(e) => handleOnChange(e.target.value, "account_number")}
          />
        </div>
        <div className="inputContainer">
          <label>
            {formState.currency === "ngn" ? "Account Name" : "Receipient Name"}
          </label>
          <input
            type="text"
            className="formInput"
            value={formState.account_name}
            onChange={(e) => handleOnChange(e.target.value, "account_name")}
            readOnly={formState.currency === "ngn"}
          />
        </div>
        {formState.currency === "usd" ? (
          <>
            <div className="inputContainer">
              <label>Sort Code</label>
              <input
                type="text"
                className="formInput"
                value={formState.sort_code}
                onChange={(e) => handleOnChange(e.target.value, "sort_code")}
              />
            </div>
            <div className="inputContainer">
              <label>Routing Number</label>
              <input
                type="number"
                className="formInput"
                value={formState.routing_number}
                onChange={(e) =>
                  handleOnChange(e.target.value, "routing_number")
                }
              />
            </div>
            <div className="inputContainer">
              <label>Note</label>
              <textarea
                className="formInput"
                value={formState.description}
                onChange={(e) => handleOnChange(e.target.value, "note")}
                placeholder="Optional"
                cols="30"
                rows="3"
              ></textarea>
            </div>
          </>
        ) : (
          ""
        )}
        <CustomButtonII
          text={"Save"}
          className={"w100"}
          centerText={true}
          onClick={handleSubmit}
          loading={isAddBankBeneficiaryLoading || isUpdateBankBenLoading}
        />
      </>
    </Modal>
  );
};

/************************************
 * Crypto beneficiary modal and row
 * ***********************************/
const CryptoBeneficiaryRow = ({ beneficiary, coinInfo, onClick }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteBeneficiary, { isLoading: isDeleteBeneficiaryLoading }] =
    useDeleteCryptoBeneficiaryMutation();

  const handleDeleteBeneficiary = async () => {
    await deleteBeneficiary(beneficiary?.id)
      .unwrap()
      .then(() => {
        showSuccess("Beneficiary deleted");
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
        showError(err?.message || err?.data?.message || "An error occurred");
      });
  };

  return (
    <>
      <ThreeColumnRow
        onClick={onClick}
        twoWayClick={true}
        onClick2={() => setShowDeleteModal(true)}
        title={beneficiary?.title || beneficiary?.address}
        subtitle={
          <>
            <small>{coinInfo?.name}:</small>{" "}
            <b>{beneficiary?.network + " network"}</b>
          </>
        }
        icon={coinInfo?.logo_url}
        col2Child={<BsTrash3 fontSize={"20px"} color={"#FC7F79"} />}
      />

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="flexRow justifyCenter">
          <img src={WasteCollection} className="deleteIllustration" alt="" />
        </div>
        <h3 className="deleteTitle">Delete Beneficiary</h3>
        <p className="deleteSubtitle">
          Are you sure you want to delete this beneficiary?
        </p>
        <div className="flexRow gap-1 mt35">
          <CustomButtonII
            variant="light"
            text={"Don't delete"}
            className={"w50"}
            centerText={true}
            onClick={() => setShowDeleteModal(false)}
          />
          <CustomButtonII
            variant="ghost-danger"
            text={"Yes, delete"}
            className={"w50"}
            centerText={true}
            loading={isDeleteBeneficiaryLoading}
            onClick={handleDeleteBeneficiary}
          />
        </div>
      </Modal>
    </>
  );
};

const CryptoBeneModal = ({
  isOpen,
  onClose,
  cryptoBeneficiaryToUpdate = null,
}) => {
  const [formState, setFormState] = useState({
    title: "",
    coin_id: "",
    network: "",
    address: "",
    tag_id: "",
  });
  const [showTagInput, setShowTagInput] = useState(false);
  const [supportedCryptos, setSupportedCryptos] = useState([]);
  const [cyrptoNetworks, setCryptoNetworks] = useState([]);
  const [updateCryptoBeneficiary, { isLoading: isUpdateCryptoBenLoading }] =
    useUpdateCryptoBeneficiaryMutation();
  const [addCryptoBeneficiary, { isLoading: isAddCryptoBeneficiaryLoading }] =
    useAddCryptoBeneficiaryMutation();

  const handleOnChange = (val, name) => {
    setFormState({ ...formState, [name]: val });
  };

  const fetchCryptos = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-coins`);
      const newArray = res.map((crypto) => ({
        ...crypto,
        value: crypto.id,
        name: crypto.name.toUpperCase(),
        icon: crypto.logo_url,
      }));

      // setBanks(res);
      setSupportedCryptos(newArray);
      //   setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      //   setRequestLoading(false);
    }
  };

  // fetch supported banks/cryptos
  useEffect(() => {
    fetchCryptos();
  }, []);

  useEffect(() => {
    if (cryptoBeneficiaryToUpdate) {
      console.log("im running");
      setFormState((prevState) => ({
        ...prevState,
        title: cryptoBeneficiaryToUpdate?.title,
        coin_id: cryptoBeneficiaryToUpdate?.coin_id,
        network: cryptoBeneficiaryToUpdate?.network,
        address: cryptoBeneficiaryToUpdate?.address,
        tag_id: cryptoBeneficiaryToUpdate?.tag_id,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        title: "",
        coin_id: "",
        network: "",
        address: "",
        tag_id: "",
      }));
    }
  }, [cryptoBeneficiaryToUpdate]);

  useEffect(() => {
    const selectedCoin = supportedCryptos.filter(
      (val) => val.id === formState.coin_id
    );
    if (selectedCoin.length) {
      const networkArr = selectedCoin[0].networks.map((val) => ({
        name: val,
        value: val,
      }));
      setCryptoNetworks(networkArr);
      //   console.log(networkArr);
    }
  }, [formState.coin_id, supportedCryptos]);

  // show/hide tag_id input
  useEffect(() => {
    const selectedCoin = supportedCryptos.filter(
      (val) => val.id === formState.coin_id
    );
    if (selectedCoin.length && selectedCoin[0].name === "RIPPLE") {
      setShowTagInput(true);
    } else {
      setShowTagInput(false);
    }
  }, [formState.coin_id, supportedCryptos]);

  const handleSubmit = async () => {
    if (
      formState.coin_id === "" ||
      formState.network === "" ||
      formState.address === ""
    ) {
      showError("Required fields are missing");
      return;
    }

    if (cryptoBeneficiaryToUpdate) {
      await updateCryptoBeneficiary({
        id: cryptoBeneficiaryToUpdate?.id,
        data: formState,
      })
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary updated");
          setFormState({
            ...formState,
            title: "",
            coin_id: "",
            network: "",
            address: "",
            tag_id: "",
          });
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    } else {
      await addCryptoBeneficiary(formState)
        .unwrap()
        .then(() => {
          showSuccess("Beneficiary added");
          setFormState({
            ...formState,
            title: "",
            coin_id: "",
            network: "",
            address: "",
            tag_id: "",
          });
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showError(err?.message || err?.data?.message || "An error occurred");
        });
    }
  };

  return (
    <Modal
      title={`${cryptoBeneficiaryToUpdate ? "Edit" : "Add"} Crypto Beneficiary`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        {/* fields: select crypto, select network, enter addr, opt tag_id */}
        <div className="inputContainer">
          <label>Title</label>
          <input
            type={"text"}
            className="formInput"
            value={formState.title}
            onChange={(e) => handleOnChange(e.target.value, "title")}
          />
        </div>
        <div className="inputContainer">
          <label>Select Coin</label>
          <CustomDropdown
            value={formState.coin_id}
            dropdownItems={supportedCryptos}
            itemOnClick={(val) => handleOnChange(val, "coin_id")}
          />
        </div>
        <div className="inputContainer">
          <label>Select Network</label>
          <CustomDropdown
            value={formState.network}
            dropdownItems={cyrptoNetworks}
            itemOnClick={(val) => handleOnChange(val, "network")}
          />
        </div>
        <div className="inputContainer">
          <label>Wallet address</label>
          <input
            type={"text"}
            className="formInput"
            value={formState.address}
            onChange={(e) => handleOnChange(e.target.value, "address")}
          />
        </div>
        {showTagInput && (
          <div className="inputContainer">
            <label>Tag ID</label>
            <input
              type={"text"}
              className="formInput"
              value={formState.tag_id}
              onChange={(e) => handleOnChange(e.target.value, "tag_id")}
            />
          </div>
        )}

        <CustomButtonII
          text={"Save"}
          className={"w100"}
          centerText={true}
          onClick={handleSubmit}
          loading={isAddCryptoBeneficiaryLoading || isUpdateCryptoBenLoading}
        />
      </>
    </Modal>
  );
};


export default Beneficiaries;
