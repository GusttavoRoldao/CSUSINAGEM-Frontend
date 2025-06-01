import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import './MainContent.css';
import './Sidebar.css'; // Make sure this is imported if Sidebar.css is not in App.css
import { useNavigate } from 'react-router-dom';
import ModalCategoria from "./ModalCategoria";

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

  const loadCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    setCategories(data);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNewCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const isSidebarExpanded = isSidebarPinned || isSidebarHovered;
  const mainContentClasses = `main-content ${!isSidebarExpanded ? 'sidebar-collapsed-margin' : ''}`;

  return (
    <div className="dashboard-container">

      <Sidebar
        onCategoryAdded={handleNewCategory}
        onPinToggle={setIsSidebarPinned}
        onHoverChange={setIsSidebarHovered}
        onOpenModal={handleOpenModal}
      />

      {/* Apply the dynamic class to the main-content div */}
      <div className={mainContentClasses}>
        <h2>Categorias</h2>
        <div className="content-grid">
          {categories.map(cat => (
            <div key={cat.id || cat.name} className="card">
              <img src={`${API_URL}/uploads/${cat.imagePath}`} alt={cat.name} />
              <h4>{cat.name}</h4>
              <button onClick={() => navigate(`/category/${cat.id}`)}>Ver Categoria</button>
            </div>

          ))}
        </div>
      </div>
      <button className="floating-add-button" onClick={handleOpenModal}>+</button>
      {isModalOpen && (
        <ModalCategoria
          onClose={handleCloseModal}
          onCategoryAdded={(data) => {
            handleNewCategory(data);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

export default MainContent;
