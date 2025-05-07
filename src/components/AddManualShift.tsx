import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Box,
    Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, subMonths, addMonths } from "date-fns";

interface AddManualShiftProps {
    open: boolean;
    onClose: () => void;
    onSave: (shift: { clockIn: Date; clockOut: Date; notes: string }) => void;
}

const AddManualShift: React.FC<AddManualShiftProps> = ({ open, onClose, onSave }) => {
    const [clockIn, setClockIn] = useState<Date>(new Date());
    const [clockOut, setClockOut] = useState<Date>(addMonths(new Date(), 1));
    const [notes, setNotes] = useState("");
    const [monthOffset, setMonthOffset] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        // Adjust dates based on month offset
        const adjustedClockIn = subMonths(clockIn, monthOffset);
        const adjustedClockOut = subMonths(clockOut, monthOffset);

        // Validate
        if (adjustedClockOut <= adjustedClockIn) {
            setError("Clock out must be after clock in");
            return;
        }

        setError(null);
        onSave({
            clockIn: adjustedClockIn,
            clockOut: adjustedClockOut,
            notes,
        });
        onClose();
        // Reset form
        setClockIn(new Date());
        setClockOut(addMonths(new Date(), 1));
        setNotes("");
        setMonthOffset(0);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Manual Shift</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <FormControl fullWidth>
                            {/* <InputLabel>Month</InputLabel>
                            <Select value={monthOffset} onChange={(e) => setMonthOffset(Number(e.target.value))} label="Month">
                                <MenuItem value={0}>Current Month</MenuItem>
                                <MenuItem value={1}>Previous Month</MenuItem>
                                <MenuItem value={2}>2 Months Ago</MenuItem>
                                <MenuItem value={3}>3 Months Ago</MenuItem>
                                <MenuItem value={4}>4 Months Ago</MenuItem>
                                <MenuItem value={5}>5 Months Ago</MenuItem>
                                <MenuItem value={6}>6 Months Ago</MenuItem>
                            </Select> */}
                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <DateTimePicker
                            label="Clock In"
                            value={clockIn}
                            onChange={(newValue) => newValue && setClockIn(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <DateTimePicker
                            label="Clock Out"
                            value={clockOut}
                            onChange={(newValue) => newValue && setClockOut(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                            minDateTime={clockIn}
                        />
                    </Box>

                    <TextField label="Notes" multiline rows={4} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mb: 2 }} />

                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save Shift
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddManualShift;
