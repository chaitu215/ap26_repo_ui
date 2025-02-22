import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import adminReducer from "./slices/adminSlice";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

// Uses configureStore from Redux Toolkit.
// Registers reducers (adminReducer).
// Disables Redux Thunk (since Saga is used instead).
// Adds Saga middleware to handle asynchronous flows.

const store = configureStore({
    reducer: {
      admin: adminReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
      // devTools: process.env.NODE_ENV !== "production", // ✅ Enables Redux DevTools in development
  });
  
//Starts the root saga, which listens for dispatched Redux actions.
sagaMiddleware.run(rootSaga);

export default store;