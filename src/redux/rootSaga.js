import { all } from "redux-saga/effects";
import { watchFetchUsers } from "./saga/adminSaga";

// rootSaga is the entry point for Redux Saga.
// yield all([...]) runs multiple sagas concurrently.
// watchFetchUsers() should listen for specific Redux actions and handle them.

export default function* rootSaga() {
  yield all([
    watchFetchUsers(),
  ]);
}