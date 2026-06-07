import { useEffect, useState } from 'react';

const TARGET = new Date('2026-10-17T16:00:00-05:00').getTime();

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="countdown">
      <p className="countdown-title">Cuenta regresiva</p>
      <p className="countdown-sub">para nuestro gran día</p>
      <div className="countdown-grid">
        {[
          { val: String(time.days), label: 'días' },
          { val: pad(time.hours),   label: 'horas' },
          { val: pad(time.minutes), label: 'minutos' },
          { val: pad(time.seconds), label: 'segundos' },
        ].map((unit, i, arr) => (
          <>
            <div key={unit.label} className="countdown-unit">
              <span className="countdown-num">{unit.val}</span>
              <span className="countdown-label">{unit.label}</span>
            </div>
            {i < arr.length - 1 && <span key={`sep-${i}`} className="countdown-sep">:</span>}
          </>
        ))}
      </div>
    </div>
  );
}
