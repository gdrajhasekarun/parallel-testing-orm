import {
    Box,
    Paper, styled,
    Table,
    TableBody,
    TableCell, tableCellClasses,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {useEffect} from "react";
import {downloadExcel, getExecutionStatus} from "../../store/feature/parallettest.ts";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1976d2",
        color: theme.palette.common.white,
        textAlign: "center",
        fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign: "center",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const ResultTable: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const pass = useSelector((state: RootState) => state.parallelTest.testPayload.executionCount?.pass || "")
    const fail = useSelector((state: RootState) => state.parallelTest.testPayload.executionCount?.fail || "")
    const yetToRun = useSelector((state: RootState) => state.parallelTest.testPayload.executionCount?.yetToRun || "")
    const status = useSelector((state: RootState) => state.parallelTest.testPayload.statusMessage || "")
    const jobId = useSelector((state: RootState) => state.parallelTest.testPayload.jobId || "")
    const sessionName = useSelector((state: RootState) => state.parallelTest.testPayload.compareSessionName || "")

    useEffect(() => {
        const interval = setInterval(() => {
            if(status.toLowerCase() !== 'completed'){
                dispatch(getExecutionStatus({
                    jobId,
                    sessionName
                }))
            }
        }, 2000)
        return () => clearInterval(interval);
    }, [dispatch, status])
    const handleDownload = () => {
        dispatch(downloadExcel({
            jobId
        }))
    };

    return(
        <Box>
            <Box sx={{
                display:"flex",
                justifyContent:"center",
                marginTop: "2%"
            }}>
                <img
                    src="/excelicon.png"
                    alt="Excel Icon"
                    style={{ width: 50, height: 50, cursor: "pointer" }}
                    onClick={handleDownload}
                />
            </Box>
            <Box sx={{
                display:"flex",
                justifyContent:"center",
                marginTop: "1%"
            }}>
                <TableContainer component={Paper} sx={{
                    width: '75%'
                }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Pass</StyledTableCell>
                                <StyledTableCell >Fail</StyledTableCell>
                                <StyledTableCell >Yet To Compare</StyledTableCell>
                                <StyledTableCell >Status</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow
                                key={"status"}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell >{pass}</StyledTableCell>
                                <StyledTableCell >{fail}</StyledTableCell>
                                <StyledTableCell >{yetToRun}</StyledTableCell>
                                <StyledTableCell >{status}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

export default ResultTable;