# Invitación de Boda — SPA

Single Page Application para invitaciones de boda personalizadas con confirmación de asistencia y selección de menú, sincronizada en tiempo real con Google Sheets.

## Stack

- **React 18 + TypeScript** — interfaz
- **Vite** — bundler
- **Google Apps Script** — backend gratuito (sin servidor)
- **Google Sheets** — base de datos de invitados

---

## Estructura del proyecto

```
wedding-invitation/
├── public/
│   └── assets/
│       ├── fotos/          ← Fotos de boda y menú (reemplazables)
│       └── videos/         ← Video de bienvenida (reemplazable)
├── src/
│   ├── components/         ← Componentes React
│   ├── config/
│   │   ├── event.ts        ← Detalles del evento (fecha, lugar, etc.)
│   │   └── menu.ts         ← Opciones de menú con fotos
│   ├── services/
│   │   └── sheetsService.ts ← Integración con Google Sheets
│   ├── styles/main.css     ← Estilos globales (colores, tamaños)
│   └── types/index.ts      ← Tipos TypeScript
├── apps-script/
│   └── Code.gs             ← Backend en Google Apps Script
└── .env.example
```

---

## Configuración paso a paso

### 1. Estructura del Google Sheet

La primera fila debe contener encabezados. Las columnas deben ser:

| A — Nombre | B — Asistencia | C — Entrada | D — Plato fuerte | E — Teléfono | F — Comentarios |
|---|---|---|---|---|---|
| Juan Pérez | | | | 3001234567 | |
| María García | | | | | Solo vegetariano |

- **Nombre**: tal cual aparecerá en la invitación (la comparación es insensible a mayúsculas).
- **Asistencia**: vacío = sin respuesta · `1` = asiste · `0` = no asiste.
- **Entrada / Plato fuerte**: se llenan automáticamente con el ID de la opción elegida.
- **Teléfono y Comentarios**: gestionados por los organizadores, no los modifica la página.

### 2. Desplegar el Google Apps Script

1. Abre el [Google Sheet de invitados](https://docs.google.com/spreadsheets/d/1TzyKqI75na_Wij20V2YgDED6YTfr983VvylvkmrWjnI/edit).
2. Ve a **Extensiones → Apps Script**.
3. Borra el contenido inicial y pega el contenido de `apps-script/Code.gs`.
4. Haz clic en **Implementar → Nueva implementación**.
5. Configura:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo** (tu cuenta)
   - Quién tiene acceso: **Cualquier usuario**
6. Haz clic en **Implementar** y copia la **URL de implementación**.

> **Importante:** cada vez que modifiques el Apps Script, debes crear una **nueva implementación** (no editar la existente) para que los cambios surtan efecto.

### 3. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:

```
VITE_SCRIPT_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
```

### 4. Instalar y ejecutar

```bash
npm install
npm run dev
```

---

## Personalizar el contenido

### Nombres y detalles del evento

Edita `src/config/event.ts`:

```ts
export const EVENT = {
  coupleNames: 'Ana & Carlos',        // ← Cambiar aquí
  date: '17 de Octubre · 2026',
  venue: 'Hotel Santorini Casa Blanca, Casa 3',
  // ...
};
```

### Opciones del menú

Edita `src/config/menu.ts` para cambiar nombres, descripciones e IDs de las opciones.

---

## Reemplazar fotos y videos

### Fotos de la galería (página de bienvenida)

Coloca las fotos en `public/assets/fotos/`:

| Archivo | Uso |
|---|---|
| `foto1.jpg` | Galería bienvenida — foto 1 |
| `foto2.jpg` | Galería bienvenida — foto 2 |
| `foto3.jpg` | Galería bienvenida — foto 3 |

Para agregar o quitar fotos, edita el array `GALLERY_PHOTOS` en `src/components/WelcomePage.tsx`.

### Fotos del menú

| Archivo | Uso |
|---|---|
| `entrada1.jpg` | Foto entrada opción 1 |
| `entrada2.jpg` | Foto entrada opción 2 |
| `plato1.jpg` | Foto plato fuerte opción 1 |
| `plato2.jpg` | Foto plato fuerte opción 2 |

### Video de bienvenida

Coloca el video en `public/assets/videos/video1.mp4`.

> Recomendación: menos de 30 segundos y menos de 30 MB para carga rápida en móvil.

### Controlar tamaño de fotos y video

Edita las clases en `src/styles/main.css`:

```css
.welcome-video     { max-height: 480px; }   /* Alto máximo del video */
.gallery-item      { aspect-ratio: 3 / 4; } /* Proporción fotos galería */
.menu-card-img-wrapper { aspect-ratio: 4 / 3; } /* Proporción fotos menú */
```

---

## Formato del link de invitación

```
https://tu-sitio.com/?invitado=Nombre+Apellido
```

El nombre debe coincidir con la columna A del Sheet (la comparación ignora mayúsculas y espacios al inicio/fin).

**Ejemplos:**
```
https://tu-sitio.com/?invitado=Juan%20P%C3%A9rez
https://tu-sitio.com/?invitado=Mar%C3%ADa+Garc%C3%ADa
```

---

## Despliegue en GitHub Pages

### Build manual

```bash
npm run build
# La carpeta dist/ contiene el sitio estático listo para publicar
```

### Con GitHub Actions (recomendado)

1. Crea el repositorio en GitHub.
2. Ve a **Settings → Secrets and variables → Actions** y agrega:
   - `VITE_SCRIPT_URL` = URL del Apps Script
3. Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          VITE_SCRIPT_URL: ${{ secrets.VITE_SCRIPT_URL }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. En **Settings → Pages**, selecciona la rama `gh-pages` como fuente.

---

## Flujo del invitado

```
Link personalizado (?invitado=Nombre)
        ↓
Página de bienvenida
(nombre, video, fotos)
        ↓
Selección de asistencia
        ↓
  [Sí]         [No]
   ↓              ↓
Elige menú    Confirma
(entrada +    inasistencia
 plato fuerte)
        ↓
  Aviso de no modificación
        ↓
  Guardar en Google Sheets
        ↓
  Página de agradecimiento
  (resumen + detalles del evento)
```

---

## Colores y fuentes

Personaliza en `src/styles/main.css` mediante variables CSS:

```css
:root {
  --gold:       #9a7b4f;   /* Dorado principal */
  --gold-light: #c4a472;   /* Dorado claro */
  --gold-dark:  #7a5e35;   /* Dorado oscuro (hover) */
  --text-dark:  #2c2c2c;   /* Texto principal */
  --off-white:  #faf8f5;   /* Fondo de tarjetas */
}
```

Fuentes cargadas desde Google Fonts:
- **Cormorant Garamond** — textos y títulos
- **Great Vibes** — nombres en script cursivo
- **Lato** — botones y etiquetas
