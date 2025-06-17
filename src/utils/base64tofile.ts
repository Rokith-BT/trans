// export function base64toFile(base64String: string, filename: string): File {
//   const arr = base64String.split(",");
//   const mimeMatch = arr[0].match(/:(.*?);/);
//   if (!mimeMatch || arr.length < 2) {
//     throw new Error("Invalid base64 string");
//   }
//   const mime = mimeMatch[1];
//   const bstr = atob(arr[1]); // decode base64
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);

//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }

//   return new File([u8arr], filename, { type: mime });
// }
export function base64toFile(base64String: string, filename: string): File {
  if (!base64String?.includes(",")) {
    throw new Error("Invalid base64 format");
  }

  const arr = base64String.split(",");
  const mimeMatch = arr[0]?.match(/:(.*?);/);

  if (!mimeMatch || arr.length < 2) {
    throw new Error("Invalid base64 string structure");
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]); // decode base64
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
}
