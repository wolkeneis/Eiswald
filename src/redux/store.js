import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./contentSlice";
import interfaceReducer from "./interfaceSlice";
import playerReducer from "./playerSlice";
import roomReducer from "./roomSlice";
import socialReducer from "./socialSlice";

export default configureStore({
  reducer: {
    social: socialReducer,
    interface: interfaceReducer,
    content: contentReducer,
    player: playerReducer,
    room: roomReducer
  },
});