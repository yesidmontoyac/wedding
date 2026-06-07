// Edita este archivo para personalizar los detalles del evento
export const EVENT = {
  coupleNames: 'Yesid & Laura',          // Reemplazar con los nombres reales
  date: '17 de Octubre · 2026',
  longDate: '17 de octubre del 2026',
  venue: 'Hotel Santorini Casa Blanca, Casa 3',
  city: 'Santa Marta, Colombia',
  note: 'No hay parqueadero, prepárate para tomar Ron.',
  mapsUrl: 'https://maps.app.goo.gl/ywXRX7DSMDNgANmp8',
} as const;

export const DRESS_CODE = {
  women: { style: 'Formal', note: 'Evitar el color blanco.' },
  men:   { style: 'Formal', note: 'No es necesario corbata ni traje.' },
  additional: 'Recuerda que la celebración y la ceremonia serán en la playa, para nosotros lo más importante es tu comodidad.',
} as const;
