import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import {Box, Button} from "@mui/material";
import {changeView, deleteAllSheets, FileStatus, uploadFilesStatus} from "../../store/feature/fileupload.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {useEffect} from "react";




interface ColumnData {
    dataKey: keyof FileStatus;
    label: string;
    numeric?: boolean;
    width?: string;
}


const columns: ColumnData[] = [
    {
        width: '70%',
        label: 'File Name',
        dataKey: 'FileName',
    },
    {
        width: '30%',
        label: 'Upload Status',
        dataKey: 'UPLOAD_STATUS',
    },
];


const VirtuosoTableComponents: TableComponents<FileStatus> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props: any) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
    )),
    TableRow,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
    )),
};

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.numeric || false ? 'right' : 'left'}
                    style={{ width: column.width }}
                    sx={{ backgroundColor: 'background.paper' }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

function rowContent(_index: number, row: FileStatus) {
    return (
        <>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    align={column.numeric || false ? 'right' : 'left'}
                >
                    {row[column.dataKey]}
                </TableCell>
            ))}
        </>
    );
}

const FileUploadStatus: React.FC = () => {

    const status = useSelector((state: RootState) => state.fileUpload.fileUploadStatus?.status || {yet: -1})
    const dispatch = useDispatch<AppDispatch>();
    const rows = useSelector((state: RootState) => {
        return state.fileUpload.fileUploadStatus.filestatus || [];
    });
    const isFilesUploadClicked = useSelector((state: RootState) => state.fileUpload.filesDetails?.fileTableView || false)


    useEffect(() => {
        const interval = setInterval(() => {
            if(!status || status.yet !== 0){
                dispatch(uploadFilesStatus())
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [dispatch, status]);

    const handleBackToBrowse = () => {
        dispatch(changeView({
            data: !isFilesUploadClicked
        }))
    }

    const handleClearDataSource = () => {
        dispatch(deleteAllSheets())
    }

    return(
        <Box>
            <Box sx={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                width: '50%',
                marginBottom: '2%'
            }}>
                <Button size="medium" onClick={handleClearDataSource}>Clear Data Source</Button>
            </Box>
            <Box sx={{
                display: 'inline-flex',
                justifyContent: 'flex-end',
                width: '50%',
                marginBottom: '2%'
            }}>
                <Button size="medium" onClick={handleBackToBrowse}>Add File(s)</Button>
            </Box>
            <Paper style={{ height: 400, width: '100%' }}>
                <TableVirtuoso
                    data={rows}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={fixedHeaderContent}
                    itemContent={rowContent}
                />
            </Paper>
        </Box>
    )
}

export default FileUploadStatus;