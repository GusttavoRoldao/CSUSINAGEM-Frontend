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
  stepId?: string; // Novo prop para identificação do passo do tutorial
}

interface SidebarProps {
  onCategoryAdded: (category: Category) => void;
  onPinToggle: (isPinned: boolean) => void;
  onHoverChange: (isHovered: boolean) => void;
  onOpenModal: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ text, icon, onClick, stepId }) => (
  <div className="sidebar-item" onClick={onClick} data-step={stepId}>
    {icon && <span className="sidebar-item-icon">{icon}</span>}
    <span className="sidebar-item-text">{text}</span>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  onCategoryAdded,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Verifica se é a primeira vez do usuário
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
      >
        <div className="sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="Logo" className="sidebar-logo" />
          </div>

          <SidebarItem 
            text="Home" 
            icon={"🏠"} 
            stepId="home"
            onClick={() => handleNavigation('/dashboard')} 
          />
          <SidebarItem 
            text="Histórico" 
            icon={"📜"} 
            stepId="history"
            onClick={() => handleNavigation('/feature')} 
          />
          <SidebarItem 
            text="Categorias" 
            icon={"🏷️"} 
            stepId="categories"
            onClick={() => handleNavigation('add-category')} 
          />

          <div className="sidebar-help" onClick={() => setShowTutorial(true)}>
            <span className="sidebar-help-icon">?</span>
            <span className="sidebar-help-text">Ajuda</span>
          </div>

          <SidebarItem
            text="Logout"
            icon={"🚪"}
            stepId="logout"
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

      {/* Modal de adição de categoria */}
      {isModalOpen && (
        <ModalCategoria
          onClose={handleModalClose}
          onCategoryAdded={(data) => {
            if (onCategoryAdded) onCategoryAdded(data);
            handleModalClose();
          }}
        />
      )}

      {/* Tutorial interativo */}
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