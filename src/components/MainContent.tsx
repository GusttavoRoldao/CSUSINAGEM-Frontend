import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import './MainContent.css';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import ModalCategoria from "./ModalCategoria";
import EditCategoryModal from "./EditCategoryModal";
import ConfirmationModal from "./ConfirmationModal";

export interface Category {
  id: string;
  name: string;
  imagePath: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const loadCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNewCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  const isSidebarExpanded = isSidebarPinned || isSidebarHovered;
  const mainContentClasses = `main-content ${!isSidebarExpanded ? 'sidebar-collapsed-margin' : ''}`;


  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`${API_URL}/categories/${categoryToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao deletar categoria");
      }

      // Atualiza a lista de categorias
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      alert(error instanceof Error ? error.message : "Erro ao deletar categoria");
    }
  };
  return (
    <div className="dashboard-container">
      <Sidebar
        onCategoryAdded={handleNewCategory}
        onPinToggle={setIsSidebarPinned}
        onHoverChange={setIsSidebarHovered}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <div className={mainContentClasses}>
        <h2>Categorias</h2>
        <div className="content-grid">
          {categories.map(cat => (
            <div key={cat.id} className="card">
              <div className="card-image-container">
                <img src={`${API_URL}/uploads/${cat.imagePath}`} alt={cat.name} />
                <button className="edit-image-button" onClick={() => setEditingCategory(cat)}>
                  ✏️ Editar
                </button>
              </div>
              <h4>{cat.name}</h4>
              <div className="card-actions">
                <button onClick={() => navigate(`/category/${cat.id}`)}>
                  Ver Categoria
                </button>
                <button
                  className="delete-button"
                  onClick={() => setCategoryToDelete(cat)}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="floating-add-button" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {/* Modal para adicionar nova categoria */}
      {isModalOpen && (
        <ModalCategoria
          onClose={() => setIsModalOpen(false)}
          onCategoryAdded={(data) => {
            handleNewCategory(data);
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Modal para editar categoria existente */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={(updatedCategory) => {
            handleUpdateCategory(updatedCategory);
            setEditingCategory(null);
          }}
        />
      )}

      {categoryToDelete && (
        <ConfirmationModal
          isOpen={!!categoryToDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a categoria "${categoryToDelete.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeleteCategory}
          onCancel={() => setCategoryToDelete(null)}
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};

export default MainContent;