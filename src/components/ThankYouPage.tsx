import type { Guest } from '../types';
import { STARTERS, MAIN_COURSES } from '../config/menu';
import { EVENT, DRESS_CODE } from '../config/event';
import { handleImgError } from '../utils/imgFallback';
import { ASSETS } from '../config/assets';

interface Props { guest: Guest; }

const FOTO3 = ASSETS.foto3;

export default function ThankYouPage({ guest }: Props) {
  const attended = guest.attendance === '1';
  const starterName = STARTERS.find((s) => s.id === guest.starter)?.name ?? guest.starter;
  const mainName   = MAIN_COURSES.find((m) => m.id === guest.mainCourse)?.name ?? guest.mainCourse;

  return (
    <div className="thankyou-page" style={{ backgroundImage: `url(${FOTO3})` }}>
      {/* Dark overlay */}
      <div className="thankyou-overlay" aria-hidden="true" />

      {/* Hidden img for extension fallback */}
      <img
        src={FOTO3}
        alt=""
        aria-hidden="true"
        className="photo-section-preload"
        onError={(e) => {
          handleImgError(e);
          const parent = e.currentTarget.closest('.thankyou-page') as HTMLElement | null;
          if (parent) parent.style.backgroundImage = `url(${e.currentTarget.src})`;
        }}
      />

      <div className="thankyou-content">

        {/* Header */}
        <section className="ty-section ty-section--header">
          <span className="ty-ornament">✦</span>
          {attended ? (
            <>
              <h2 className="ty-title">¡Gracias, {guest.name}!</h2>
              <p className="ty-script">Tu confirmación ha sido registrada con alegría</p>
            </>
          ) : (
            <>
              <h2 className="ty-title">Gracias, {guest.name}</h2>
              <p className="ty-script">Lamentamos no poder tenerte con nosotros</p>
            </>
          )}
          <span className="ty-ornament">✦</span>
        </section>

        {attended && (
          <>
            {/* Resumen de menú */}
            <section className="ty-section">
              <h3 className="ty-section-title">Tu selección de menú</h3>
              <div className="ty-card">
                <div className="ty-row">
                  <span className="ty-row-label">Entrada</span>
                  <span className="ty-row-value">{starterName}</span>
                </div>
                <div className="ty-row">
                  <span className="ty-row-label">Plato fuerte</span>
                  <span className="ty-row-value">{mainName}</span>
                </div>
              </div>
            </section>

            {/* Detalles del evento */}
            <section className="ty-section">
              <h3 className="ty-section-title">Detalles del evento</h3>
              <div className="ty-card">
                <div className="ty-detail">
                  <span className="ty-detail-icon" aria-hidden="true">📅</span>
                  <div>
                    <p className="ty-detail-label">Fecha</p>
                    <p className="ty-detail-value">{EVENT.longDate} · 4:00 PM</p>
                  </div>
                </div>
                <div className="ty-detail">
                  <span className="ty-detail-icon" aria-hidden="true">📍</span>
                  <div>
                    <p className="ty-detail-label">Lugar</p>
                    <p className="ty-detail-value">{EVENT.venue}</p>
                    <p className="ty-detail-sub">{EVENT.city}</p>
                  </div>
                </div>
                <div className="ty-detail">
                  <span className="ty-detail-icon" aria-hidden="true">ℹ️</span>
                  <div>
                    <p className="ty-detail-label">Nota importante</p>
                    <p className="ty-detail-value">{EVENT.note}</p>
                  </div>
                </div>
              </div>
              <div className="ty-maps-wrap">
                <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" className="ty-maps-link">
                  Ver en Google Maps →
                </a>
              </div>
            </section>

            {/* Código de vestimenta */}
            <section className="ty-section">
              <h3 className="ty-section-title">Código de vestimenta</h3>
              <div className="ty-dress-grid">
                <div className="ty-dress-card">
                  <p className="ty-dress-category">Mujeres</p>
                  <p className="ty-dress-style">{DRESS_CODE.women.style}</p>
                  <p className="ty-dress-note" style={{ whiteSpace: 'pre-line' }}>{DRESS_CODE.women.note}</p>
                </div>
                <div className="ty-dress-card">
                  <p className="ty-dress-category">Hombres</p>
                  <p className="ty-dress-style">{DRESS_CODE.men.style}</p>
                  <p className="ty-dress-note">{DRESS_CODE.men.note}</p>
                </div>
              </div>
            </section>

            {/* Información adicional */}
            <section className="ty-section">
              <h3 className="ty-section-title">Información adicional</h3>
              <div className="ty-info-box">
                <p style={{ whiteSpace: 'pre-line' }}>{DRESS_CODE.additional}</p>
              </div>
            </section>
          </>
        )}

        {!attended && (
          <section className="ty-section ty-section--center">
            <p className="ty-message">
              Aunque no puedas estar presente, te llevaremos en nuestros corazones en
              este día tan especial. Con todo nuestro cariño.
            </p>
            <span className="ty-ornament large">✦</span>
          </section>
        )}

        {/* Footer */}
        <section className="ty-section ty-section--footer">
          <p className="ty-footer-label">Con amor</p>
          <p className="ty-footer-script">{EVENT.coupleNames}</p>
          <p className="ty-footer-date">17 · 10 · 2026</p>
        </section>

      </div>
    </div>
  );
}
