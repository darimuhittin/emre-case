import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(url: string) {
  if (url.startsWith("real:")) {
    return "http://localhost:8000/uploads/" + url.split("real:")[1];
  }
  return url;
}

export function getImageIdFromUrl(url: string) {
  if (url.startsWith("real:")) {
    return url.split("real:")[1];
  }
  return url;
}
