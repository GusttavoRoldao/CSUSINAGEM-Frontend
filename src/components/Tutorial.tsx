import React, { useEffect, useRef } from 'react';
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
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!steps.length || currentStep >= steps.length) return;

    const currentStepData = steps[currentStep];
    const targetElement = document.querySelector(currentStepData.target);
    
    if (!targetElement) {
      onStepChange(currentStep + 1);
      return;
    }

    // Adiciona classe de destaque
    document.body.classList.add('tutorial-active');
    targetElement.classList.add('tutorial-highlight');

    // Posiciona o tooltip
    const positionTooltip = () => {
  if (!tooltipRef.current || !targetElement) return;

  const rect = targetElement.getBoundingClientRect();
  const position = currentStepData.position || 'bottom';
  const tooltip = tooltipRef.current;

  // Verifica se o elemento é fixo
  const isFixed = window.getComputedStyle(targetElement).position === 'fixed';
  
  // Calcula posição considerando scroll apenas para elementos não fixos
  const scrollY = isFixed ? 0 : window.scrollY;
  const scrollX = isFixed ? 0 : window.scrollX;

  let top = rect.top + scrollY;
  let left = rect.left + scrollX;
  let transform = '';

  switch (position) {
    case 'bottom':
      top += rect.height + 10;
      left += rect.width / 2;
      transform = 'translateX(-50%)';
      break;
    case 'top':
      top -= 10;
      left += rect.width / 2;
      transform = 'translateX(-50%) translateY(-100%)';
      break;
    case 'left':
      top += rect.height / 2;
      left -= 10;
      transform = 'translateX(-100%) translateY(-50%)';
      break;
    case 'right':
      top += rect.height / 2;
      left += rect.width + 10;
      transform = 'translateY(-50%)';
      break;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.transform = transform;

  // Força o posicionamento correto para elementos fixos
  if (isFixed) {
    targetElement.style.transform = 'none';
    targetElement.style.top = 'auto';
    targetElement.style.bottom = '2rem';
    targetElement.style.right = '2rem';
  }
};

    positionTooltip();
    window.addEventListener('resize', positionTooltip);
    window.addEventListener('scroll', positionTooltip, { passive: true });

    // Configura atalhos de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFinish();
      if (e.key === 'ArrowRight') onStepChange(Math.min(currentStep + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') onStepChange(Math.max(currentStep - 1, 0));
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('tutorial-active');
      targetElement.classList.remove('tutorial-highlight');
      window.removeEventListener('resize', positionTooltip);
      window.removeEventListener('scroll', positionTooltip);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, steps, onFinish, onStepChange]);

  if (!steps.length || currentStep >= steps.length) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      <div className="tutorial-overlay" onClick={onFinish} />
      
      <div 
        ref={tooltipRef}
        className={`tutorial-tooltip ${currentStepData.position || 'bottom'}`}
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