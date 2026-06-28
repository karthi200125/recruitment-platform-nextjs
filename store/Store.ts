
import { configureStore } from '@reduxjs/toolkit';
import ModelSlice from './ModalSlice';

const Store = configureStore({
    reducer: {
        modal: ModelSlice
    },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
