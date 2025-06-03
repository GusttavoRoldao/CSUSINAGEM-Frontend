// pages/ConfirmStatusPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ConfirmStatusPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`${API_URL}/items/${itemId}`);
      const data = await response.json();
      setItem(data);
    };
    fetchItem();
  }, [itemId]);

  const confirmStatus = async () => {
    await fetch(`${API_URL}/items/${itemId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'CONCLUIDO' }),
    });
    navigate('/');
  };

  return (
    <div className="confirm-status-page">
      <h2>Confirmar Status do Item</h2>
      {item && (
        <>
          <h3>{item.name}</h3>
          <p>Código: {item.subname}</p>
          <p>Status atual: {item.status}</p>
          
          <button 
            onClick={confirmStatus}
            disabled={item.status === 'CONCLUIDO'}
            className="confirm-btn"
          >
            {item.status === 'CONCLUIDO' 
              ? 'Item já concluído' 
              : 'Confirmar como Concluído'}
          </button>
        </>
      )}
    </div>
  );
};

export default ConfirmStatusPage;