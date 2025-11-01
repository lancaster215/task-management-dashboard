import { Props, Task } from "@/pages";
import { Autocomplete, Box, Button, Checkbox, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AddTaskModal from "../modal/addTaskModal";
import EnhancedTableHead from "../custom_components/EnhancedTableHead";
import { Data, Order } from "@/types/tableTypes";
import { getComparator } from "../../helpers/getComparator";
import EditTaskModal from "../modal/editTaskModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from "react-redux";
import { addTask } from "@/pages/store/taskSlice";
import DeleteTaskModal from "../modal/deleteTaskModal";
import { formattedDate } from "@/helpers/dateFormatter";

export default function TablePanel({task: initialTasks}: Props) {
    const dispatch = useDispatch();
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        dueDate: '',
        tags: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data | 'action'>('status');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [newStatus, setNewStatus] = useState<string>('todo');
    const [searchText, setSearchText] = useState<string>('');
    const [searchTextArr, setSearchTextArr] = useState<string[]>([]);
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const viewportWidth = window.innerWidth;
            setWindowWidth(viewportWidth)
        }
        const fetchTasks = async () => {
            const res = await fetch('/api/task');
            const latestTasks = await res.json();
            setTasks(latestTasks);
            dispatch(addTask(latestTasks))
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        if (!searchText.trim()) return;

        const delayDebounce = setTimeout(() => {
            setSearchTextArr((prev: string[]) => {
                const updated = [searchText, ...prev.filter(item => item !== searchText)];
                return updated.slice(0, 5);
            });
        }, 1000); // 1 second after typing stops, trigger function

        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data | 'action',
    ) => {
        const noSortHeaders = ['title', 'description', 'tags', 'dueDate']
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        
        if(!noSortHeaders.includes(property)){
            setOrderBy(property);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/addTask', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ 
                    title: newTask.title, 
                    description: newTask.description, 
                    status: newTask.status.toUpperCase(), 
                    priority: newTask.priority.toUpperCase(), 
                    dueDate: newTask.dueDate,
                    tags: newTask.tags.toUpperCase()
                })
            })

            if(res.ok) {
                const newTasks = await fetch('/api/task').then(r => r.json());
                setTasks(newTasks);
                dispatch(addTask(newTasks))
                setNewTask({ 
                    title: '', 
                    description: '', 
                    dueDate: '',
                    status: '',
                    priority: '',
                    tags: '',
                });
            }
        } catch (err) {
            console.error(`Error in adding task: ${err}`)
        }
    }

    const handleDelete = async() => {
        try {
            const res = await fetch('/api/removeTask', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({selected}) //array
            })

            if(res.ok) {
                const newTasks = await fetch('/api/task').then(r => r.json());
                dispatch(addTask(newTasks))
                setTasks(newTasks);
            }
        } catch (err) {
            console.error(`Error in removing task: ${err}`)
        }
    }

    const handleEditStatus = async (e?: SelectChangeEvent) => {
        if (e) {
            setNewStatus(e.target.value)
            try {
                const res = await fetch('/api/updateTaskStatus', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ 
                        id: selected, 
                        status: e.target.value.toUpperCase()
                    })
                })

                if(res.ok) {
                    const newTasks = await fetch('/api/task').then(r => r.json());
                    dispatch(addTask(newTasks))
                    setTasks(newTasks);
                }
            } catch (err) {
                console.error(`Error in removing task: ${err}`)
            }
        }
    }
    
    const handleEdit = (id: number) => {
        const taskToEdit = tasks.find((task) => task.id === id);
        if(taskToEdit) {
            setEditingId(id);
            setEditingTask({ ...taskToEdit });
        }
    }

    const handleSaveEdit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!editingId || !editingTask) return;
        console.log('editingTask.dueDate', editingTask.dueDate)
        try {
            const res = await fetch('/api/editTask', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    id: editingId, 
                    title: editingTask.title, 
                    description: editingTask.description, 
                    dueDate: editingTask.dueDate,
                    status: editingTask.status.toUpperCase(),
                    priority: editingTask.priority.toUpperCase(),
                    tags: editingTask.tags.toUpperCase(),
                })
            })

            if(res.ok) {
                const newTasks = await fetch('/api/task').then(r => r.json());
                console.log('newTasks', newTasks)
                dispatch(addTask(newTasks))
                setTasks(newTasks);
                setEditingId(null);
                setEditingTask(null);
            }
        } catch (err) {
            console.error(`Error in updating task: ${err}`)
        }
        
        setEditingId(null);
        // setEditedTaskName('');
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
        const newSelected = tasks.map((n) => n.id);
        setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }
        setSelected(newSelected);
    };

    const handleAutocompleteInputChange = (event: React.SyntheticEvent, value: string) => {
        setSearchText(value);
    }

    //memoize states that have the potential to create expensive rendering
    const visibleRows = useMemo(
        () =>
        [...tasks]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, tasks],
    );

    //If the user search, filter visibleRows by the search text
    const filteredTasks = searchText ? visibleRows.filter(
        (rows) => 
            rows.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
            rows.description.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
    ) : visibleRows

    return (
        <>
            <AddTaskModal
                openAddTaskModal={openAddTaskModal} 
                setOpenAddTaskModal={setOpenAddTaskModal}
                newTask={newTask} 
                setNewTask={setNewTask} 
                handleSubmit={handleSubmit}
            />
            <EditTaskModal
                openEditTaskModal={editingId !== null} 
                setOpenEditTaskModal={setEditingId}
                task={editingTask!}
                setTask={setEditingTask}
                handleSubmit={handleSaveEdit}
            />
            <DeleteTaskModal
                openDeleteTaskModal={openDeleteModal}
                setOpenDeleteTaskModal={setOpenDeleteModal}
                onYesButton={handleDelete}
                onNoButton={() => setOpenDeleteModal(!openDeleteModal)}
            />
            <Stack gap={3} direction={ windowWidth <= 800 ? 'column' : 'row'} sx={{justifyContent: 'space-between', display: windowWidth <= 375 ? "colomn" : 'flex'}}>
                <Stack gap={3} direction='row'>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setOpenAddTaskModal(!openAddTaskModal)}
                        sx={{
                            fontSize: "clamp(8px, 1.5vw, 15px)",
                            width: '110px'
                        }}
                    >
                        Add Task
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setOpenDeleteModal(!openDeleteModal)}
                        disabled={selected.length === 0}
                    >
                        <DeleteIcon sx={{width: 'clamp(15px, 1.5vw, 16px)'}}/>
                    </Button>
                    {selected.length > 0 && 
                        <Box>
                            <Select
                                labelId="status-label"
                                id="status"
                                value={newStatus}
                                label="Select Status"
                                onChange={(e) => handleEditStatus(e)}
                                sx={{
                                    color: 'white',
                                    border: '1px solid white',
                                    '& .MuiSvgIcon-root': { color: 'white' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    fontSize: "clamp(10px, 1.5vw, 16px)"
                                }}
                            >
                                <MenuItem value="todo" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>Todo</MenuItem>
                                <MenuItem value="in_progress" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>In-Progress</MenuItem>
                                <MenuItem value="done" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>Done</MenuItem>
                            </Select>
                        </Box>
                    }
                </Stack>
                <Stack sx={{width: 'calc(100vw - (20vw + 48px))'}}>
                    <Autocomplete
                        value={searchText}
                        onInputChange={handleAutocompleteInputChange}
                        disableClearable
                        options={searchTextArr}
                        sx={{ fontSize: "clamp(8px, 1.5vw, 16px)", }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search input"
                                slotProps={{
                                    input: {
                                    ...params.InputProps,
                                    type: 'search',
                                    },
                                }}
                                sx={{
                                    input: {
                                        color: 'white',
                                        '&::placeholder': {
                                            color: 'white',
                                            opacity: 0.8,
                                            fontSize: "clamp(8px, 1.5vw, 16px)"
                                        },
                                        },
                                        label: { color: 'white' },
                                        '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#90caf9',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#42a5f5',
                                        },
                                    },
                                }}
                            />
                        )}
                    />
                </Stack>
            </Stack>
            <Paper sx={{ marginTop: 2, padding: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'small'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={5}
                        />
                        <TableBody>
                            {filteredTasks.map((task, id) => {
                                const isItemSelected = selected.includes(task.id)
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, task.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                // inputProps={{
                                                // 'aria-labelledby': labelId,
                                                // }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={task.title}
                                            scope="row"
                                            padding="none"
                                            sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}
                                        >
                                            {task.title}
                                        </TableCell>
                                        <TableCell align="left" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>{task.description}</TableCell>
                                        <TableCell align="left" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>{task.status}</TableCell>
                                        <TableCell align="left" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>{task.priority}</TableCell>
                                        <TableCell align="left" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>{task.tags}</TableCell>
                                        <TableCell align="left" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>{formattedDate(task.dueDate)}</TableCell>
                                        <TableCell align="left" sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}>{formattedDate(task.createdAt)}</TableCell>
                                        <TableCell align="left">
                                            <Button
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleEdit(task.id)}
                                                sx={{fontSize: "clamp(10px, 1.5vw, 16px)"}}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tasks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    )
}