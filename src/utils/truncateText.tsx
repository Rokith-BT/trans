/**
 * Truncate text after a specified number of lines.
 *
 * @param text - The text to truncate.
 * @param lineLimit - The maximum number of lines allowed.
 * @param charPerLine - Estimated characters per line.
 * @returns The truncated text with ellipsis if needed.
 */
export const truncateTextByLines = (
  text: string,
  lineLimit: number,
  charPerLine: number,
): string => {
  const maxLength = lineLimit * charPerLine;
  return text?.length > maxLength
    ? text.slice(0, maxLength).trim() + "..."
    : text;
};
  