import { Props } from "@/pages";
import { BarChart } from "@mui/x-charts/BarChart";

export default function BarChartPanel({ task: data }: Props) {
    if(data.length <= 0) {
        return
    }
    // Count priorities
    const priorityCounts: Record<string, number> = data.reduce((acc, task) => {
        const key = task.priority.toUpperCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Prepare data in the same order as the xAxis labels
    const low = priorityCounts["LOW"] || 0;
    const medium = priorityCounts["MEDIUM"] || 0;
    const high = priorityCounts["HIGH"] || 0;

    return (
        <BarChart
            series={[
                { data: [low, 0, 0], label: "Low", color: "#3b82f6" },
                { data: [0, medium, 0], label: "Medium", color: "#fbbf24" },
                { data: [0, 0, high], label: "High", color: "#ef4444" }
            ]}
            xAxis={[{ data: ["Low", "Medium", "High"], scaleType: "band" }]}
            yAxis={[{ width: 50 }]}
            height={300}
            width={500}
        />
    );
}
