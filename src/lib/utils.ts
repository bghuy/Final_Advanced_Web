
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFirstDayOfMonth(date: Date | undefined) {
  const currentDate = date ?? new Date();
  const firstDayOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1, 0, 0, 1));
  return formatDateWithoutMilliseconds(firstDayOfMonth);
}



export function getLastDayOfMonth(date: Date | undefined) {
  const currentDate = date ?? new Date();
  const lastDayOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0, 23, 59, 59));
  return formatDateWithoutMilliseconds(lastDayOfMonth);
}



export function convertToISODateString(date: Date | undefined): string {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return formatDateWithoutMilliseconds(date);
  }
  return "";
}


export function formatDateWithoutMilliseconds(date: Date | undefined): string {
  const currentDate = date ?? new Date();
  const isoString = currentDate.toISOString();
  return isoString
}



