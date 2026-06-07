import type { Guest } from '../types';
import { EVENT } from '../config/event';
import { handleImgError } from '../utils/imgFallback';
import Countdown from './Countdown';
import { ASSETS } from '../config/assets';

interface Props {
  guest: Guest;
  onContinue: () => void;
}

const GALLERY_PHOTOS = [ASSETS.foto1, ASSETS.foto2];

function PhotoOverlaySection({ src, children }: { src: string; children: React.ReactNode }) {
  return (
    <div
      className="photo-overlay-section"
      style={{ backgroundImage: `url(${src})` }}
    >
      <div className="photo-overlay-dark" aria-hidden="true" />
      <div className="photo-overlay-content">
        {children}
      </div>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="photo-section-preload"
        onError={(e) => {
          handleImgError(e);
          const parent = e.currentTarget.closest('.photo-overlay-section') as HTMLElement | null;
          if (parent) parent.style.backgroundImage = `url(${e.currentTarget.src})`;
        }}
      />
    </div>
  );
}

export default function WelcomePage({ guest, onContinue }: Props) {
  return (
    <>
      {/* Sección 1 — Hero */}
      <section className="welcome-hero">
        <span className="hero-ornament">✦</span>
        <p className="hero-script">Con mucha alegría te invitamos a celebrar nuestra boda.</p>
        <h1 className="hero-names">{EVENT.coupleNames}</h1>
        <span className="hero-ornament">✦</span>
        <p className="hero-date">{EVENT.date} · Santa Marta</p>
      </section>

      {/* Foto 1 — Cuenta regresiva */}
      <PhotoOverlaySection src={GALLERY_PHOTOS[0]}>
        <Countdown />
      </PhotoOverlaySection>

      {/* Sección 2 — Saludo */}
      <section className="greeting-hero">
        <p className="greeting-pretext">
          Tu presencia hará este día aún más especial. Con mucho amor, esperamos
          compartir contigo este momento tan significativo en nuestras vidas.
        </p>
        <span className="hero-ornament">✦</span>
        <p className="greeting-para-label">Para</p>
        <h2 className="hero-guest-name">{guest.name}</h2>
      </section>

      {/* Foto 2 — Hora de la boda */}
      <PhotoOverlaySection src={GALLERY_PHOTOS[1]}>
        <p className="time-label">La ceremonia comienza a las</p>
        <p className="time-display">4 <span className="time-pm">PM</span></p>
        <p className="time-sub">17 de Octubre · 2026 · Santa Marta</p>
      </PhotoOverlaySection>

      {/* Sección 3 — CTA */}
      <section className="cta-hero">
        <p className="hero-cta-text">¿Nos acompañarás en este día tan especial?</p>
        <button className="btn-hero" onClick={onContinue}>
          Confirmar asistencia
        </button>
      </section>
    </>
  );
}
