import { createSlice } from "@reduxjs/toolkit";

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    source: undefined,
    volume: 0.5,
    duration: undefined,
    time: 0,
    played: 0,
    loaded: 0,
    playing: true
  },
  reducers: {
    setSource: (state, action) => {
      state.source = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    setPlayed: (state, action) => {
      state.played = action.payload;
    },
    setLoaded: (state, action) => {
      state.loaded = action.payload;
    },

    play: (state, action) => {
      state.playing = action.payload !== undefined ? !!action.payload : true;
    },
    pause: (state) => {
      state.playing = false;
    }
  }
});

export const { setSource, setVolume, setDuration, setTime, setPlayed, setLoaded } = playerSlice.actions;
export const { play, pause } = playerSlice.actions;

export default playerSlice.reducer;