import { a11yProps, CustomTabPanel } from "@/components/Dashboard";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import PieChartPanel from "./PieChart";
import BarChartPanel from "./BarChart";
import { useSelector } from "react-redux";
import { RootState } from "@/pages/store";
import TaskCalendar from "./Calendar";

export default function GraphPanel() {
    const { task: taskFromStore} = useSelector((state: RootState) => state.task)
    const [value, setValue] = useState(0);
    const [windowWidth, setWindowWidth] = useState<number>(0);
 
    useEffect(() => {
        if(typeof window !== 'undefined') {
            const viewportWidth = window.innerWidth;
            setWindowWidth(viewportWidth)
        }
    },[])
    
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ justifyContent: 'center', display: 'flex'}}>
            <Box sx={{width: windowWidth <= 375 ? '100%' : '80%', backgroundColor: '#0d1117'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', justifyContent: 'center', display: 'flex' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="tabs">
                        <Tab label="Pie Chart" {...a11yProps(0)} sx={{color: 'white', fontSize: "clamp(10px, 1.5vw, 16px)"}}/>
                        <Tab label="Bar Chart" {...a11yProps(1)} sx={{color: 'white', fontSize: "clamp(10px, 1.5vw, 16px)"}} />
                        <Tab label="Calendar" {...a11yProps(2)} sx={{color: 'white', fontSize: "clamp(10px, 1.5vw, 16px)"}} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <PieChartPanel task={taskFromStore}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <BarChartPanel task={taskFromStore} windowWidth={windowWidth}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <TaskCalendar task={taskFromStore} windowWidth={windowWidth}/>
                </CustomTabPanel>
            </Box>
        </Box>
    );
}
