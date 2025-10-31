import { Props } from "@/pages";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { DefaultizedPieValueType } from "@mui/x-charts";

export default function PieChartPanel({ task: data }: Props) {
    if(data.length <= 0) {
        return
    }
    // Group tasks by status and count occurrences. example output { 'todo': 1, 'in_progress': 3, 'done': 4 }
    const statusCounts: Record<string, number> = data.reduce((acc, task) => {
        const key = task.status.toUpperCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Convert to PieChart format. output is an array of object [{'todo': 1}, {'in_progress': 2}, {'done': 3}]
    const pieData = Object.entries(statusCounts).map(([status, count]) => ({
        label: status,
        value: count,
    }));

    // Compute total count
    const TOTAL = pieData.reduce((sum, item) => sum + item.value, 0);

    // Function to display percentage labels
    const getArcLabel = (params: DefaultizedPieValueType) => {
        const percent = (params.value / TOTAL) * 100;
        return `${percent.toFixed(0)}%`;
    };

    const sizing = {
        margin: { right: 5 },
        width: 300,
        height: 300,
    };

    return (
        <PieChart
            series={[
                {
                outerRadius: 100,
                data: pieData,
                arcLabel: getArcLabel,
                },
            ]}
            sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: 14,
                },
            }}
            {...sizing}
        />
    );
}
