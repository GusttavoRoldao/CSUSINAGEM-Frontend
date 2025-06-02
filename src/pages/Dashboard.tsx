import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import './Dashboard.css';
import CategoryPage from "./CategoryPage";
import Tutorial from "../components/Tutorial";

export default function Dashboard() {
    const [showAddItemForm, setShowAddItemForm] = useState(false);
      const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

    // Verifica se é a primeira vez do usuário
    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenDashboardTutorial');
        if (!hasSeenTutorial) {
            setShowTutorial(true);
            localStorage.setItem('hasSeenDashboardTutorial', 'true');
        }
    }, []);

    const tutorialSteps = [
        {
            target: '.btn-novo-item',
            title: 'Criar Nova Categoria',
            content: 'Clique aqui para adicionar uma nova categoria de itens ao sistema. Você poderá organizar seus programas CNC por categorias.',
            position: 'right'
        },
        {
            target: '.sidebar-item:first-child',
            title: 'Menu de Navegação',
            content: 'Acesse rapidamente todas as seções do sistema através deste menu lateral.',
            position: 'right'
        },
        {
            target: '.search-container input',
            title: 'Busca Rápida',
            content: 'Digite aqui para encontrar qualquer item cadastrado no sistema.',
            position: 'bottom'
        },
        {
            target: '.item-card:first-child',
            title: 'Itens Cadastrados',
            content: 'Cada item mostra a imagem, nome e descrição. Clique para expandir e ver mais detalhes.',
            position: 'right'
        }
    ];

    const handleTutorialFinish = () => {
        setShowTutorial(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                onCategoryAdded={() => { }}
                onPinToggle={() => { }}
                onHoverChange={() => { }}
                onOpenModal={() => { }}
                onHelpClick={() => setShowTutorial(true)}
            />

            <div className="main-content-container">
                {showAddItemForm ? (
                    <CategoryPage />
                ) : (
                    <MainContent />
                )}
            </div>

            {showTutorial && (
                <Tutorial
                    steps={tutorialSteps}
                    currentStep={tutorialStep}
                    onStepChange={setTutorialStep}
                    onFinish={() => setShowTutorial(false)}
                />
            )}
        </div>
    );
}