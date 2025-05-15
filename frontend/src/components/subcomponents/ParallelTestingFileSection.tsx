import {Box, Button} from "@mui/material";
import FileHandler from "./FileHandler.tsx";
import DataSourceSelector from "./DataSourceSelector.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useEffect} from "react";
import {removeDataSource} from "../../store/feature/sheetselector.ts";
import {getDataSource} from "../../store/feature/fileupload.ts";


const ParallelTestingFileSection: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const sourceData = useSelector((state: RootState) => state.sheetSelector.dataSource['source']?.origin || '')
    const targetData = useSelector((state: RootState) => state.sheetSelector.dataSource['target']?.origin || '')

    const keys = useSelector((state: RootState) => {
        return Object.keys(state.sheetSelector.dataSource);
    })

    const handleBackButton = () => {
        keys.forEach(item => {
            dispatch(removeDataSource({
                source: item
            }))
        })
    }

    useEffect(() => {
        dispatch(getDataSource())
    }, [dispatch]);

    return(
        <>
        {sourceData.length !== 0 && targetData.length !== 0 && <Box style={{ display:'inline-block', width: '100%'}}>
                <Button variant="text" sx={{ mt: 2, display: 'flex', float:'right' }}
                        onClick={handleBackButton}
                > <ArrowBackIcon fontSize={'small'}/> Back</Button>
            </Box>}
            <Box sx={{
                display: 'inline-flex',
                width: "100%",
                height: '45%',
                justifyContent:'center'
            }}>

                {sourceData.length === 0 && <DataSourceSelector title="source" key="source"/>}
                {targetData.length === 0 && <DataSourceSelector title="target" key="target"/>}
                {sourceData.length !== 0 && <FileHandler title='source' key="source"></FileHandler>}
                {targetData.length !== 0 && <FileHandler title='target' key="target"></FileHandler>}
            </Box>
        </>
    )
}

export default ParallelTestingFileSection