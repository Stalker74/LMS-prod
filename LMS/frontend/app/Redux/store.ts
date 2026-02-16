import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Redux/UserSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";
import UtilReducer from "../Redux/UtilSlice";
import LayoutReducer from "../Redux/Layout";

const reducers = combineReducers({
  UserReducer,
  UtilReducer,
  LayoutReducer,
});

const config = {
  key: "root",
  storage,
};

const persistedReducers = persistReducer(config, reducers);

export const store = configureStore({
  reducer: persistedReducers,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
