import React, {ChangeEvent, useEffect} from "react";
import {Box, Checkbox, FormControl, FormControlLabel, FormGroup, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {getSheet, toggleColumns} from "../../store/feature/parallettest.ts";


const ColumnViewer: React.FC<{origin: string, header: string}> = ({origin, header}) => {
    const dispatch = useDispatch<AppDispatch>();

    const sheetName = useSelector((state: RootState) => state.sheetSelector.dataSource[origin]?.selectedSheetName || '');
    const columnNames = useSelector((state: RootState) => state.parallelTest.columns[origin] || []);
    const selectedColumns = useSelector((state: RootState) => state.parallelTest.columns[header] || [])
    const toTitleCase = (str: string) => {
        return str
            .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
            .replace(/[_-]/g, " ") // Replace underscores and hyphens with space
            .trim() // Remove any leading spaces
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
            .join(" ");
    };

    useEffect(() => {
        if(sheetName.length > 0 && columnNames.length === 0) {
            dispatch(getSheet({
                sheetName: sheetName
            }))
        }
    }, [dispatch])

    const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleColumns({
            header,
            checked: e.target.name
        }))
    }

    return (
        <Box>
            <Box sx={{
                position:'sticky',
                top: 0,               // Stick to the top of its parent container
                // backgroundColor: 'white', // Optional: Add background color to prevent overlap with content
                zIndex: 1,            // Optional: Ensures it's on top of other content
            }}>
                <Typography variant="h5">
                    {toTitleCase(header)} Column(s)
                </Typography>
            </Box>
            {columnNames.length > 0 &&
                <FormControl component="fieldset">
                    {/*<FormLabel component="legend">{toTitleCase(header)} Column(s)</FormLabel>*/}
                    <FormGroup aria-label="position">
                        {columnNames.map(value => (
                            <FormControlLabel
                                key={value}
                                control={
                                    <Checkbox
                                        name={value}
                                        checked={selectedColumns.includes(value)}
                                        onChange={handleCheckBox}
                                    />
                                }
                                label={value}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                }
        </Box>
    )
}

export default ColumnViewer