import type { MenuOption } from '../types';
import { ASSETS } from './assets';

export const STARTERS: MenuOption[] = [
  {
    id: 'burrata',
    name: 'Burrata',
    description: 'Cremosa y delicada, con tomates cherry y aceite de oliva',
    image: ASSETS.entrada1,
  },
  {
    id: 'ceviche',
    name: 'Ceviche Caribeño',
    description: 'Fresco y vibrante, con limón y cilantro',
    image: ASSETS.entrada2,
  },
];

export const MAIN_COURSES: MenuOption[] = [
  {
    id: 'robalo',
    name: 'Robalo Apanado',
    description: 'Filete crujiente con guarnición de la casa',
    image: ASSETS.plato1,
  },
  {
    id: 'posta',
    name: 'Posta Cartagenera',
    description: 'Receta tradicional costeña, lenta cocción en especias',
    image: ASSETS.plato2,
  },
];
