export interface Shift {
    id: string;
    clockIn: Date;
    clockOut?: Date;
    notes: string;
}

export function calculateDuration(shift: Shift): number {
    if (!shift.clockOut) return 0;
    return (shift.clockOut.getTime() - shift.clockIn.getTime()) / (1000 * 60 * 60);
}

export function calculateOvertime(shift: Shift, standardShiftHours: number = 8): number {
    const duration = calculateDuration(shift);
    return Math.max(0, duration - standardShiftHours);
}

export function isValidShiftTime(clockIn: Date, clockOut?: Date): boolean {
    if (!clockOut) return true;
    return clockOut.getTime() > clockIn.getTime();
}

export function validateShift(shift: Partial<Shift>): string | null {
    if (!shift.clockIn) return "Clock in time is required";
    if (!shift.clockOut) return "Clock out time is required";
    if (shift.clockOut <= shift.clockIn) return "Clock out must be after clock in";
    return null;
}
