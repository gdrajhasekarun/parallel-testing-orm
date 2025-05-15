import React, {ChangeEvent, useEffect} from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    // LinearProgress,
    List,
    ListItem,
    ListItemText, MenuItem,
    Select, SelectChangeEvent
} from "@mui/material";
import {
    addFiles,
    addOrigin, changeView,
    DataUpload, getDataSource,
    removeFile,
    resetFileSection, showDialog,
    uploadFiles
} from "../../store/feature/fileupload.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import DialogPopup from "./DialogPopup.tsx";
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const FileUploader: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const fileUploadState: DataUpload = useSelector((state: RootState) => state.fileUpload)
    const selectedFiles = useSelector((state: RootState) => state.fileUpload.filesDetails?.filesMetaData || [])
    const isFilesUploadClicked = useSelector((state: RootState) => state.fileUpload.filesDetails?.fileTableView || false)
    const dataSource = useSelector((state: RootState) => state.fileUpload.filesDetails?.origins || [])

    // const loading= useSelector((state: RootState) => state.fileUpload[origin]?.loading || false);

    useEffect(() => {
        if(isFilesUploadClicked)
            dispatch(resetFileSection())
    }, [dispatch]);

    useEffect(() => {
        dispatch(getDataSource())
    }, [dispatch]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files)
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            dispatch(addFiles({ files: filesArray }));
        }
    };
    const handleRemoveFile = (index: number) => {
        dispatch(removeFile({ index }));
    };

    const uploadFile = () => {
        dispatch(uploadFiles({
            files: fileUploadState.filesDetails.files,
            origin: fileUploadState.filesDetails.origin
        }))
    }

    const handleChange = (e: SelectChangeEvent) => {
        dispatch(addOrigin({
            origin: e.target.value
        }))
    }
    const handleViewFiles = () => {
        dispatch(changeView({
            data: !isFilesUploadClicked
        }))
    }

    const handleAddDataSource = () => {
        dispatch(showDialog())
    }



    return (
        <Box sx={{
            height: '50%'
        }}>
            <DialogPopup />
            <Box sx={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                width: '50%',
                marginBottom: '2%'
            }}>
                <Button size="medium" onClick={handleAddDataSource}>Add New Data Source</Button>
            </Box>
            <Box sx={{
                display: 'inline-flex',
                justifyContent: 'flex-end',
                width: '50%',
                marginBottom: '2%'
            }}>
                <Button size="medium" onClick={handleViewFiles}>View Upload Status</Button>
            </Box>
            <Box sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                justifyContent: 'center',
                position:'sticky'
            }}>
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
                <Button variant="outlined" component="label" sx={{ mt: 2}}>
                    Browse
                    <input type="file" multiple hidden accept=".xls, .xlsx" onChange={handleFileChange} />
                </Button>
            </Box>
            {/*{loading && <LinearProgress sx={{ mt: 2 }} />}*/}
            <Box sx={{
                maxHeight: '45%',
                marginTop: '5%',
                position: "relative", // Ensure parent is positioned relative to sticky elements
                overflow: "auto",
            }}>
                {selectedFiles.length > 0 && (
                    <List sx={{ mt: 2 }}>
                        {selectedFiles.map((file, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`${file.name} (${file.size} bytes)`} />
                                <Button size="small" color="error" onClick={() => handleRemoveFile(index)}>
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
            <Box>
                <Button variant="contained" sx={{ mt: 2 }} onClick={uploadFile}>
                    Upload
                </Button>
            </Box>
        </Box>
    );
};

export default FileUploader;
