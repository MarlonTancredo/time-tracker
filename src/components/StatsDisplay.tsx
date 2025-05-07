import React from "react";
import { Box, Typography, Paper, Tabs, Tab, Button } from "@mui/material";
import { Shift, calculateDuration } from "../models/Shift";
import { format, parseISO, subMonths } from "date-fns";

interface StatsDisplayProps {
    shifts: Shift[];
    currentShift: Shift | null;
    currentDuration: string;
    onAddManualShift: () => void;
    onMonthSelect: (month: Date) => void;
}

interface DailySummary {
    date: string;
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
}

interface MonthlySummary {
    month: Date;
    totalShifts: number;
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    dailySummaries: DailySummary[];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ shifts, currentShift, currentDuration, onAddManualShift, onMonthSelect }) => {
    const [currentTab, setCurrentTab] = React.useState(0);

    const currentDate = new Date();
    const monthsToShow = [
        currentDate,
        subMonths(currentDate, 1),
        subMonths(currentDate, 2),
        // subMonths(currentDate, 3),
        // subMonths(currentDate, 4),
        // subMonths(currentDate, 5),
    ];

    const monthlyData = monthsToShow.map((monthDate) => {
        const month = monthDate.getMonth();
        const year = monthDate.getFullYear();

        const monthShifts = shifts.filter((shift) => {
            return shift.clockOut && shift.clockIn.getMonth() === month && shift.clockIn.getFullYear() === year;
        });

        const dailySummaries = monthShifts.reduce(
            (acc, shift) => {
                const dateStr = format(shift.clockIn, "yyyy-MM-dd");
                const duration = calculateDuration(shift);

                if (!acc[dateStr]) {
                    acc[dateStr] = {
                        date: dateStr,
                        totalHours: 0,
                        regularHours: 0,
                        overtimeHours: 0,
                    };
                }

                acc[dateStr].totalHours += duration;

                const newTotal = acc[dateStr].totalHours;
                if (newTotal <= 8) {
                    acc[dateStr].regularHours = newTotal;
                    acc[dateStr].overtimeHours = 0;
                } else {
                    acc[dateStr].regularHours = 8;
                    acc[dateStr].overtimeHours = newTotal - 8;
                }

                return acc;
            },
            {} as Record<string, DailySummary>,
        );

        const dailySummariesArray = Object.values(dailySummaries);

        const totalShifts = monthShifts.length;
        const totalHours = dailySummariesArray.reduce((sum, day) => sum + day.totalHours, 0);
        const regularHours = dailySummariesArray.reduce((sum, day) => sum + day.regularHours, 0);
        const overtimeHours = dailySummariesArray.reduce((sum, day) => sum + day.overtimeHours, 0);

        return {
            month: monthDate,
            totalShifts,
            totalHours,
            regularHours,
            overtimeHours,
            dailySummaries: dailySummariesArray,
        };
    });

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        onMonthSelect(monthsToShow[newValue]);
    };

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Time Tracking Statistics
                </Typography>
                <Button variant="outlined" onClick={onAddManualShift} sx={{ mb: 1 }}>
                    Add Manual Shift
                </Button>
            </Box>

            {currentShift && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: "#e8f5e9", borderRadius: 1 }}>
                    <Typography variant="subtitle1">Current Shift</Typography>
                    <Typography>Started at: {format(currentShift.clockIn, "PPpp")}</Typography>
                    <Typography>Duration: {currentDuration}</Typography>
                </Box>
            )}

            <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
                {monthlyData.map((monthData, index) => (
                    <Tab key={index} label={format(monthData.month, "MMM yyyy")} disabled={monthData.totalShifts === 0} />
                ))}
            </Tabs>

            {monthlyData.map((monthData, index) => (
                <div key={index} role="tabpanel" hidden={currentTab !== index} id={`month-tabpanel-${index}`} aria-labelledby={`month-tab-${index}`}>
                    {currentTab === index && (
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                                <Box sx={{ mb: 2, minWidth: "200px" }}>
                                    <Typography variant="subtitle1">Total Shifts</Typography>
                                    <Typography variant="h4">{monthData.totalShifts}</Typography>
                                </Box>

                                <Box sx={{ mb: 2, minWidth: "200px" }}>
                                    <Typography variant="subtitle1">Total Hours</Typography>
                                    <Typography variant="h4">{monthData.totalHours.toFixed(2)}</Typography>
                                </Box>

                                <Box sx={{ mb: 2, minWidth: "200px" }}>
                                    <Typography variant="subtitle1">Regular Hours</Typography>
                                    <Typography variant="h4">{monthData.regularHours.toFixed(2)}</Typography>
                                </Box>

                                <Box sx={{ mb: 2, minWidth: "200px" }}>
                                    <Typography variant="subtitle1">Overtime Hours</Typography>
                                    <Typography variant="h4" color={monthData.overtimeHours > 0 ? "secondary" : "textPrimary"}>
                                        {monthData.overtimeHours.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Daily Breakdown
                                </Typography>
                                {monthData.dailySummaries.length > 0 ? (
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                                            gap: 2,
                                        }}
                                    >
                                        {monthData.dailySummaries.map((day) => (
                                            <Paper key={day.date} sx={{ p: 2 }}>
                                                <Typography variant="subtitle2">{format(parseISO(day.date), "PP")}</Typography>
                                                <Typography>Total: {day.totalHours.toFixed(2)}h</Typography>
                                                <Typography>Regular: {day.regularHours.toFixed(2)}h</Typography>
                                                <Typography color={day.overtimeHours > 0 ? "secondary" : "textPrimary"}>
                                                    Overtime: {day.overtimeHours.toFixed(2)}h
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography>No shifts recorded for {format(monthData.month, "MMMM yyyy")}</Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </div>
            ))}
        </Paper>
    );
};

export default StatsDisplay;
