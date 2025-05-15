import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import { addOrigins, hideDialog} from "../../store/feature/fileupload.ts";


const DialogPopup: React.FC = () => {
    const open = useSelector((state: RootState) => state.fileUpload.filesDetails.popupViewer)
    const dispatch = useDispatch<AppDispatch>();
    const handleClose = () => {
        dispatch(hideDialog())
    }

    const addNewOrigin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent form submission

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries()); // Convert to JSON object
        const datasource = formJson.datasource as string; // Extract datasource

        dispatch(addOrigins({ origin: datasource })); // Dispatch Redux action
        handleClose()
    };

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: addNewOrigin,
                },
            }}
        >
            <DialogTitle>Add Data Source</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    id="name"
                    name="datasource"
                    label="Data Source Name "
                    fullWidth
                    variant="filled"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant='contained'>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogPopup