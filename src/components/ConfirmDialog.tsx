interface Props {
  attendance: '0' | '1';
  onAccept: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ attendance, onAccept, onCancel }: Props) {
  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true">
      <div className="dialog">
        <span className="ornament">✦</span>
        <h3 className="dialog-title">Confirmar selección</h3>
        <p className="dialog-message">
          Una vez confirmes tu{' '}
          {attendance === '1'
            ? 'asistencia y tu selección de menú'
            : 'inasistencia'}
          , no podrás modificar tu elección. ¿Deseas continuar?
        </p>
        <div className="dialog-buttons">
          <button className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onAccept}>
            Sí, confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
