import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import './CategoryPage.css';

interface Item {
  id: string;
  name: string;
  subname: string;
  imagePath: string;
  filePath: string;
  createdAt: string;
}

interface CategoryPageProps { }

const Modal: React.FC<{ onClose: () => void }> = ({ children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
        &times;
      </button>
      {children}
    </div>
  </div>
);

const CategoryPage: React.FC<CategoryPageProps> = () => {
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const [categoryName, setCategoryName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subname, setSubname] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCategory = await fetch(`${API_URL}/categories/${id}`);
        if (!resCategory.ok) throw new Error("Categoria não encontrada");
        const category = await resCategory.json();
        setCategoryName(category.name);

        const resItems = await fetch(`${API_URL}/categories/${id}/items`);
        const dataItems = await resItems.json();
        setItems(Array.isArray(dataItems) ? dataItems : []);
      } catch (err) {
        setItems([]);
      }
    };
    fetchData();
  }, [id, API_URL]);

  // Filtrar itens baseados no termo de busca
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !subname || !imageFile || !attachedFile) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subname", subname);
      formData.append("categoryId", id!);
      formData.append("image", imageFile);
      formData.append("file", attachedFile);

      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao criar o item.");
      }

      const newItem = await response.json();
      setItems(prev => [newItem, ...prev]);

      setName("");
      setSubname("");
      setImageFile(null);
      setAttachedFile(null);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setShowForm(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div className="header-section">
          <h1>Categoria: {categoryName}</h1>

          {/* Campo de busca */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <button className="btn-novo-item" onClick={handleAddItem}>
          +
        </button>

        {showForm && (
          <Modal onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit} className="item-form">
              <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
              <input type="text" placeholder="Subnome" value={subname} onChange={e => setSubname(e.target.value)} />

              {/* Campo para imagem com label */}
              <label>
                Insira imagem:
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                />
              </label>

              {/* Campo para arquivo CNC com label */}
              <label>
                Programa CNC:
                <input
                  type="file"
                  accept=".cnc,.txt,.gcode,.dwg,.dwf,xlsx"
                  onChange={e => setAttachedFile(e.target.files?.[0] || null)}
                />
              </label>

              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Enviando..." : "Salvar"}
              </button>
            </form>
          </Modal>
        )}

        {/* Modal para imagem expandida */}
        {showImageModal && (
          <Modal onClose={() => setShowImageModal(null)}>
            <img
              src={`${API_URL}/uploads/${showImageModal}`}
              alt="Imagem expandida"
              className="expanded-image"
            />
          </Modal>
        )}

        <ul className="items-list">
          {filteredItems.map(item => {
            const isExpanded = expandedItemId === item.id;

            return (
              <li key={item.id} className={`item-card ${isExpanded ? "expanded" : ""}`}>
                <div className="item-container">
                  {/* Área da imagem (clicável) */}
                  <div
                    className="item-image-container"
                    onClick={() => setShowImageModal(item.imagePath)}
                  >
                    <img
                      src={`${API_URL}/uploads/${item.imagePath}`}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>

                  {/* Área de informações */}
                  <div className="item-info">
                    <div>
                      <h3>{item.name}</h3>
                      <h4>{item.subname}</h4>
                    </div>

                    <button
                      className="btn-expand"
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="item-details">
                    <p>Data de criação: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <a
                      href={`${API_URL}/uploads/${item.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      Baixar arquivo
                    </a>
                    <div className="action-buttons">
                      <button className="btn editar">Editar</button>
                      <button className="btn excluir">Excluir</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export default CategoryPage;
