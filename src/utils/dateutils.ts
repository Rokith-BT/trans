export const formatDateAndTime = (
  dateString: string|undefined,
): { formattedDate: string | null; formattedTime: string | null } => {
  // Handle null, undefined, or invalid default values
//   if (!dateString || dateString === "0001-01-01T00:00:00") {
//     return { formattedDate: null, formattedTime: null };
//   }
  //0001-01-01T00:00:00"
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return { formattedDate: null, formattedTime: null };
    }

    // Format date: DD.MM.YYYY
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}.${date.getFullYear()}`;

    // Format time: HH:mm:ss (24-hour format)
    const formattedTime = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);

    return { formattedDate, formattedTime };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { formattedDate: null, formattedTime: null };
  }
};
