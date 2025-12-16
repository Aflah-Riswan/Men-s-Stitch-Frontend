
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice"
import categoryReducer from './slice/categorySlice'
import productReducer from './slice/productSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    category : categoryReducer,
    product : productReducer,
  },
});

export default store;

