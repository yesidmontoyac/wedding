import type { Guest } from '../types';

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL as string | undefined;

export async function fetchGuest(name: string): Promise<Guest | null> {
  // En desarrollo sin .env, devuelve un invitado ficticio para poder probar la UI
  if (!SCRIPT_URL) {
    if (import.meta.env.DEV) {
      console.warn('VITE_SCRIPT_URL no configurado — usando modo demo local');
      return { name, attendance: '', starter: '', mainCourse: '', phone: '', comments: '' };
    }
    console.error('VITE_SCRIPT_URL no está configurado en el archivo .env');
    return null;
  }
  try {
    const url = `${SCRIPT_URL}?action=get&name=${encodeURIComponent(name)}`;
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || 'error' in data) return null;
    return data as Guest;
  } catch {
    return null;
  }
}

export async function saveConfirmation(
  name: string,
  attendance: '0' | '1',
  starter: string,
  mainCourse: string,
): Promise<boolean> {
  // En modo demo local simula guardado exitoso
  if (!SCRIPT_URL) {
    if (import.meta.env.DEV) {
      console.warn('Modo demo — guardado simulado para:', { name, attendance, starter, mainCourse });
      return true;
    }
    console.error('VITE_SCRIPT_URL no está configurado en el archivo .env');
    return false;
  }
  try {
    const params = new URLSearchParams({ action: 'save', name, attendance, starter, mainCourse });
    const url = `${SCRIPT_URL}?${params.toString()}`;
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) return false;
    const data: unknown = await response.json();
    return typeof data === 'object' && data !== null && 'success' in data && (data as { success: boolean }).success === true;
  } catch {
    return false;
  }
}
