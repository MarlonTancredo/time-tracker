import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, TextField, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { Shift, calculateDuration, calculateOvertime, isValidShiftTime } from "../models/Shift";
import { format } from "date-fns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface ShiftListProps {
    shifts: Shift[];
    onUpdateShift: (id: string, updatedShift: Partial<Shift>) => void;
    onDeleteShift: (id: string) => void;
    selectedMonth?: Date | null;
    showAllShifts: boolean;
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts, onUpdateShift, onDeleteShift, selectedMonth, showAllShifts }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedShift, setEditedShift] = useState<Partial<Shift> | null>(null);
    const [timeError, setTimeError] = useState<string | null>(null);

    const handleEdit = (shift: Shift) => {
        setEditingId(shift.id);
        setEditedShift({
            clockIn: shift.clockIn,
            clockOut: shift.clockOut,
            notes: shift.notes,
        });
        setTimeError(null);
    };

    const handleTimeChange = (field: "clockIn" | "clockOut", value: Date | null) => {
        if (!value) return;

        const newShift = {
            ...editedShift,
            [field]: value,
        };

        setEditedShift(newShift);

        if (newShift.clockIn && newShift.clockOut) {
            if (!isValidShiftTime(newShift.clockIn, newShift.clockOut)) {
                setTimeError("Clock out must be after clock in");
            } else {
                setTimeError(null);
            }
        }
    };

    const handleSave = (id: string) => {
        if (timeError) return;
        if (!editedShift) return;

        onUpdateShift(id, editedShift);
        setEditingId(null);
        setEditedShift(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedShift(null);
        setTimeError(null);
    };

    // Calculate monthly totals
    const monthlyTotals = shifts.reduce(
        (acc, shift) => {
            const duration = calculateDuration(shift);
            const overtime = calculateOvertime(shift);
            return {
                totalHours: acc.totalHours + duration,
                totalOvertime: acc.totalOvertime + overtime,
                totalShifts: acc.totalShifts + 1,
            };
        },
        { totalHours: 0, totalOvertime: 0, totalShifts: 0 },
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Shift History {selectedMonth ? `- ${format(selectedMonth, "MMMM yyyy")}` : ""}
                </Typography>

                {!showAllShifts && (
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Typography>
                            Total Shifts: <strong>{monthlyTotals.totalShifts}</strong>
                        </Typography>
                        <Typography>
                            Total Hours: <strong>{monthlyTotals.totalHours.toFixed(2)}</strong>
                        </Typography>
                        <Typography>
                            Overtime: <strong>{monthlyTotals.totalOvertime.toFixed(2)}</strong>
                        </Typography>
                    </Box>
                )}

                {shifts.length === 0 ? (
                    <Typography>No shifts recorded {selectedMonth ? `for ${format(selectedMonth, "MMMM yyyy")}` : "yet"}</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Clock In</TableCell>
                                    <TableCell>Clock Out</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Overtime</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shifts
                                    .sort((a, b) => b.clockIn.getTime() - a.clockIn.getTime())
                                    .map((shift) => (
                                        <TableRow key={shift.id}>
                                            <TableCell>
                                                {editingId === shift.id ? format(editedShift?.clockIn || shift.clockIn, "PP") : format(shift.clockIn, "PP")}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === shift.id ? (
                                                    <DateTimePicker
                                                        value={editedShift?.clockIn || shift.clockIn}
                                                        onChange={(value) => handleTimeChange("clockIn", value)}
                                                        slotProps={{ textField: { size: "small" } }}
                                                    />
                                                ) : (
                                                    format(shift.clockIn, "pp")
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === shift.id ? (
                                                    <DateTimePicker
                                                        value={editedShift?.clockOut || shift.clockOut || null}
                                                        onChange={(value) => handleTimeChange("clockOut", value)}
                                                        slotProps={{ textField: { size: "small" } }}
                                                    />
                                                ) : shift.clockOut ? (
                                                    format(shift.clockOut, "pp")
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === shift.id
                                                    ? editedShift?.clockIn && editedShift?.clockOut
                                                        ? `${calculateDuration({
                                                              ...shift,
                                                              clockIn: editedShift.clockIn,
                                                              clockOut: editedShift.clockOut,
                                                          }).toFixed(2)} hours`
                                                        : "-"
                                                    : shift.clockOut
                                                    ? `${calculateDuration(shift).toFixed(2)} hours`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === shift.id
                                                    ? editedShift?.clockIn && editedShift?.clockOut
                                                        ? `${calculateOvertime({
                                                              ...shift,
                                                              clockIn: editedShift.clockIn,
                                                              clockOut: editedShift.clockOut,
                                                          }).toFixed(2)} hours`
                                                        : "-"
                                                    : shift.clockOut
                                                    ? `${calculateOvertime(shift).toFixed(2)} hours`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === shift.id ? (
                                                    <TextField
                                                        value={editedShift?.notes || shift.notes || ""}
                                                        onChange={(e) =>
                                                            setEditedShift({
                                                                ...editedShift,
                                                                notes: e.target.value,
                                                            })
                                                        }
                                                        fullWidth
                                                        size="small"
                                                    />
                                                ) : (
                                                    shift.notes || "-"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === shift.id ? (
                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleSave(shift.id)}
                                                            disabled={!!timeError}
                                                            color={timeError ? "error" : "primary"}
                                                        >
                                                            <SaveIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={handleCancel}>
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                        <IconButton size="small" onClick={() => handleEdit(shift)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => onDeleteShift(shift.id)} color="error">
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        {timeError && (
                            <Typography color="error" sx={{ p: 2 }}>
                                {timeError}
                            </Typography>
                        )}
                    </TableContainer>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default ShiftList;
