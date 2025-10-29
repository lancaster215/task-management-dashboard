import { Box, Button, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import styles from "../styles";

type AddTaskModalProps = {
    openAddTaskModal: boolean,
    setOpenAddTaskModal: (open: boolean) => void,
    newTask: {
        title: string,
        description: string,
        status: string,
        priority: string,
        dueDate: string,
    },
    setNewTask: (task: {
        title: string,
        description: string,
        status: string,
        priority: string,
        dueDate: string,
    }) => void,
    handleSubmit: (e: React.FormEvent) => void,
}

export default function AddTaskModal({ openAddTaskModal, setOpenAddTaskModal, newTask, setNewTask, handleSubmit }: AddTaskModalProps) {
    return (
        <Modal
            open={openAddTaskModal}
            onClose={() => setOpenAddTaskModal(!openAddTaskModal)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={styles.formBox}
            >
                <TextField
                    label="Task title"
                    name="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    fullWidth
                    required
                />
                <TextField
                    label="Describe your task"
                    name="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    fullWidth
                    required
                />
                <TextField
                    label="Due date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    fullWidth
                    required
                    type="date"
                />
                <Select
                    labelId="role-label"
                    id="role"
                    value={newTask.status}
                    label="Select Priority"
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hihg">High</MenuItem>
                </Select>
                <Select
                    labelId="role-label"
                    id="role"
                    value={newTask.status}
                    label="Select Status"
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                    <MenuItem value="todo">Todo</MenuItem>
                    <MenuItem value="inProgress">In-Progress</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                </Select>
                <Button type="submit" variant="contained" color="primary">
                    Add New Task
                </Button>
            </Box>
        </Modal>
    )
}