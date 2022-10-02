import { configureStore } from "@reduxjs/toolkit";

import pageData from "./slices/pageData";

export const store = configureStore({
  reducer: {
    pageData,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
