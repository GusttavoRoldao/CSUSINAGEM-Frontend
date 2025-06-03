import React, { useState } from 'react';
import { Category } from './MainContent';

interface EditCategoryModalProps {
  category: Category;
  onClose: () => void;
  onSave: (updatedCategory: Category) => void;
}
 const API_URL = import.meta.env.VITE_BACKEND_URL;
const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ 
  category, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState(category.name);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(`${API_URL}/uploads/${category.imagePath}`);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`${API_URL}/categories/${category.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar categoria');
      }

      const updatedCategory = await response.json();
      onSave(updatedCategory);
      onClose();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar categoria');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Editar Categoria</h2>
        
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label>Nome da Categoria</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Imagem da Categoria</label>
            <div className="image-upload-container">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="category-image-preview"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
              <button 
                type="button" 
                className="upload-button"
                onClick={() => document.querySelector('.image-upload-input')?.click()}
              >
                Alterar Imagem
              </button>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;