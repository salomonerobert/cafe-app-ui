import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = {
    activeCafe: null,
    editCafe: null,
    editEmployee: null
}

const selectionSlice = createSlice({
    name: "selection",
    initialState,
    reducers: {
        setActiveCafe(state, action) {
            state.activeCafe = action.payload
        },
        setEditCafe(state, action) {
            state.editCafe = action.payload
        },
        setEditEmployee(state, action) {
            state.editEmployee = action.payload
        }
    }
})

const store = configureStore({
    reducer: selectionSlice.reducer
});

export const selectionActions = selectionSlice.actions;

export default store;