import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInExecution: (state) => {
      state.isLoading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    signInFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signUpSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    updateUserExecute: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateUserFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInExecution,
  signInSuccess,
  signInFailed,
  signUpSuccess,
  updateUserExecute,
  updateUserFailed,
  updateUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
