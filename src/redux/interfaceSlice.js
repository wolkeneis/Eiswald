import { createSlice } from "@reduxjs/toolkit";

export const interfaceSlice = createSlice({
  name: "interface",
  initialState: {
    native: undefined,
    theme: "dark-theme",
    nodeSettings: false
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
    },

    showNodeSettings: (state) => {
      state.nodeSettings = true;
    },
    hideNodeSettings: (state) => {
      state.nodeSettings = false;
    }
  }
});

export const { setNative } = interfaceSlice.actions;
export const { selectTheme, toggleTheme } = interfaceSlice.actions;
export const { showNodeSettings, hideNodeSettings } = interfaceSlice.actions;

export default interfaceSlice.reducer;