import React, { useState } from 'react';
import { Item } from '../pages/CategoryPage';
import  './EditItemModal.css'

interface EditItemModalProps {
  item: Item;
  onClose: () => void;
  onSave: (updatedItem: Item) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.name);
  const [subname, setSubname] = useState(item.subname);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('subname', subname);
    if (imageFile) formData.append('image', imageFile);
    if (pdfFile) formData.append('file', pdfFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/items/${item.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar item');
      }

      const updatedItem = await response.json();
      onSave(updatedItem);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Editar Item</h2>
        
        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Código CS</label>
            <input
              type="text"
              value={subname}
              onChange={(e) => setSubname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Arquivo DWG/PNG (opcional)</label>
            <input
              type="file"
              accept=".dwg,.png,.jpg,.jpeg"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="form-group">
            <label>Arquivo PDF (opcional)</label>
            <input
              type="file"
              accept=".pdf,.PDF"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn cancel">
              Cancelar
            </button>
            <button type="submit" className="btn save" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;