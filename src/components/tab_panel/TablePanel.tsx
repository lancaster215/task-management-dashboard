import { Props, Task } from "@/pages";
import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AddTaskModal from "../modal/addTaskModal";
import EnhancedTableHead from "../custom_components/EnhancedTableHead";
import { Data, Order } from "@/types/tableTypes";
import { getComparator } from "../helpers/getComparator";
import EditTaskModal from "../modal/editTaskModal";

export default function TablePanel({task: initialTasks}: Props) {
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
    // const [editedTaskName, setEditedTaskName] = useState('');
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data | 'action'>('status');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await fetch('/api/task');
            const latestTasks = await res.json();
            setTasks(latestTasks);
        };

        fetchTasks();
    }, []);

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
                setTasks(newTasks);
            }
        } catch (err) {
            console.error(`Error in removing task: ${err}`)
        }
    }
    
    const handleEdit = (id: number) => {
        const taskToEdit = tasks.find((task) => task.id === id);
        if(taskToEdit) {
            setEditingId(id);
            // setEditedTaskName(taskToEdit.name)
        }
    }

    const handleSaveEdit = async () => {
        try {
            const res = await fetch('/api/editTask', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    id: editingId, 
                    title: newTask.title, 
                    description: newTask.description, 
                    dueDate: newTask.dueDate,
                    status: newTask.status,
                    priority: newTask.priority,
                    tags: newTask.tags,
                })
            })

            if(res.ok) {
                const newTasks = await fetch('/api/task').then(r => r.json());
                setTasks(newTasks);
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

    const visibleRows = useMemo(
        () =>
        [...tasks]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, tasks],
    );

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
                task={tasks.find((task) => task.id === editingId) || {
                    title: '',
                    description: '',
                    status: '',
                    priority: '',
                    dueDate: '',
                    tags: ''
                }} 
                setTask={setNewTask} 
                handleSubmit={handleSaveEdit}
            />
            <Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setOpenAddTaskModal(!openAddTaskModal)}
                >
                    Add Task
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDelete}
                    disabled={selected.length === 0}
                >
                    Delete
                </Button>
            </Box>
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
                            {visibleRows.map((task, id) => {
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
                                        >
                                            {task.title}
                                        </TableCell>
                                        <TableCell align="left">{task.description}</TableCell>
                                        <TableCell align="left">{task.status}</TableCell>
                                        <TableCell align="left">{task.priority}</TableCell>
                                        <TableCell align="left">{task.tags}</TableCell>
                                        <TableCell align="left">{task.dueDate}</TableCell>
                                        <TableCell align="left">{task.createdAt}</TableCell>
                                        <TableCell align="left">
                                            <Button
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleEdit(task.id)}
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