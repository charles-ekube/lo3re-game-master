import React, { useEffect, useState } from "react";
import { useDeleteBankBeneficiaryMutation } from "../../../redux/services/beneficiariesApi";
import CustomButtonII from "../../../utils/CustomButtonII";
import Modal from "../../../utils/Modal";
import { showError, showSuccess } from "../../../utils/Alert";
import BankIcon from "../../../assets/images/icons/bank.png";
import ThreeColumnRow from "../../../utils/ThreeColumnRow";
import { BsTrash3 } from "react-icons/bs";
import WasteCollection from "../../../assets/images/wastecollection.png";
import http from "../../../utils/utils";

const BeneficiaryRow = ({ beneficiary, onClick }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supportedBanks, setSupportedBanks] = useState([]);

  const [deleteBeneficiary, { isLoading: isDeleteBeneficiaryLoading }] =
    useDeleteBankBeneficiaryMutation();

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

  const returnBankName = (bank_code) => {
    const bank = supportedBanks.filter((val) => val?.code === bank_code);
    if (bank.length) {
      return bank[0]?.name;
    } else {
      return null;
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

  return (
    <>
      <ThreeColumnRow
        onClick={onClick}
        twoWayClick={true}
        onClick2={() => setShowDeleteModal(true)}
        title={beneficiary?.title || beneficiary?.account_name}
        subtitle={
          <>
            <small>
              {returnBankName(beneficiary?.bank_code) || "Account number"}:
            </small>{" "}
            <b>{beneficiary?.account_number}</b>
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

export default BeneficiaryRow;
