import React, {useEffect} from "react";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup
} from "@mui/material";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {setSheetName, uploadFilesStatus} from "../../store/feature/sheetselector.ts";


const DatabaseViewer: React.FC<{origin: string}> = ({origin}) => {
    const dispatch = useDispatch<AppDispatch>();
    const source = useSelector((state: RootState) => state.sheetSelector.dataSource[origin]?.origin || '')
    const sheetNames= useSelector((state: RootState) => state.sheetSelector.dataSource[origin]?.sheetNames || []);
    const sheetName = useSelector((state: RootState) => state.sheetSelector.dataSource[origin]?.selectedSheetName || '');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSheetName({
            origin,
            sheetName: (event.target as HTMLInputElement).value
        }))
    }

    useEffect(() => {
        dispatch(uploadFilesStatus({
            origin,
            source
        }))
    }, [dispatch]);

    return(
        <Box>
            <Box>
                {sheetNames.length > 0 && (
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel id="demo-controlled-radio-buttons-group">Select a sheet</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={sheetName}
                            onChange={handleChange}
                        >
                            {sheetNames.map((sheet) => (
                                <FormControlLabel value={sheet} control={<Radio />} label={sheet} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}
            </Box>
        </Box>


    )
}

export default DatabaseViewer;