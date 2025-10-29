import { Props, Task } from "@/pages";
import { Box, Button, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import styles from "./styles";
import AddTaskModal from "./modal/addTaskModal";


export default function TodoAppMainPage({task: initialTasks}: Props) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        dueDate: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTaskName, setEditedTaskName] = useState('');
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);

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
                    status: newTask.status, 
                    priority: newTask.priority, 
                    dueDate: newTask.dueDate 
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
                });
            }
        } catch (err) {
            console.error(`Error in adding task: ${err}`)
        }
    }

    const handleDone = async(id: number) => {
        try {
            const res = await fetch('/api/removeTask', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ id })
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
            setEditedTaskName(taskToEdit.name)
        }
    }

    const handleSaveEdit = async (id: number) => {
        try {
            const res = await fetch('/api/editTask', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, name: editedTaskName })
            })

            if(res.ok) {
                const newTasks = await fetch('/api/task').then(r => r.json());
                setTasks(newTasks);
            }
        } catch (err) {
            console.error(`Error in updating task: ${err}`)
        }
        
        setEditingId(null);
        setEditedTaskName('');
    }

    return (
        <>
            <div>
                <Typography variant="h3"> Tasks: </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setOpenAddTaskModal(!openAddTaskModal)}
                >
                    Add Task
                </Button>
                <AddTaskModal
                    openAddTaskModal={openAddTaskModal} 
                    setOpenAddTaskModal={setOpenAddTaskModal}
                    newTask={newTask} 
                    setNewTask={setNewTask} 
                    handleSubmit={handleSubmit}
                />
            </div>
            <ul>
                {tasks.map((ta) => 
                    ta.id === editingId ? 
                    (
                        <li key={ta.id}>
                            <input
                                value={editedTaskName}
                                type="text"
                                onChange={(e) => setEditedTaskName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(ta.id)}>Save</button>
                            <button onClick={() =>  setEditingId(null)}>Cancel</button>
                        </li>
                    )
                    :
                    (
                        <li key={ta.id}>
                            {ta.title} 
                            {ta.description}
                            <button onClick={() => handleDone(ta.id)}>Done</button>
                            <button onClick={() => handleEdit(ta.id)}>Edit</button>
                        </li>
                    )
                )}
            </ul>
        </>
    )
}