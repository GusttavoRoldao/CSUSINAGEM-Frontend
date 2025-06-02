import React, { useEffect } from 'react';
import './Tutorial.css';

interface Step {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onFinish: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ steps, currentStep, onStepChange, onFinish }) => {
  useEffect(() => {
    // Adiciona classe ao body para estilização
    document.body.classList.add('tutorial-active');
    
    // Destacar elemento atual
    const currentElement = document.querySelector(steps[currentStep].target);
    if (currentElement) {
      currentElement.classList.add('highlight');
    }

    // Configurar teclas de atalho
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFinish();
      if (e.key === 'ArrowRight') onStepChange(Math.min(currentStep + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') onStepChange(Math.max(currentStep - 1, 0));
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('tutorial-active');
      if (currentElement) {
        currentElement.classList.remove('highlight');
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, steps, onFinish, onStepChange]);

  if (!steps.length || currentStep >= steps.length) return null;

  const currentStepData = steps[currentStep];
  const targetElement = document.querySelector(currentStepData.target);
  
  if (!targetElement) {
    onStepChange(currentStep + 1);
    return null;
  }

  const rect = targetElement.getBoundingClientRect();
  const position = currentStepData.position || 'bottom';

  return (
    <>
      <div className="tutorial-overlay" onClick={onFinish} />
      
      <div 
        className={`tutorial-tooltip ${position}`}
        style={{
          left: `${rect.left + rect.width / 2}px`,
          top: position === 'bottom' ? `${rect.bottom + 10}px` : 
               position === 'top' ? `${rect.top - 10}px` :
               `${rect.top + rect.height / 2}px`,
          transform: position === 'left' ? 'translateX(-100%) translateY(-50%)' :
                    position === 'right' ? 'translateX(10px) translateY(-50%)' :
                    'translateX(-50%)'
        }}
      >
        <div className="tutorial-header">
          <h3>{currentStepData.title}</h3>
          <span className="tutorial-step-count">{currentStep + 1}/{steps.length}</span>
        </div>
        <p>{currentStepData.content}</p>
        <div className="tutorial-footer">
          <div className="tutorial-buttons">
            {currentStep > 0 && (
              <button 
                className="tutorial-button secondary" 
                onClick={() => onStepChange(currentStep - 1)}
              >
                Voltar
              </button>
            )}
            <button 
              className="tutorial-button primary" 
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  onFinish();
                } else {
                  onStepChange(currentStep + 1);
                }
              }}
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;