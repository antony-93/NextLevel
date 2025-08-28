import { toast } from "sonner";

export function toastWarning(title: string, description: string) {
  toast.error(title, {
    duration: 6000,
    icon: null,
    descriptionClassName: "!text-yellow-800",
    description: description,
    className: "!border-yellow-200 !bg-yellow-50 !text-yellow-900 !font-semibold",
  })
}

export function toastError(title: string, description: string) {
  toast.error(title, {
    duration: 6000,
    icon: null,
    descriptionClassName: "!text-red-800",
    description: description,
    className: "!border-red-200 !bg-red-50 !text-red-900 !font-semibold",
  })
}

export function toastSuccess(title: string, description: string) {
  toast.success(title, {
    duration: 6000,
    icon: null,
    descriptionClassName: "!text-green-800",
    description: description,
    className: "!border-green-200 !bg-green-50 !text-green-900 !font-semibold",
  })
}