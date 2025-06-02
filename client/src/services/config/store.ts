import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { coreApi } from "./apiBase";

const slices = {};

const appReducers = combineReducers({
  [coreApi.reducerPath]: coreApi.reducer,
  ...slices,
});

export const setupStore = (preloadedState?: Omit<RootState, "api">) => {
  return configureStore({
    reducer: appReducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(coreApi.middleware),
    preloadedState,
  });
};

export type RootState = ReturnType<typeof appReducers>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
