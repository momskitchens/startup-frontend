import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    momData: null
}

const momAuthSlice = createSlice({
    name: "momAuth",
    initialState,
    reducers:{
        login: (state , action) => {
            state.status = true
            state.momData = action.payload.momData
        },
        logout: (state) => {
        state.status = false
        state.momData = null
        }
    }
})

export const {login,logout} = momAuthSlice.actions;

export default momAuthSlice.reducer;