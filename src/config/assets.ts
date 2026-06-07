const e = import.meta.env;

const driveImg = (id: string | undefined, local: string): string =>
  id ? `https://lh3.googleusercontent.com/d/${id}` : local;

export const ASSETS = {
  foto1:    driveImg(e.VITE_DRIVE_FOTO1_ID,    './assets/fotos/foto1.jpg'),
  foto2:    driveImg(e.VITE_DRIVE_FOTO2_ID,    './assets/fotos/foto2.jpg'),
  foto3:    driveImg(e.VITE_DRIVE_FOTO3_ID,    './assets/fotos/foto3.jpg'),
  entrada1: driveImg(e.VITE_DRIVE_ENTRADA1_ID, './assets/fotos/entrada1.jpg'),
  entrada2: driveImg(e.VITE_DRIVE_ENTRADA2_ID, './assets/fotos/entrada2.jpg'),
  plato1:   driveImg(e.VITE_DRIVE_PLATO1_ID,   './assets/fotos/plato1.jpg'),
  plato2:   driveImg(e.VITE_DRIVE_PLATO2_ID,   './assets/fotos/plato2.jpg'),
} as const;
