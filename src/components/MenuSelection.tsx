import { useState } from 'react';
import type { Guest, MenuOption } from '../types';
import { STARTERS, MAIN_COURSES } from '../config/menu';
import { saveConfirmation } from '../services/sheetsService';
import ConfirmDialog from './ConfirmDialog';
import { handleImgError } from '../utils/imgFallback';

interface Props {
  guest: Guest;
  onConfirmed: (updatedGuest: Guest) => void;
}

function MenuCard({
  option,
  selected,
  onSelect,
}: {
  option: MenuOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`menu-card${selected ? ' selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-pressed={selected}
    >
      <div className="menu-card-img-wrapper">
        <img
          src={option.image}
          alt={option.name}
          className="menu-card-img"
          onError={handleImgError}
        />
        <div className="menu-card-img-placeholder" style={{ display: 'none' }}>
          {option.name}
        </div>
      </div>
      <div className="menu-card-body">
        <h4 className="menu-card-name">{option.name}</h4>
        <p className="menu-card-desc">{option.description}</p>
      </div>
      {selected && (
        <div className="menu-card-check" aria-hidden="true">✓</div>
      )}
    </div>
  );
}

export default function MenuSelection({ guest, onConfirmed }: Props) {
  const [attendance, setAttendance] = useState<'1' | '0' | null>(null);
  const [starter, setStarter] = useState('');
  const [mainCourse, setMainCourse] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const canConfirm =
    attendance === '0' || (attendance === '1' && starter !== '' && mainCourse !== '');

  const handleDialogAccept = async () => {
    setShowDialog(false);
    setSaving(true);
    setSaveError(false);
    const selectedStarter = attendance === '1' ? starter : '';
    const selectedMain = attendance === '1' ? mainCourse : '';
    const success = await saveConfirmation(guest.name, attendance!, selectedStarter, selectedMain);
    setSaving(false);
    if (success) {
      onConfirmed({ ...guest, attendance: attendance!, starter: selectedStarter, mainCourse: selectedMain });
    } else {
      setSaveError(true);
    }
  };

  return (
    <div className="form-page">

      <div className="form-section form-section--transparent">
        <div className="form-inner form-inner--center">
          <span className="ornament">✦</span>
          <h2 className="form-title">Confirmación</h2>
          <p className="form-guest-name">{guest.name}</p>
        </div>
      </div>

      <div className="form-section form-section--transparent">
        <div className="form-inner form-inner--center">
          <h3 className="question-title">¿Podrás acompañarnos el 17 de octubre?</h3>
          <div className="attendance-buttons">
            <button
              className={`btn-attendance${attendance === '1' ? ' active' : ''}`}
              onClick={() => setAttendance('1')}
            >
              Sí, estaré ahí
            </button>
            <button
              className={`btn-attendance btn-attendance--no${attendance === '0' ? ' active' : ''}`}
              onClick={() => setAttendance('0')}
            >
              No podré asistir
            </button>
          </div>
        </div>
      </div>

      {attendance === '1' && (
        <>
          <div className="form-section">
            <div className="form-inner">
              <h3 className="question-title question-title--center">Elige tu entrada</h3>
              <div className="menu-grid">
                {STARTERS.map((option) => (
                  <MenuCard
                    key={option.id}
                    option={option}
                    selected={starter === option.id}
                    onSelect={() => setStarter(option.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-inner">
              <h3 className="question-title question-title--center">Elige tu plato fuerte</h3>
              <div className="menu-grid">
                {MAIN_COURSES.map((option) => (
                  <MenuCard
                    key={option.id}
                    option={option}
                    selected={mainCourse === option.id}
                    onSelect={() => setMainCourse(option.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {saveError && (
        <div className="error-message">
          Ocurrió un error al guardar. Por favor intenta de nuevo o contáctanos directamente.
        </div>
      )}

      <div className="form-section form-section--transparent form-section--center">
        <div className="form-inner form-inner--center">
          <button
            className="btn-primary"
            onClick={() => canConfirm && setShowDialog(true)}
            disabled={!canConfirm || saving}
          >
            {saving ? 'Guardando...' : 'Confirmar'}
          </button>
          {attendance === '1' && !canConfirm && (
            <p className="hint-text">Por favor selecciona una entrada y un plato fuerte</p>
          )}
        </div>
      </div>

      {showDialog && (
        <ConfirmDialog
          attendance={attendance!}
          onAccept={handleDialogAccept}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
