import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./contentSlice";
import interfaceReducer from "./interfaceSlice";
import playerReducer from "./playerSlice";
import roomReducer from "./roomSlice";

export default configureStore({
  reducer: {
    interface: interfaceReducer,
    content: contentReducer,
    player: playerReducer,
    room: roomReducer
  },
});