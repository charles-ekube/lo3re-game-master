import React, { useState } from "react";
import { useDeleteBankBeneficiaryMutation } from "../../../redux/services/beneficiariesApi";
import CustomButtonII from "../../../utils/CustomButtonII";
import Modal from "../../../utils/Modal";
import { showError, showSuccess } from "../../../utils/Alert";
import BankIcon from "../../../assets/images/icons/bank.png";
import ThreeColumnRow from "../../../utils/ThreeColumnRow";
import { BsTrash3 } from "react-icons/bs";
import WasteCollection from "../../../assets/images/wastecollection.png";

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
        title={beneficiary?.title || beneficiary?.account_name}
        subtitle={
          <>
            <small>{bankName || "Account number"}:</small>{" "}
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
