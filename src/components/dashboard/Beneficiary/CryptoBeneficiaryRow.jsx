import React, { useEffect, useState } from "react";
import { useDeleteCryptoBeneficiaryMutation } from "../../../redux/services/beneficiariesApi";
import CustomButtonII from "../../../utils/CustomButtonII";
import Modal from "../../../utils/Modal";
import { showError, showSuccess } from "../../../utils/Alert";
import ThreeColumnRow from "../../../utils/ThreeColumnRow";
import { BsTrash3 } from "react-icons/bs";
import BankIcon from "../../../assets/images/icons/bank.png";
import WasteCollection from "../../../assets/images/wastecollection.png";
import http from "../../../utils/utils";

const CryptoBeneficiaryRow = ({ beneficiary, onClick }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supportedCryptos, setSupportedCryptos] = useState([]);

  const [deleteBeneficiary, { isLoading: isDeleteBeneficiaryLoading }] =
    useDeleteCryptoBeneficiaryMutation();

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

  const returnCoin = (coin_id) => {
    const coin = supportedCryptos.filter((val) => val.id === coin_id);
    if (coin.length) {
      return coin[0];
    }
  };

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

  const coinInfo = returnCoin(beneficiary?.coin_id);
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
        icon={coinInfo?.logo_url || BankIcon}
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

export default CryptoBeneficiaryRow;
