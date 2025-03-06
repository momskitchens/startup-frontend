import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./userAuthSlice";
import momAuthSlice from "./momAuthSlice";

const store = configureStore({
    reducer: {
        userAuth : authSlice,
        momAuth : momAuthSlice
    }
})

export default store;