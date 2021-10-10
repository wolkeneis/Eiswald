import { createSlice } from "@reduxjs/toolkit";

export const interfaceSlice = createSlice({
  name: "interface",
  initialState: {
    native: undefined,
    mobile: undefined,
    theme: "dark-theme"
  },
  reducers: {
    setNative: (state, action) => {
      state.native = action.payload;
    },
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },

    selectTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark-theme" ? "light-theme" : "dark-theme";
    }
  }
});

export const { setNative, setMobile } = interfaceSlice.actions;
export const { selectTheme, toggleTheme } = interfaceSlice.actions;

export default interfaceSlice.reducer;