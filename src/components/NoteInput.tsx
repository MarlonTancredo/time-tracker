import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { Shift } from "../models/Shift";

interface NoteInputProps {
    currentShift: Shift | null;
    onNoteSave: (note: string) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ currentShift, onNoteSave }) => {
    const [note, setNote] = useState(currentShift?.notes || "");

    const handleSave = () => {
        onNoteSave(note);
    };

    return (
        <Box sx={{ mb: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
            <TextField label="Shift Notes" multiline rows={4} fullWidth value={note} onChange={(e) => setNote(e.target.value)} disabled={!currentShift} />
            <Button variant="contained" onClick={handleSave} disabled={!currentShift} sx={{ mt: 2 }}>
                Save Note
            </Button>
        </Box>
    );
};

export default NoteInput;
