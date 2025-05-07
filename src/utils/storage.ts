import { Shift } from "../models/Shift";

const SHIFTS_KEY = "time-tracker-shifts";

export function saveShifts(shifts: Shift[]): void {
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
}

export function loadShifts(): Shift[] {
    const data = localStorage.getItem(SHIFTS_KEY);
    if (!data) return [];

    try {
        const parsed = JSON.parse(data);
        return parsed.map((shift: any) => ({
            ...shift,
            clockIn: new Date(shift.clockIn),
            clockOut: shift.clockOut ? new Date(shift.clockOut) : undefined,
        }));
    } catch {
        return [];
    }
}
