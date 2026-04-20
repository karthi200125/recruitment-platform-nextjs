
import { configureStore } from '@reduxjs/toolkit';
import ModelSlice from './ModalSlice';

const Store = configureStore({
    reducer: {        
        modal: ModelSlice
    },
});


export default Store;
