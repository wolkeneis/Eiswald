import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./contentSlice";
import interfaceReducer from "./interfaceSlice";

export default configureStore({
  reducer: {
    interface: interfaceReducer,
    content: contentReducer
  },
});