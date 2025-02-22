import { call, put, takeLatest } from "redux-saga/effects";
import { fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure } 
    from "../slices/adminSlice";

function* fetchUsersSaga() {
  try {
    const token = localStorage.getItem("token");
    const response = yield call(fetch, "http://localhost:5000/api/user/admin", {
      headers: { Authorization: `${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = yield response.json();
    yield put(fetchUsersSuccess(data.users));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

export function* watchFetchUsers() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
}