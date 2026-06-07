import { useEffect, useState } from 'react';
import type { AppStep, Guest } from './types';
import { fetchGuest } from './services/sheetsService';
import WelcomePage from './components/WelcomePage';
import MenuSelection from './components/MenuSelection';
import ThankYouPage from './components/ThankYouPage';
import LoadingSpinner from './components/LoadingSpinner';
import { ASSETS } from './config/assets';

function RotateHint() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => {
      const isMobile = navigator.maxTouchPoints > 0 || window.innerWidth <= 900;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsLandscape(isMobile && isPortrait);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="rotate-hint" aria-hidden="true">
      <div className="rotate-hint-icon">
        <svg viewBox="0 0 130 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 22 22 A 48 48 0 0 1 65 10" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <polygon points="65,5 72,14 58,14" fill="white"/>
          <path d="M 108 68 A 48 48 0 0 1 65 80" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <polygon points="65,85 58,76 72,76" fill="white"/>
          <rect x="28" y="28" width="74" height="34" rx="5" stroke="white" strokeWidth="2.5"/>
          <rect x="99" y="38" width="4" height="14" rx="2" fill="white"/>
          <circle cx="32" cy="45" r="2" fill="white"/>
        </svg>
      </div>
      <span className="rotate-hint-text">Gira tu teléfono</span>
    </div>
  );
}

function BackgroundVideo() {
  return (
    <div className="bg-video-wrapper" aria-hidden="true">
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      >
        {ASSETS.videoDrive && <source src={ASSETS.videoDrive} type="video/mp4" />}
        <source src="./assets/videos/video1.mov" type="video/quicktime" />
        <source src="./assets/videos/video1.mp4" type="video/mp4" />
      </video>
      <div className="bg-overlay" />
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState<AppStep>('loading');
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('invitado');

    if (!name || name.trim() === '') {
      setStep('not_found');
      return;
    }

    fetchGuest(name.trim()).then((data) => {
      if (!data) {
        setStep('not_found');
        return;
      }
      setGuest(data);
      setStep(data.attendance !== '' ? 'confirmed' : 'welcome');
    });
  }, []);

  const handleProceedToMenu = () => setStep('menu');

  const handleConfirmed = (updatedGuest: Guest) => {
    setGuest(updatedGuest);
    setStep('confirmed');
  };

  if (step === 'loading') {
    return (
      <>
        <BackgroundVideo />
        <RotateHint />
        <div className="page-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (step === 'not_found' || step === 'error') {
    return (
      <>
        <BackgroundVideo />
        <RotateHint />
        <div className="page-center">
          <div className="message-card">
            <h2>{step === 'not_found' ? 'Invitación no encontrada' : 'Ocurrió un error'}</h2>
            <p>
              {step === 'not_found'
                ? 'Por favor verifica el link recibido o comunícate con los novios.'
                : 'No pudimos procesar tu solicitud. Intenta de nuevo más tarde.'}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (step === 'welcome' && guest) {
    return (
      <>
        <BackgroundVideo />
        <RotateHint />
        <WelcomePage guest={guest} onContinue={handleProceedToMenu} />
      </>
    );
  }

  if (step === 'menu' && guest) {
    return (
      <>
        <BackgroundVideo />
        <RotateHint />
        <MenuSelection guest={guest} onConfirmed={handleConfirmed} />
      </>
    );
  }

  if (step === 'confirmed' && guest) {
    return (
      <>
        <BackgroundVideo />
        <RotateHint />
        <ThankYouPage guest={guest} />
      </>
    );
  }

  return null;
}
