import React, { useState, useEffect } from "react";
import './Sidebar.css';
import { Category } from "./MainContent";
import ModalCategoria from "./ModalCategoria";
import logo from '../assets/csusinagem.png';
import ConfirmationModal from "./ConfirmationModal";
import Tutorial from "./Tutorial";

interface SidebarItemProps {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  stepId?: string;
  isActive?: boolean;
}

interface SidebarProps {
  onCategoryAdded: (category: Category) => void;
  onPinToggle?: (isPinned: boolean) => void;
  onHoverChange?: (isHovered: boolean) => void;
  onOpenModal?: () => void;
  onHelpClick?: () => void;
  activePath?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ text, icon, onClick, stepId, isActive = false }) => (
  <div 
    className={`menu-item ${isActive ? 'active' : ''}`} 
    onClick={onClick} 
    data-step={stepId}
  >
    <span className="menu-icon">{icon}</span>
    <span className="sidebar-item-text">{text}</span>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  onCategoryAdded,
  onHelpClick,
  activePath = '/dashboard'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenSidebarTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('hasSeenSidebarTutorial', 'true');
    }
  }, []);

  const tutorialSteps = [
    {
      target: '[data-step="home"]',
      title: 'Menu Home',
      content: 'Este é o botão principal para voltar ao dashboard inicial.',
      position: 'right'
    },
    {
      target: '[data-step="history"]',
      title: 'Histórico de Operações',
      content: 'Acesse aqui o histórico completo de todas as operações realizadas.',
      position: 'right'
    },
    {
      target: '[data-step="categories"]',
      title: 'Gerenciar Categorias',
      content: 'Clique aqui para adicionar ou editar categorias de usinagem.',
      position: 'right'
    },
    {
      target: '[data-step="logout"]',
      title: 'Sair do Sistema',
      content: 'Use este botão para encerrar sua sessão com segurança.',
      position: 'right'
    },
    {
      target: '.sidebar-help',
      title: 'Precisa de Ajuda?',
      content: 'Clique aqui para ver este tutorial novamente quando precisar.',
      position: 'right'
    }
  ];

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo" />
          </div>

          <div className="sidebar-menu">
            <SidebarItem 
              text="Home" 
              icon="🏠"
              stepId="home"
              isActive={activePath === '/dashboard'}
              onClick={() => handleNavigation('/dashboard')} 
            />
            <SidebarItem 
              text="Histórico" 
              icon="📜"
              stepId="history"
              isActive={activePath === '/feature'}
              onClick={() => handleNavigation('/feature')} 
            />
            <SidebarItem 
              text="Indicadores" 
              icon="🏷️"
              stepId="categories"
              isActive={activePath === '/feature'}
              onClick={() => handleNavigation('/feature')} 
            />
          </div>

          <div className="sidebar-footer">
            <div 
              className="sidebar-help" 
              onClick={() => {
                onHelpClick?.();
                if (!onHelpClick) setShowTutorial(true);
              }}
            >
              <span className="sidebar-help-icon">?</span>
              <span className="sidebar-help-text">Ajuda</span>
            </div>

            <SidebarItem
              text="Sair"
              icon="🚪"
              stepId="logout"
              onClick={() => handleNavigation('logout')}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair do sistema?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Sair"
        cancelText="Cancelar"
      />

      {isModalOpen && (
        <ModalCategoria
          onClose={handleModalClose}
          onCategoryAdded={(data) => {
            onCategoryAdded?.(data);
            handleModalClose();
          }}
        />
      )}

      {showTutorial && (
        <Tutorial 
          steps={tutorialSteps}
          currentStep={tutorialStep}
          onStepChange={setTutorialStep}
          onFinish={() => setShowTutorial(false)}
        />
      )}
    </>
  );
};

export default Sidebar;