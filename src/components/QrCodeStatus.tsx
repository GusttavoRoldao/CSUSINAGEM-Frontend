// components/QrCodeStatus.tsx
import QRCode from 'react-qr-code';
import { useState } from 'react';

interface QrCodeStatusProps {
  itemId: string;
  onStatusChange: (status: 'PENDENTE' | 'CONCLUIDO') => void;
  currentStatus: 'PENDENTE' | 'CONCLUIDO';
  onPrintQrCode?: () => void;
}

const QrCodeStatus = ({ itemId, onStatusChange, currentStatus, onPrintQrCode }: QrCodeStatusProps) => {
  const toggleStatus = () => {
    const newStatus = currentStatus === 'PENDENTE' ? 'CONCLUIDO' : 'PENDENTE';
    onStatusChange(newStatus);
  };

  return (
    <div className="qr-code-container" data-qr-container-id={`qr-container-${itemId}`}>
      <div className="qr-code-section">
        <h4>Status: {currentStatus}</h4>
        <QRCode 
          value={`${window.location.origin}/confirm-status/${itemId}`}
          size={128}
          id={`qr-code-${itemId}`}
        />
        <button 
          onClick={toggleStatus}
          className={`status-btn ${currentStatus === 'PENDENTE' ? 'pending' : 'completed'}`}
        >
          {currentStatus === 'PENDENTE' ? 'Marcar como Concluído' : 'Marcar como Pendente'}
        </button>
        {onPrintQrCode && (
          <button 
            onClick={onPrintQrCode}
            className="print-btn"
            title="Imprimir QR Code"
          >
            🖨️ Imprimir QR Code
          </button>
        )}
      </div>
    </div>
  );
};

export default QrCodeStatus;