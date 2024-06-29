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
  },
});

export const { signInExecution, signInSuccess, signInFailed, signUpSuccess } =
  userSlice.actions;

export default userSlice.reducer;
