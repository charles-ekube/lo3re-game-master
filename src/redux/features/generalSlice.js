import { createSlice } from "@reduxjs/toolkit";


const localLotteryForm = JSON.parse(localStorage.getItem("lotteryForm") || "{}");

export const general = createSlice({
  name: "general",
  initialState: {
    showSidebar: false,
    addLotteryForm: Object.keys(localLotteryForm).length
      ? localLotteryForm
      : {},
    bankTransferBeneficiaryForm: {
      account_number: "",
      account_name: "",
      bank_id: "",
      bank_code: "",
      bank_name: "",
      saveForLater: false,
      account_type: "",
      sort_code: "",
      routing_number: "",
      note: "",
    },
    cryptoBeneficiaryForm: {
      coin_id: "",
      network: "",
      address: "",
      tag_id: "",
      saveForLater: false,
    },
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    updateAddLotteryForm: (state, action) => {
      state.addLotteryForm = action.payload;
      localStorage.setItem("lotteryForm", JSON.stringify(action.payload));
    },
    setBankTransferBeneficiaryForm: (state, action) => {
      state.bankTransferBeneficiaryForm = action.payload;
    },
    setCryptoBeneficiaryForm: (state, action) => {
      state.cryptoBeneficiaryForm = action.payload;
    },
    resetBankTransferBeneficiaryForm: (state) => {
      state.bankTransferBeneficiaryForm = {
        account_number: "",
        account_name: "",
        bank_id: "",
        bank_code: "",
        bank_name: "",
        saveForLater: false,
        account_type: "",
        sort_code: "",
        routing_number: "",
        note: "",
      };
    },
    resetCryptoBeneficiaryForm: (state) => {
      state.cryptoBeneficiaryForm = {
        coin_id: "",
        network: "",
        address: "",
        tag_id: "",
      };
    },
  },
});

export const {
  toggleSidebar,
  updateAddLotteryForm,
  setBankTransferBeneficiaryForm,
  resetBankTransferBeneficiaryForm,
  setCryptoBeneficiaryForm,
  resetCryptoBeneficiaryForm,
} = general.actions;
export default general.reducer;
