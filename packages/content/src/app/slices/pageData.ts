import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TListing } from "@rju/types";

import type { RootState } from "../store";

const initialState: TListing = {
  data: {
    after: null,
    before: null,
    children: [],
    dist: null,
  },
};

export const pageDataSlice = createSlice({
  name: "pageData",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<TListing>) => {
      state.data.children = action.payload.data.children;
    },
  },
});

export const { update } = pageDataSlice.actions;
export const selectJson = (state: RootState) => state.pageData.data.children;

export default pageDataSlice.reducer;
