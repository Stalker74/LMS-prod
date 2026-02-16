import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/apifn.types";

export interface IUtilSlice {
    screenWidth: number | null;
}    

const initialState: IUtilSlice = {
  screenWidth: null,
};

export const utilSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    dispatchscreenWidth: (state, action) => {
      state.screenWidth = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { dispatchscreenWidth } = utilSlice.actions;

export default utilSlice.reducer;
