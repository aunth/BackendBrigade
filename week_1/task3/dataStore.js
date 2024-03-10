export const employees = [];
export const holidayRequests = [];
export const holidayRules = {
    maxConsecutiveDays: 10,
    blackoutPeriods: [
        { start: new Date(2024, 11, 24), end: new Date(2024, 11, 26) }, // Example blackout period for Christmas
    ],
};
