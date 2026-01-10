
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateRandomRoomName(): Promise<string> {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
