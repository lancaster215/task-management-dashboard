import { a11yProps, CustomTabPanel } from "@/components/Dashboard";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import PieChartPanel from "./PieChart";
import BarChartPanel from "./BarChart";
import { useSelector } from "react-redux";
import { RootState } from "@/pages/store";

export default function GraphPanel() {
    const { task: taskFromStore} = useSelector((state: RootState) => state.task)
    const [value, setValue] = useState(0);
    
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    };

    return (
        <Box sx={{ justifyContent: 'center', display: 'flex'}}>
            <Box sx={{width: '80%', backgroundColor: '#0d1117'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', justifyContent: 'center', display: 'flex' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="tabs">
                        <Tab label="Pie Chart" {...a11yProps(0)} sx={{color: 'white'}}/>
                        <Tab label="Bar Chart" {...a11yProps(1)} sx={{color: 'white'}} />
                        <Tab label="Calendar" {...a11yProps(2)} sx={{color: 'white'}} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <PieChartPanel task={taskFromStore}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <BarChartPanel task={taskFromStore}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Item Three
                </CustomTabPanel>
            </Box>
        </Box>
    );
}
