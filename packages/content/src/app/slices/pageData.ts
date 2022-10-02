import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TPageData } from "@rju/types";

import type { RootState } from "../store";

const initialState: TPageData = {
  children: [],
};

export const pageDataSlice = createSlice({
  name: "pageData",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<TPageData>) => {
      state.children = action.payload.children;
    },
  },
});

export const { update } = pageDataSlice.actions;
export const selectJson = (state: RootState) => state.pageData.children;

export default pageDataSlice.reducer;
