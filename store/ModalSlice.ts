import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
    modals: Record<string, boolean>; 
}

const initialState: ModalState = {
    modals: {},
};

const ModalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<string>) => {
            state.modals[action.payload] = true; 
        },
        closeModal: (state, action: PayloadAction<string>) => {
            state.modals[action.payload] = false;
        },
    },
});

export const { openModal, closeModal } = ModalSlice.actions;
export default ModalSlice.reducer;
