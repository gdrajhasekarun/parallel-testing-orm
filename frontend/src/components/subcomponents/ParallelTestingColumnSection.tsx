import {Box, Button} from "@mui/material";
import TileComponent from "./TileComponent.tsx";
import ColumnViewer from "./ColumnViewer.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {clearMessage, runParallelTest, triggerParallelTest} from "../../store/feature/parallettest.ts";
import React, {useEffect} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {clearSheetName} from "../../store/feature/sheetselector.ts";


const ParallelTestingColumnSection: React.FC<{sourceSheet: string, targetSheet: string}> = ({sourceSheet, targetSheet}) => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedColumns = useSelector((state: RootState) => state.parallelTest.columns['primary'] || [])
    const excludedColumns = useSelector((state: RootState) => state.parallelTest.columns['excludeComparison'] || [])
    const message = useSelector((state: RootState) => state.parallelTest.testPayload?.statusMessage || "")
    const jobId = useSelector((state: RootState) => state.parallelTest.testPayload?.jobId || "")

    const keys = useSelector((state: RootState) => {
        const res = Object.keys(state.sheetSelector.dataSource)
        return res;
    })

    const handleRunComparison = () => {
        dispatch(triggerParallelTest({
            sourceSheet,
            targetSheet,
            primaryColumns: selectedColumns,
            excludedColumns
        }))
    }
    useEffect(() => {
        if(jobId.length>0){
            dispatch(runParallelTest({
                jobId
            }))
        }
    }, [dispatch, jobId])

    const handleBackButton = () => {
        keys.forEach(item => {
            dispatch(clearSheetName({
                origin: item
            }))
        })
        dispatch(clearMessage())
    }

    return(
        <>
            <Box style={{ display:'inline-block', width: '100%'}}>
                <Button variant="text" sx={{ mt: 2, display: 'flex', float:'right' }}
                    onClick={handleBackButton}
                > <ArrowBackIcon fontSize={'small'}/> Back</Button>
            </Box>
            <Box sx={{
                display: 'flex',
                width: "100%",
                height: '45%',
                justifyContent:'center'
            }}>
                <TileComponent>
                    <ColumnViewer origin='source' header='primary' key='source' />
                </TileComponent>
                <TileComponent>
                    <ColumnViewer origin='source' header='excludeComparison' key='target' />
                </TileComponent>
            </Box>
            <Button disabled={selectedColumns.length === 0 || (message.length> 0 && message.toLowerCase()!=='completed')} variant='contained' onClick={handleRunComparison}>Run Comparison</Button>
        </>
    )
}

export default ParallelTestingColumnSection