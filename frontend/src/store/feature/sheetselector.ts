import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface FileUpload {
    origin?: string;
    sheetViewAccessed?: boolean;
    sheetNames?: string[]
    selectedSheetName?: string
}

// export interface SheetData {
//     [key: string]: FileUpload;
// }

export interface DataSource {
    // [key:string]: string
    [key: string]: FileUpload;
}

export interface SourceData {
    // sheetData: SheetData,
    dataSource: DataSource
}

const initialState: SourceData = {
    // sheetData: {},
    dataSource: {}
}

// Async thunk for handling file upload status API
export const uploadFilesStatus = createAsyncThunk(
    "sheet-selector/getAllSheets",
    async ({origin, source} :{origin: string, source: string}, { rejectWithValue }) => {
        try {
            const response = await fetch(`api/batch/tables-list/${source}`, {
                method: 'GET',
            })
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return { data, origin};
        } catch (error) {
            return rejectWithValue("Upload failed");
        }
    }
);

export const sheetSelector = createSlice({
    name: 'sheet-selector',
    initialState,
    reducers: {
        setSheetName: (state, action: PayloadAction<{origin: string, sheetName: string}>) =>{
            state.dataSource[action.payload.origin].selectedSheetName = action.payload.sheetName
        },
        clearSheetName: (state, action: PayloadAction<{origin:string}>) => {
            state.dataSource[action.payload.origin].selectedSheetName = ''
        },
        addDataSource: (state, action: PayloadAction<{origin: string, source: string}>) => {
            // state.dataSource[action.payload.source] = action.payload.origin;
            state.dataSource[action.payload.source] = { origin: action.payload.origin,
                sheetNames: [], selectedSheetName: ''}
        },
        removeDataSource: (state, action: PayloadAction<{source: string}>) => {
            if (state.dataSource[action.payload.source]) {
                // const value =  state.dataSource[action.payload.source];
                delete state.dataSource[action.payload.source];
                // delete state.sheetData[value]
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFilesStatus.fulfilled, (state, action) => {
                state.dataSource[action.payload.origin] ??= {sheetNames: [], selectedSheetName: ''}
                state.dataSource[action.payload.origin].sheetNames = [...action.payload.data]
            })
    }
})

export const {setSheetName, clearSheetName, addDataSource, removeDataSource} = sheetSelector.actions
export default sheetSelector.reducer;