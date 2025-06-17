// utils.ts (or any file you keep your utility functions)

export function formatDateToISO(dateString: string): string | null {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }

  const parts = dateString.split("-");
  if (parts.length !== 3) {
    return null;
  }

  const [day, month, year] = parts;

  if (isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
    return null;
  }

  const monthIndex = parseInt(month) - 1;

  if (
    monthIndex < 0 ||
    monthIndex > 11 ||
    parseInt(day) < 1 ||
    parseInt(day) > 31
  ) {
    return null;
  }

  try {
    const dateObject = new Date(parseInt(year), monthIndex, parseInt(day));

    if (
      dateObject.getFullYear() !== parseInt(year) ||
      dateObject.getMonth() !== monthIndex ||
      dateObject.getDate() !== parseInt(day)
    ) {
      return null;
    }

    const isoDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00`;
    return isoDateString;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}
export function formatTimestamp(timestamp: string | Date): string {
  // Get current date and input date in Indian timezone
  const now = new Date();
  const inputDate = new Date(timestamp);

  // Options for formatting
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    timeZone: "Asia/Kolkata",
  };

  // Check if it's today
  if (now.toDateString() === inputDate.toDateString()) {
    return inputDate.toLocaleTimeString("en-IN", timeOptions);
  }
  // Check if it's yesterday (you might want to add more conditions for "day before")
  else {
    const timeStr = inputDate.toLocaleTimeString("en-IN", timeOptions);
    const dateStr = inputDate.toLocaleDateString("en-IN", dateOptions);
    return `${dateStr} ${timeStr}`;
  }
}
