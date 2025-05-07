import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { Shift } from "../models/Shift";
import { format } from "date-fns";

interface ClockInOutProps {
    currentShift: Shift | null;
    onClockIn: () => void;
    onClockOut: () => void;
    currentDuration: string;
}

const ClockInOut: React.FC<ClockInOutProps> = ({ currentShift, onClockIn, onClockOut, currentDuration }) => {
    return (
        <Box
            sx={{
                mb: 4,
                p: 3,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: currentShift ? "#f5f5f5" : "inherit",
            }}
        >
            <Typography variant="h5" gutterBottom>
                Current Status
            </Typography>
            {currentShift ? (
                <>
                    <Typography>Clocked in at: {format(currentShift.clockIn, "PPpp")}</Typography>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                        Current duration: {currentDuration}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={onClockOut} sx={{ mt: 2 }} fullWidth>
                        Clock Out
                    </Button>
                </>
            ) : (
                <>
                    <Typography>Not currently clocked in</Typography>
                    <Button variant="contained" color="primary" onClick={onClockIn} sx={{ mt: 2 }} fullWidth size="large">
                        Clock In
                    </Button>
                </>
            )}
        </Box>
    );
};

export default ClockInOut;
