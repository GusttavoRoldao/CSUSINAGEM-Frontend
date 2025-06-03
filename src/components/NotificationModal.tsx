import React from "react";
import { Item } from "../pages/CategoryPage"; // Importe a interface Item do seu arquivo

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingItems: Item[];
  onDownloadPdf: (filePath: string) => void;
  onDownloadDwg: (filePath: string) => void;
  onStatusChange: (itemId: string, status: 'PENDENTE' | 'CONCLUIDO') => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  pendingItems = [], // Valor padrão
  onDownloadPdf,
  onDownloadDwg,
  onStatusChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="notification-modal">
        <div className="modal-header">
          <h2>Itens Pendentes Recentes</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {pendingItems.length === 0 ? (
            <p>Nenhum item pendente recente</p>
          ) : (
            <ul className="pending-items-list">
              {pendingItems.map(item => (
                <li key={item.id} className="pending-item">
                  <div className="item-info">
                    <h3>{item.name || 'Sem nome'}</h3>
                    <p>{item.subname || 'Sem descrição'}</p>
                    <span className={`status-badge ${item.status === 'PENDENTE' ? 'pending' : 'completed'}`}>
                      {item.status || 'PENDENTE'}
                    </span>
                  </div>
                  
                  <div className="item-actions">
                    {item.filePath && (
                      <button 
                        onClick={() => onDownloadPdf(item.filePath)} 
                        className="download-button"
                      >
                        Baixar PDF
                      </button>
                    )}
                    {item.dwgPath && (
                      <button 
                        onClick={() => onDownloadDwg(item.dwgPath)} 
                        className="download-button"
                      >
                        Baixar DWG
                      </button>
                    )}
                    <button
                      onClick={() => onStatusChange(item.id, item.status === 'PENDENTE' ? 'CONCLUIDO' : 'PENDENTE')}
                      className={`status-button ${item.status === 'PENDENTE' ? 'complete' : 'pending'}`}
                    >
                      {item.status === 'PENDENTE' ? 'Marcar Concluído' : 'Marcar Pendente'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;