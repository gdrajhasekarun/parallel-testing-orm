import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Results {
    loading?: boolean;
    errorMessage?: string;
    message?: string;
}
export interface ApiState extends Results{
    sheetName: string,
}

export interface Columns {
    [key: string]: string[]
}

export interface ParallelTest {
    apiState: ApiState;
    columns: Columns;
    testPayload: RunParallelTest
}

const initialState: ParallelTest = {
    apiState: {
        sheetName: '',
        loading: false,
    },
    columns:{

    },
    testPayload: {
        sourceSheet: "",
        targetSheet: "",
        primaryColumns: [],
        excludedColumns: []
    }
}

export interface RunParallelTest extends Results{
    sourceSheet: string,
    targetSheet: string,
    primaryColumns: string[],
    excludedColumns: string[],
    compareSessionName?: string
    jobId?:string;
    statusMessage?:string;
    executionCount?: ExecutionCount;
}

export interface ExecutionCount {
    yetToRun: string;
    pass: string;
    fail: string;
}

function formatDateTime(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}_${day}_${year}_${hours}_${minutes}_${seconds}`;
}

export const getSheet = createAsyncThunk(
    "parallel-test/getSheetNames",
    async ({ sheetName }: { sheetName: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`api/batch/columns?` + new URLSearchParams({
                sheetName:sheetName,
            }).toString())
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return {data};
        } catch (error) {
            return rejectWithValue("Error Fetching Sheet Column names");
        }
    }
)

export const triggerParallelTest = createAsyncThunk(
    "parallel-test/setUpParallelTest",
    async ({ sourceSheet, targetSheet, primaryColumns, excludedColumns, compareSessionName }: RunParallelTest,
           { rejectWithValue }) => {
        try {
            const response = await fetch(`api/batch/compare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sourceTable: sourceSheet,
                    targetTable:targetSheet,
                    primaryColumns: primaryColumns,
                    excludedColumns: excludedColumns,
                    compareSessionName: compareSessionName
                })
            })
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return {data};
        } catch (error) {
            return rejectWithValue("Error Running Parallel Test");
        }
    }
)

export const runParallelTest = createAsyncThunk(
    "parallel-test/runParallelTest",
    async ({ jobId }: { jobId: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`api/batch/compare?` + new URLSearchParams({
                jobId:jobId,
            }).toString())
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return {data};
        } catch (error) {
            return rejectWithValue("Error Triggering Execution");
        }
    }
)

export const getExecutionStatus = createAsyncThunk(
    "parallel-test/getExecutionStatus",
    async ({ jobId, sessionName }: { jobId: string, sessionName: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`api/batch/status?` + new URLSearchParams({
                jobId:jobId,
                sessionName: sessionName
            }).toString())
            if (!response.ok)
                throw new Error('Error response was received');
            const data = await response.json();
            return {data};
        } catch (error) {
            return rejectWithValue("Error getting status");
        }
    }
)

export const downloadExcel = createAsyncThunk(
    "parallel-test/downloadExcel",
    async ({ jobId }: { jobId: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`api/batch/download?jobId=${jobId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            // Convert response to blob
            const blob = await response.blob();

            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Results.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            return "Download started";
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const parallelTestSlice = createSlice({
    name: 'parallel-test',
    initialState,
    reducers: {
        toggleColumns: (state, action: PayloadAction<{header: string, checked: string}>) =>{
            const checked = action.payload.checked
            if(state.columns[action.payload.header]){
                if(state.columns[action.payload.header].includes(checked)){
                    state.columns[action.payload.header] = state.columns[action.payload.header].filter(c => c !== checked);
                }else{
                    state.columns[action.payload.header].push(checked)
                }
            }else{
                state.columns[action.payload.header] = [checked]
            }
        },
        clearMessage: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSheet.pending, (state, action ) => {
                state.apiState.loading = true;
                state.apiState.sheetName = action.meta.arg.sheetName
                state.apiState.errorMessage = '';
            })
            .addCase(getSheet.fulfilled, (state, action) => {
                state.apiState.loading = false;
                state.columns['source'] = action.payload.data
                state.testPayload.statusMessage="";
                state.testPayload.jobId="";
            })
            .addCase(getSheet.rejected, (state, action) => {
                state.apiState.loading = false;
                state.apiState.errorMessage = action.payload as string
            })
            .addCase((triggerParallelTest.pending), (state, action) => {
                state.testPayload = action.meta.arg
                state.testPayload.compareSessionName = `Result ${formatDateTime(new Date())}`
                state.testPayload.loading = true
            })
            .addCase((triggerParallelTest.fulfilled), (state, action) => {
                state.testPayload!.jobId = action.payload.data.jobId;
                state.testPayload!.loading = false
            })
            .addCase((triggerParallelTest.rejected), (state, action) => {
                state.testPayload!.loading = false;
                state.testPayload!.errorMessage = action.payload as string
            })
            .addCase((runParallelTest.pending), (state, action) => {
                state.testPayload!.loading = true;
                state.testPayload!.jobId = action.meta.arg.jobId;
            })
            .addCase((runParallelTest.fulfilled), (state,action) => {
                console.log(action.payload)
                state.testPayload.loading = false;
                state.testPayload.jobId = action.payload.data.jobId;
                state.testPayload.statusMessage = "Started"
                state.testPayload.executionCount = {
                    pass: "0",
                    fail: "0",
                    yetToRun: "0"
                };
            })
            .addCase((runParallelTest.rejected), (state, action) => {
                state.testPayload.loading = false;
                state.testPayload.errorMessage = action.payload as string
            })
            .addCase((getExecutionStatus.fulfilled), (state, action) => {
                console.log(state.testPayload)
                if(!state.testPayload.executionCount){
                    state.testPayload.executionCount = {
                        pass: "0",
                        fail: "0",
                        yetToRun: "0"
                    };
                }
                state.testPayload.executionCount.pass = action.payload.data.Pass;
                state.testPayload.executionCount.yetToRun = action.payload.data.Pending;
                state.testPayload.executionCount.fail = action.payload.data.Fail;
                state.testPayload.statusMessage = action.payload.data.ExecutionStatus;
            })
            .addCase((getExecutionStatus.rejected), (state, action) =>{
                state.testPayload.statusMessage = "Failed"
                console.log(action.payload as string)
            })
    }
})


export const { toggleColumns, clearMessage } = parallelTestSlice.actions;
export default parallelTestSlice.reducer;