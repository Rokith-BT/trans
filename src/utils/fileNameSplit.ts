// export const fileNameSplit = (fileName: string) => {
//   if (fileName) {
//     const parts = fileName?.split("/");
//     const filename = parts[parts.length - 1];
//     return filename;
//   }
// };
export const fileNameSplit = (fileData: unknown): string => {
  if (fileData instanceof File) return fileData.name; // Extract name from File object
  if (typeof fileData === "string" && fileData.trim() !== "") {
    const parts = fileData.split("/");
    console.log(fileData, "fileDatafileDatafileData", parts);
    return parts[parts.length - 1]; // Return only the filename
  }
  return ""; // Return empty string if fileData is invalid
};
