import { Box, Button, IconButton, InputAdornment, MenuItem, Modal, Select, TextField } from "@mui/material";
import styles from "../styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

type AddTaskModalProps = {
    openAddTaskModal: boolean,
    setOpenAddTaskModal: (open: boolean) => void,
    newTask: {
        title: string,
        description: string,
        status: string,
        priority: string,
        dueDate: string,
        tags: string,
    },
    setNewTask: (task: {
        title: string,
        description: string,
        status: string,
        priority: string,
        dueDate: string,
        tags: string,
    }) => void,
    handleSubmit: (e: React.FormEvent) => void,
}

export default function AddTaskModal({ openAddTaskModal, setOpenAddTaskModal, newTask, setNewTask, handleSubmit }: AddTaskModalProps) {
    const handleOnSubmit = (e: React.FormEvent) => {
        handleSubmit(e);
        setOpenAddTaskModal(!openAddTaskModal)
    }
    return (
        <Modal
            open={openAddTaskModal}
            onClose={() => setOpenAddTaskModal(!openAddTaskModal)}
            aria-labelledby="add-task-modal"
            aria-describedby="adding-task"
            sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center'}}
        >
            <Box
                component="form"
                onSubmit={(e) => handleOnSubmit(e)}
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
                    name="dueDate"
                    // label="Due Date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    fullWidth
                    required
                    type="date"
                    // InputLabelProps={{
                    //     shrink: true, // keeps the label visible when a date is selected
                    // }}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <CalendarTodayIcon sx={{ color: "#000000de" }} />
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    sx={{
                        input: { color: "#000000de" },
                        label: { color: "#000000de" },
                    }}
                />
                <Select
                    labelId="role-label"
                    id="role"
                    value={newTask.priority}
                    label="Select Priority"
                    sx={{
                        input: { color: "#000000de" },
                        label: { color: "#000000de" },
                    }}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </Select>
                <Select
                    labelId="role-label"
                    id="role"
                    value={newTask.status}
                    label="Select Status"
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                    <MenuItem value="todo">Todo</MenuItem>
                    <MenuItem value="in_progress">In-Progress</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                </Select>
                <Select
                    labelId="role-label"
                    id="tags"
                    value={newTask.tags}
                    label="Select Tags/Label"
                    onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                >
                    <MenuItem value="feature">Feature</MenuItem>
                    <MenuItem value="enhancement">Enhancement</MenuItem>
                    <MenuItem value="bug">Bug</MenuItem>
                </Select>
                <Button type="submit" variant="contained" color="primary">
                    Add New Task
                </Button>
            </Box>
        </Modal>
    )
}