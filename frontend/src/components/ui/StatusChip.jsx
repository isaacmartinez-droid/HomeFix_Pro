import React from 'react';

const StatusChip = ({ status, className = '' }) => {
  const getStatusStyles = (status) => {
    switch(status?.toUpperCase()) {
      case 'SOLICITADO':
      case 'PENDIENTE':
        return 'bg-warning-container text-warning border-warning';
      case 'ASIGNADO':
      case 'EN_PROGRESO':
      case 'VERIFICADO':
        return 'bg-info-container text-info border-info';
      case 'FINALIZADO':
        return 'bg-success-container text-success border-success';
      case 'CANCELADO':
      case 'RECHAZADO':
      case 'ALTA':
        return 'bg-error-container text-error border-error';
      case 'MEDIA':
        return 'bg-warning-container text-warning border-warning';
      case 'BAJA':
        return 'bg-success-container text-success border-success';
      default:
        return 'bg-surface-variant text-on-surface-variant border-outline-variant';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full border text-xs font-bold ${getStatusStyles(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusChip;
