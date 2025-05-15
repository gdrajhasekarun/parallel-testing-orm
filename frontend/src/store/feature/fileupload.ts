import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface FileMetadata {
    name: string;
    size: number;
    type: string;
}

// export interface FileUpload {
//     filesMetaData?: FileMetadata[];
//     files: File[]// Store only metadata
//     loading?: boolean
//     isFilesUploaded?: boolean
//     fileViewAccessed?: boolean;
//     sheetNames?: string[]
//     sheetName?: string
// }

// export interface FileUploadState {
//     [key: string]: FileUpload;
// }

export interface OriginFileDetail{
    filesMetaData?: FileMetadata[];
    files: File[]
    origin: string
    fileTableView: boolean
    origins: string[]
    popupViewer: boolean
}

export interface DataUpload {
    filesDetails: OriginFileDetail
    fileUploadStatus: FileUploadStatus
}

export interface FileUploadStatus {
    filestatus?: FileStatus[]
    status?: Status
}

export interface FileStatus {
    id: number
    FileName: string
    UPLOAD_STATUS: string
}

export interface Status {
    pass: number;
    fail: number;
    yet: number;
}

const initialState: DataUpload = {
    filesDetails: {
        fileTableView: true,
        files:[],
        origin: '',
        origins: [],
        popupViewer: false
    },
    fileUploadStatus: {
        filestatus: []
    }
};
// Async thunk for handling file upload API
export const deleteAllSheets = createAsyncThunk(
    "file-upload/deleteAllSheets",
    async (_, { rejectWithValue }) => {
        try {
            // // Simulate API call (Replace this with actual API call)
            // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
            // return { origin };
            const response = await fetch(`api/batch/clearData`, {
                method: 'GET'
            })
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return {data};
        } catch (error) {
            return rejectWithValue("Upload failed");
        }
    }
);

// Async thunk for handling file upload API
export const uploadFiles = createAsyncThunk(
    "file-upload/uploadFiles",
    async ({ origin, files }: { origin: string; files: File[] }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("file", file));
            formData.append("db_source", origin)

            // // Simulate API call (Replace this with actual API call)
            // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
            // return { origin };
            const response = await fetch(`api/batch/upload`, {
                method: 'POST',
                body: formData
            })
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return {origin, data};
        } catch (error) {
            return rejectWithValue("Upload failed");
        }
    }
);

// Async thunk for handling file upload status API
export const uploadFilesStatus = createAsyncThunk(
    "file-upload/uploadFilesStatus",
    async (_, { rejectWithValue }) => {
        try {

            // // Simulate API call (Replace this with actual API call)
            // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
            // return { origin };
            const response = await fetch(`api/batch/upload-status`, {
                method: 'GET',
            })
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return { data};
        } catch (error) {
            return rejectWithValue("Upload failed");
        }
    }
);

// Async thunk for handling file upload status API
export const getDataSource = createAsyncThunk(
    "file-upload/getDataSource",
    async (_, { rejectWithValue }) => {
        try {

            // // Simulate API call (Replace this with actual API call)
            // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
            // return { origin };
            const response = await fetch(`api/batch/data-source`, {
                method: 'GET',
            })
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return { data};
        } catch (error) {
            return rejectWithValue("Upload failed");
        }
    }
);

export const fileUploadSlice = createSlice({
    name: 'file-upload',
    initialState,
    reducers: {
        addFiles: (state, action: PayloadAction<{files: File[]}>) => {
            const metadata = action.payload.files.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
            state.filesDetails = {
                ...state.filesDetails,
                files: [...state.filesDetails?.files || [] , ...action.payload.files],
                filesMetaData: [...state.filesDetails?.filesMetaData || [], ...metadata]
            }
        },
        addOrigin: (state, action: PayloadAction<{origin: string}>) => {
            state.filesDetails.origin = action.payload.origin
        },
        removeFile: (state, action: PayloadAction<{ index: number }>) => {
            state.filesDetails.files?.splice(action.payload.index, 1);
            state.filesDetails.filesMetaData?.splice(action.payload.index, 1);
        },
        changeView: (state, action: PayloadAction<{data: boolean}>) => {
            state.filesDetails.fileTableView = action.payload.data;
        },
        showDialog: state => {
            state.filesDetails.popupViewer = true
        },
        hideDialog: state => {
            state.filesDetails.popupViewer = false
        },
        addOrigins: (state, action: PayloadAction<{origin: string}>) => {
          state.filesDetails.origins = [...state.filesDetails.origins, action.payload.origin]
        },
        // goToSheet: (state, action:PayloadAction<{origin: string}>) => {
        //     // state[action.payload.origin].isFilesUploaded = true;
        // },
        // setSheetName: (state, action: PayloadAction<{origin: string, sheet: string}>) => {
        //     // state[action.payload.origin].sheetName = action.payload.sheet;
        // },
        // resetFileSection: (state, action: PayloadAction<{origins: string[]}>) => {
        //     action.payload.origins.forEach(origin => {
        //         if (!state[origin]) {
        //             state[origin] = { files: [], sheetNames: [], sheetName: '' }; // Initialize if undefined
        //         }
        //         state[origin].sheetName = '';
        //     })
        // }
        resetFileSection: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFiles.pending, (state) => {
                state.filesDetails.fileTableView = false;
            })
            .addCase(uploadFiles.fulfilled, (state) => {
                state.filesDetails.fileTableView = true;
                state.fileUploadStatus.status ??= {pass: 0, fail: 0, yet: -1}
            })
            .addCase(uploadFiles.rejected, (state) => {
                state.filesDetails.fileTableView = false;
            })
            .addCase(uploadFilesStatus.pending, (state) => {
                state.fileUploadStatus.filestatus = []
            })
            .addCase(uploadFilesStatus.fulfilled, (state, action: PayloadAction<{data: FileUploadStatus}>) => {
                state.fileUploadStatus = action.payload.data;
            })
            .addCase(uploadFilesStatus.rejected, () => initialState)
            .addCase(getDataSource.fulfilled, (state, action) => {
                state.filesDetails.origins = [...action.payload.data]
            })
            .addCase(deleteAllSheets.fulfilled, () => initialState)
    },
});

export const { addFiles, removeFile, changeView, resetFileSection, addOrigin, showDialog, addOrigins, hideDialog } = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
