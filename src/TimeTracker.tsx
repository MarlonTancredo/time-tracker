import React, { useState, useEffect } from "react";
import { Container, CssBaseline, Typography, Button, Box } from "@mui/material";
import ClockInOut from "./components/ClockInOut";
import NoteInput from "./components/NoteInput";
import StatsDisplay from "./components/StatsDisplay";
import ShiftList from "./components/ShiftList";
import AddManualShift from "./components/AddManualShift";
import { Shift } from "./models/Shift";
import { loadShifts, saveShifts } from "./utils/storage";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./contexts/AuthContext";
import { format } from "date-fns";

const TimeTracker: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [currentDuration, setCurrentDuration] = useState("00:00:00");
    const [manualShiftOpen, setManualShiftOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
    const { logout } = useAuth();

    useEffect(() => {
        setShifts(loadShifts());
    }, []);

    // Timer effect
    useEffect(() => {
        const currentShift = shifts.find((shift) => !shift.clockOut);
        let intervalId: NodeJS.Timeout;

        if (currentShift) {
            const updateDuration = () => {
                const now = new Date();
                const diff = now.getTime() - currentShift.clockIn.getTime();
                setCurrentDuration(formatDuration(diff));
            };

            updateDuration();
            intervalId = setInterval(updateDuration, 1000);
        } else {
            setCurrentDuration("00:00:00");
        }

        return () => clearInterval(intervalId);
    }, [shifts]);

    const formatDuration = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours.toString().padStart(2, "0"), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
    };

    const currentShift = shifts.find((shift) => !shift.clockOut) || null;

    const handleClockIn = () => {
        const newShift: Shift = {
            id: uuidv4(),
            clockIn: new Date(),
            notes: "",
        };
        const updatedShifts = [...shifts, newShift];
        setShifts(updatedShifts);
        saveShifts(updatedShifts);
    };

    const handleClockOut = () => {
        if (!currentShift) return;
        const updatedShifts = shifts.map((shift) => (shift.id === currentShift.id ? { ...shift, clockOut: new Date() } : shift));
        setShifts(updatedShifts);
        saveShifts(updatedShifts);
    };

    const handleNoteSave = (note: string) => {
        if (!currentShift) return;
        const updatedShifts = shifts.map((shift) => (shift.id === currentShift.id ? { ...shift, notes: note } : shift));
        setShifts(updatedShifts);
        saveShifts(updatedShifts);
    };

    const handleUpdateShift = (id: string, updatedFields: Partial<Shift>) => {
        const updatedShifts = shifts.map((shift) => (shift.id === id ? { ...shift, ...updatedFields } : shift));
        setShifts(updatedShifts);
        saveShifts(updatedShifts);
    };

    const handleDeleteShift = (id: string) => {
        const updatedShifts = shifts.filter((shift) => shift.id !== id);
        setShifts(updatedShifts);
        saveShifts(updatedShifts);
    };

    const handleAddManualShift = ({ clockIn, clockOut, notes }: { clockIn: Date; clockOut: Date; notes: string }) => {
        const newShift: Shift = {
            id: uuidv4(),
            clockIn,
            clockOut,
            notes,
        };
        const updatedShifts = [...shifts, newShift];
        setShifts(updatedShifts);
        saveShifts(updatedShifts);
    };

    const handleMonthSelect = (month: Date) => {
        setSelectedMonth(month);
    };

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button variant="outlined" onClick={logout} sx={{ mb: 2 }}>
                    Logout
                </Button>
            </Box>

            <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 2, mb: 4 }}>
                Time Tracker
            </Typography>

            <StatsDisplay
                shifts={shifts}
                currentShift={currentShift}
                currentDuration={currentDuration}
                onAddManualShift={() => setManualShiftOpen(true)}
                onMonthSelect={handleMonthSelect}
            />

            <ClockInOut currentShift={currentShift} onClockIn={handleClockIn} onClockOut={handleClockOut} currentDuration={currentDuration} />

            <NoteInput currentShift={currentShift} onNoteSave={handleNoteSave} />

            <ShiftList
                shifts={
                    selectedMonth
                        ? shifts.filter(
                              (shift) => shift.clockIn.getMonth() === selectedMonth.getMonth() && shift.clockIn.getFullYear() === selectedMonth.getFullYear(),
                          )
                        : shifts
                }
                onUpdateShift={handleUpdateShift}
                onDeleteShift={handleDeleteShift}
                selectedMonth={selectedMonth}
                showAllShifts={!selectedMonth}
            />

            <AddManualShift open={manualShiftOpen} onClose={() => setManualShiftOpen(false)} onSave={handleAddManualShift} />
        </Container>
    );
};

export default TimeTracker;
