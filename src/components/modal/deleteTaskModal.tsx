import { Box, Button, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import styles from "../styles";

type DeleteTaskModalProps = {
    openDeleteTaskModal: boolean,
    setOpenDeleteTaskModal: (open: boolean) => void,
    onYesButton: (e: React.FormEvent) => void,
    onNoButton: (e: React.FormEvent) => void,
    windowWidth: number,
}

export default function DeleteTaskModal({ openDeleteTaskModal, setOpenDeleteTaskModal, onYesButton, onNoButton, windowWidth }: DeleteTaskModalProps) {
    return (
        <Modal
            open={openDeleteTaskModal}
            onClose={() => setOpenDeleteTaskModal(!openDeleteTaskModal)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center'}}
        >
            <Box
                sx={[styles.formBox, { width: windowWidth <= 375 ? "50vw" : "100vw"}]}
            >
                <Typography sx={{color: 'black', fontSize: "clamp(10px, 1.5vw, 16px)"}}>Are you sure you want to delete this task?</Typography>
                <Button variant="contained" color="primary" onClick={onYesButton} sx={{ fontSize: "clamp(10px, 1.5vw, 16px)" }}>Yes</Button>
                <Button variant="outlined" color="error" onClick={onNoButton} sx={{ fontSize: "clamp(10px, 1.5vw, 16px)" }}>No</Button>
            </Box>
        </Modal>
    )
}