import { createSlice } from "@reduxjs/toolkit";

// TODO: persist user detail



const localLotteryForm = JSON.parse(localStorage.getItem("lotteryForm") || "{}");

export const general = createSlice({
  name: "general",
  initialState: {
    showSidebar: false,
    userDetail: {},
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
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    updateUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
    updateAddLotteryForm: (state, action) => {
      state.addLotteryForm = action.payload;
      localStorage.setItem("lotteryForm", JSON.stringify(action.payload));
    },
    setBankTransferBeneficiaryForm: (state, action) => {
      state.bankTransferBeneficiaryForm = action.payload;
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
  },
});

export const {
  toggleSidebar,
  updateUserDetail,
  updateAddLotteryForm,
  setBankTransferBeneficiaryForm,
  resetBankTransferBeneficiaryForm,
} = general.actions;
export default general.reducer;
