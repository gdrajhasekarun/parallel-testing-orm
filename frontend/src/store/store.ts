import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './feature/fileupload.ts'
import parallelReducer from './feature/parallettest.ts'
import sheetReducer from './feature/sheetselector.ts'

export const store = configureStore({
    reducer: {
        fileUpload: fileReducer,
        sheetSelector: sheetReducer,
        parallelTest: parallelReducer,
    },
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;