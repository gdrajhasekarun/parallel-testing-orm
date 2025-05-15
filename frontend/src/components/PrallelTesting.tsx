import {Box, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store.ts";
import ParallelTestingFileSection from "./subcomponents/ParallelTestingFileSection.tsx";
import {useEffect} from "react";
import {resetFileSection} from "../store/feature/fileupload.ts";
import ParallelTestingColumnSection from "./subcomponents/ParallelTestingColumnSection.tsx";
import ResultTable from "./subcomponents/ResultTable.tsx";
// import {deleteAllSheets} from "../store/feature/parallettest.ts";


const ParallelTesting: React.FC = () => {
    const sourceSheetName = useSelector((state: RootState) => state.sheetSelector.dataSource['source']?.selectedSheetName || '');
    const targetSheetName = useSelector((state: RootState) => state.sheetSelector.dataSource['target']?.selectedSheetName || '');
    const isSheetSelected = sourceSheetName.length > 0 && targetSheetName.length > 0 ;
    const dispatch = useDispatch<AppDispatch>();
    const message = useSelector((state: RootState) => state.parallelTest.testPayload?.statusMessage || "")

    useEffect(() => {
        // dispatch(resetFileSection({origins: ['source', 'target']}))
        dispatch(resetFileSection())
        // dispatch(deleteAllSheets())
    }, [dispatch])

    return(
        <>
            <Typography variant="h3">
                Parallel Testing tool
            </Typography>
            {isSheetSelected && <Box>
                <Typography variant="h6">Comparison between {sourceSheetName} and {targetSheetName}</Typography>
            </Box>}
            {!isSheetSelected && <ParallelTestingFileSection/>}
            {isSheetSelected && <ParallelTestingColumnSection sourceSheet={sourceSheetName} targetSheet={targetSheetName}/>}
            {message.length!==0 && <ResultTable/>}
        </>
    )
}

export default ParallelTesting