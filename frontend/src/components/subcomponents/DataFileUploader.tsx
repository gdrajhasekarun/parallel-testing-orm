import {Box, Typography} from "@mui/material";
import FileUploader from "./FileUploader.tsx";
import React from "react";
import TileComponent from "./TileComponent.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import FileUploadStatus from "./FileUploadStatus.tsx";


const DataFileHandler: React.FC<{origin: string}> = ({ origin }) => {

    const isFilesUploadClicked = useSelector((state: RootState) => state.fileUpload.filesDetails?.fileTableView || false)

    const toTitleCase = (str: string) => {
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };


    return(
        <TileComponent >
            <Box sx={{
                position:'sticky',
                top: 0,               // Stick to the top of its parent container
                // backgroundColor: 'white', // Optional: Add background color to prevent overlap with content
                zIndex: 1,            // Optional: Ensures it's on top of other content
            }}>
                <Typography variant="h5">
                    {toTitleCase(origin)} File(s)
                </Typography>
            </Box>
            {!isFilesUploadClicked && <FileUploader/>}
            {isFilesUploadClicked && <FileUploadStatus/>}
        </TileComponent>
    )
}

export default DataFileHandler;