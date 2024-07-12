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
    deleteUserExecute: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    deleteUserFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signOutUserExecute: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    signOutUserFailed: (state, action) => {
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
  deleteUserExecute,
  deleteUserSuccess,
  deleteUserFailed,
  signOutUserExecute,
  signOutUserSuccess,
  signOutUserFailed,
} = userSlice.actions;

export default userSlice.reducer;
