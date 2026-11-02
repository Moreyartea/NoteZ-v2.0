import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a raw numeric or formatted string with Indonesian dot thousand separators in real-time
 * e.g., "1500000" -> "1.500.000"
 */
export function formatCurrencyInput(value: string | number | undefined | null): string {
  const clean = String(value ?? '').replace(/\D/g, '');
  if (!clean) return '';
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parses a formatted currency string back into a clean number
 * e.g., "1.500.000" -> 1500000
 */
export function parseCurrencyInput(formatted: string | number | undefined | null): number {
  const clean = String(formatted ?? '').replace(/\D/g, '');
  return clean ? Number(clean) || 0 : 0;
}
