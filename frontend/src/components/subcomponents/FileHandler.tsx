import {Box, Typography} from "@mui/material";
// import {useDispatch, useSelector} from "react-redux";
// import {AppDispatch, RootState} from "../../store/store.ts";
import React from "react";
import DatabaseViewer from "./DatabaseViewer.tsx";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TileComponent from "./TileComponent.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";


const FileHandler: React.FC<{title: string}> = ({ title }) => {

    //const dispatch = useDispatch<AppDispatch>();
    // const loading= useSelector((state: RootState) => state.sheetSelector[origin].sheetViewAccessed || false);
    const origin = useSelector((state: RootState) => state.sheetSelector.dataSource[title]?.origin || '')

    const toTitleCase = (str: string) => {
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    // const handleBackButton = () => {
    //     dispatch(changeView({origin}))
    // }

    return(
        <TileComponent >
            <Box sx={{
                position:'sticky',
                top: 0,               // Stick to the top of its parent container
                // backgroundColor: 'white', // Optional: Add background color to prevent overlap with content
                zIndex: 1,            // Optional: Ensures it's on top of other content
            }}>
                <Typography variant="h5">
                    {toTitleCase(origin)} Tables(s)
                </Typography>
            </Box>
            <Box>
                <DatabaseViewer origin={title}/>
            </Box>
        </TileComponent>
    )
}

export default FileHandler;