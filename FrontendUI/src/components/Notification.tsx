import React, { useEffect } from 'react';

type Props = {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  durationMs?: number;
};

const colors: Record<Props['type'], string> = {
  success: '#28a745',
  error: '#dc3545',
  info: '#17a2b8'
};

const Notification: React.FC<Props> = ({ type, message, onClose, durationMs = 4000 }) => {
  useEffect(() => {
    const id = setTimeout(() => onClose?.(), durationMs);
    return () => clearTimeout(id);
  }, [onClose, durationMs]);

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      background: colors[type],
      color: '#fff',
      padding: '10px 14px',
      borderRadius: 8,
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      zIndex: 9999
    }}>
      <strong style={{ textTransform: 'capitalize' }}>{type}:</strong> {message}
    </div>
  );
};

export default Notification;
