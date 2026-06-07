export interface Guest {
  name: string;
  attendance: string; // '' = sin respuesta | '0' = no asiste | '1' = asiste
  starter: string;
  mainCourse: string;
  phone: string;
  comments: string;
}

export interface MenuOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

export type AppStep =
  | 'loading'
  | 'not_found'
  | 'error'
  | 'welcome'
  | 'menu'
  | 'confirmed';
