import React from 'react';

const NotificationPanel = ({ notifications = [], onMarkRead, onMarkAllRead, onClose, loading = false, error = '' }) => {
  const typeStyles = {
    INFO: 'bg-info-container text-info',
    ALERTA: 'bg-warning-container text-warning',
    URGENTE: 'bg-error-container text-error',
  };

  const typeIcons = {
    INFO: 'info',
    ALERTA: 'warning',
    URGENTE: 'priority_high',
  };

  return (
    <div className="fixed top-16 right-4 z-50 w-80 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Notificaciones</h3>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:bg-surface-container-low p-1 rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-outline-variant">
        {error && <p role="alert" className="p-4 text-red-700">{error}</p>}
        {loading ? <p className="p-4">Cargando notificaciones…</p> : notifications.length === 0 ? (
          <div className="px-md py-lg text-center text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-4xl block mb-2">notifications_off</span>
            Sin notificaciones nuevas
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-sm px-md py-sm transition-colors ${n.isRead ? 'opacity-60' : 'hover:bg-surface-container-low'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${typeStyles[n.type] || typeStyles.INFO}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {typeIcons[n.type] || 'info'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface truncate">{n.title}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">{n.message}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  {new Date(n.createdAt).toLocaleDateString('es-NI')}
                </p>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => onMarkRead && onMarkRead(n.id)}
                  className="text-primary hover:bg-primary-container p-1 rounded-full transition-colors cursor-pointer flex-shrink-0"
                  title="Marcar como leída"
                >
                  <span className="material-symbols-outlined text-sm">done</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-md py-sm border-t border-outline-variant">
          <button
            onClick={onMarkAllRead}
            className="text-primary font-label-md text-label-md hover:underline cursor-pointer w-full text-center"
          >
            Marcar todas como leídas
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
