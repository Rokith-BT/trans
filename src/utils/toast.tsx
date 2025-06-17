import { toast as toaster, TypeOptions } from "react-toastify";

export const toast = (message: string, type: TypeOptions, id?: string) => {
  toaster(message, {
    toastId: id,
    type,
    className: type === "success" ? "custom-toast-success" : "",
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const removeToast = (id: string) => {
  toaster.dismiss(id);
};
