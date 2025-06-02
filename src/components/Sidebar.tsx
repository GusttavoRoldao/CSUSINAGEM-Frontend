import React, { useState } from "react";
import './Sidebar.css';
import { Category } from "./MainContent";
import ModalCategoria from "./ModalCategoria";
import logo from '../assets/csusinagem.png';
import ConfirmationModal from "./ConfirmationModal";

interface SidebarItemProps {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface SidebarProps {
  onCategoryAdded: (category: Category) => void;
  onPinToggle: (isPinned: boolean) => void;
  onHoverChange: (isHovered: boolean) => void;
  onOpenModal: () => void;
  onHelpClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ text, icon, onClick }) => (
  <div className="sidebar-item" onClick={onClick}>
    {icon && <span className="sidebar-item-icon">{icon}</span>}
    <span className="sidebar-item-text">{text}</span>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  onCategoryAdded,
  onHelpClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNavigation = (path: string): void => {
    if (path === 'logout') {
      setShowLogoutConfirm(true);
    } else if (path === 'add-category') {
      setIsModalOpen(true);
    } else {
      window.location.href = path;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const shouldShowSidebar = isSidebarPinned || isHovered;

  return (
    <>
      <div
        className={`sidebar-container ${shouldShowSidebar ? 'show' : ''}`}
      >
        <div className="sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo" />
          </div>

          <SidebarItem text="Home" icon={"🏠"} onClick={() => handleNavigation('/dashboard')} />
          <SidebarItem text="Histórico" icon={"📜"} onClick={() => handleNavigation('/feature')} />
          <SidebarItem text="Outros" icon={"🏷️"} onClick={() => handleNavigation('/feature')} />

          <div className="sidebar-help" onClick={onHelpClick}>
            <span className="sidebar-help-icon">?</span>
            <span className="sidebar-help-text">Ajuda</span>
          </div>
          <SidebarItem
            text="Logout"
            icon={"🚪"}
            onClick={() => handleNavigation('logout')}
          />
        </div>
      </div>

      {/* Modal de confirmação de logout */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair do sistema?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {isModalOpen && (
        <ModalCategoria
          onClose={handleModalClose}
          onCategoryAdded={(data) => {
            if (onCategoryAdded) onCategoryAdded(data);
            handleModalClose();
          }}
        />
      )}
    </>
  );
};

export default Sidebar;