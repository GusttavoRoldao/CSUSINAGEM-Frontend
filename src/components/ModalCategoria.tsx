import React, { useState } from "react";
import './ModalCategoria.css';

interface ModalProps {
  onClose: () => void;
  onCategoryAdded: (category: any) => void;
}

const ModalCategoria: React.FC<ModalProps> = ({ onClose, onCategoryAdded }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    onCategoryAdded(data);
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-form">
        <h3>Nova Categoria</h3>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default ModalCategoria;
