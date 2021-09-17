import { createSlice } from "@reduxjs/toolkit";

export const interfaceSlice = createSlice({
  name: "interface",
  initialState: {
    native: undefined,
    theme: "dark-theme"
  },
  reducers: {
    setNative: (state, action) => {
      state.native = action.payload;
    },

    selectTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark-theme" ? "light-theme" : "dark-theme";
    }
  }
});

export const { setNative } = interfaceSlice.actions;
export const { selectTheme, toggleTheme } = interfaceSlice.actions;

export default interfaceSlice.reducer;