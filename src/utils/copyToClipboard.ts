export const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard
    .writeText(text)
    .catch((err) => console.error("Failed to copy", err));
};
