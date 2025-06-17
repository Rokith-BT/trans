export function getImageFromBase64(
  photo: string | { mime: string; data: string },
  defaultMime = "image/jpeg",
): string {
  if (typeof photo === "string") {
    return `data:${defaultMime};base64,${photo}`;
  }

  if (typeof photo === "object" && photo.data && photo.mime) {
    return `data:${photo.mime};base64,${photo.data}`;
  }

  return "";
}
