import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const visibleClass = (base: string, visible: boolean = false) =>
        `${styles[base]} ${visible ? styles.visible : ""}`;