import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import React, {useEffect,} from "react";
import {getDataSource} from "../../store/feature/fileupload.ts";
import TileComponent from "./TileComponent.tsx";
import {addDataSource} from "../../store/feature/sheetselector.ts";


const DataSourceSelector: React.FC<{title: string}> = ({title}) => {
    const dispatch = useDispatch<AppDispatch>();
    const dataSource = useSelector((state: RootState) => state.fileUpload.filesDetails?.origins || [])

    const handleChange = (e: SelectChangeEvent) => {
        dispatch(addDataSource({
            origin: e.target.value,
            source: title
        }))
    }

    useEffect(() => {
        if(dataSource.length == 0)
            dispatch(getDataSource())
    }, [dispatch]);

    const toTitleCase = (str: string) => {
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    return(
        <TileComponent>
            <Box sx={{
                position:'sticky',
                top: 0,               // Stick to the top of its parent container
                // backgroundColor: 'white', // Optional: Add background color to prevent overlap with content
                zIndex: 1,            // Optional: Ensures it's on top of other content
            }}>
                <Typography variant="h5">
                    {toTitleCase(title)} Data Source
                </Typography>
            </Box>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Data Source</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // value={age}
                    onChange={handleChange}
                    label="Age"
                >
                    {dataSource.length > 0 &&
                        dataSource.map(ds =>
                            <MenuItem value={ds} key={ds}>{ds}</MenuItem>)}
                </Select>
            </FormControl>
        </TileComponent>
    )
}

export default DataSourceSelector;