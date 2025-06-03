import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import './CategoryPage.css';
import Tutorial from "../components/Tutorial"; // Importe o componente Tutorial
import QrCodeStatus from "../components/QrCodeStatus";

export interface Item {
  id: string;
  name: string;
  subname: string;
  imagePath: string;
  filePath: string;
  createdAt: string;
  status: 'PENDENTE' | 'CONCLUIDO'; // Adicione esta linha
  dwgPath?: string;
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

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Verifica se é a primeira vez do usuário
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenCategoryTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('hasSeenCategoryTutorial', 'true');
    }
  }, []);

  // Passos do tutorial
  const tutorialSteps = [
    {
      target: '.btn-novo-item',
      title: 'Adicionar Novo Item',
      content: 'Clique aqui para adicionar um novo item a esta categoria.',
      position: 'top'
    },
    {
      target: '.search-container',
      title: 'Busca de Itens',
      content: 'Digite aqui para filtrar os itens por nome ou descrição.',
      position: 'left'
    },
    {
      target: '.item-card:first-child',
      title: 'Lista de Itens',
      content: 'Cada item mostra uma imagem e informações básicas. Clique no item para expandir e ver mais detalhes.',
      position: 'bottom'
    },
    {
      target: '.btn-expand',
      title: 'Expandir Detalhes',
      content: 'Clique neste botão para ver informações completas sobre o item, incluindo opções para download, edição e exclusão.',
      position: 'left'
    },
    {
      target: '.item-image-container',
      title: 'Visualizar Imagem',
      content: 'Clique na imagem para ver uma versão ampliada em tela cheia.',
      position: 'bottom'
    }
  ];


  const printPDF = (filePath: string) => {
    window.open(`${API_URL}/uploads/${filePath}`, '_blank');
  };

  const printQRCode = (itemId: string, itemName: string) => {
    try {
      // 1. Encontrar o container do QR Code pelo data-attribute específico
      const qrContainer = document.querySelector(`[data-qr-container-id="qr-container-${itemId}"]`);

      if (!qrContainer) {
        throw new Error('Container do QR Code não encontrado');
      }

      // 2. Encontrar o elemento SVG dentro do container
      const qrCodeSvg = qrContainer.querySelector('svg');

      if (!qrCodeSvg) {
        throw new Error('Elemento SVG do QR Code não encontrado');
      }

      // 3. Serializar o SVG para string
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(qrCodeSvg);

      // 4. Criar URL de dados
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // 5. Criar janela de impressão
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${itemName}</title>
            <style>
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                flex-direction: column;
                text-align: center;
                font-family: Arial, sans-serif;
              }
              .qr-code-container {
                text-align: center;
                padding: 20px;
                max-width: 90%;
                margin: 0 auto;
              }
              .qr-code-image {
                width: 300px;
                height: 300px;
                margin: 0 auto 20px;
              }
              .item-info {
                margin-bottom: 20px;
              }
              @media print {
                body { height: auto; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="qr-code-container">
              <div class="item-info">
                <h2>${itemName}</h2>
                <p>ID: ${itemId}</p>
                <p>Status: ${items.find(item => item.id === itemId)?.status || 'N/A'}</p>
              </div>
              <img class="qr-code-image" src="${url}" alt="QR Code" 
                   onload="window.print(); setTimeout(() => window.close(), 500);" />
              <p class="no-print">Caso a impressão não inicie automaticamente, use o comando Ctrl+P</p>
            </div>
          </body>
        </html>
      `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Erro ao imprimir QR Code:', error);
      alert('Erro ao imprimir QR Code: ' + (error as Error).message);
    }
  };


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

    if (!name || !subname) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subname", subname);
      formData.append("categoryId", id!);
      if (imageFile) formData.append("image", imageFile);
      if (attachedFile) formData.append("file", attachedFile);

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


  

  const updateItemStatus = async (itemId: string, status: 'PENDENTE' | 'CONCLUIDO') => {
    try {
      const response = await fetch(`${API_URL}/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar status');

      setItems(items.map(item =>
        item.id === itemId ? { ...item, status } : item
      ));
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onHelpClick={() => setShowTutorial(true)} />
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

        {showTutorial && (
          <Tutorial
            steps={tutorialSteps}
            currentStep={tutorialStep}
            onStepChange={setTutorialStep}
            onFinish={() => setShowTutorial(false)}
          />
        )}

        <button className="btn-novo-item" onClick={handleAddItem}>
          +
        </button>

        {showForm && (
          <Modal onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit} className="item-form">
              <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
              <input type="text" placeholder="Codigo CS" value={subname} onChange={e => setSubname(e.target.value)} />

              {/* Campo para imagem com label */}
              <label>
                Insira o DWG ou PNG:
                <input
                  type="file"
                  accept=".cnc,.txt,.gcode,.png,.dwg,.dwf,xlsx"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                />
              </label>

              {/* Campo para arquivo CNC com label */}
              <label>
                Arquivo PDF : (.cnc,.txt,.gcode,.dwg,.dwf,xlsx,.pfd,.PDF)
                <input
                  type="file"
                  accept=".cnc,.txt,.gcode,.dwg,.dwf,xlsx,.pdf,.PDF"
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
            {showImageModal.endsWith('.ipt') ? (
              <div className="ipt-file-viewer">
                
              
              </div>
            ) : (
              <img
                src={`${API_URL}/uploads/${showImageModal}`}
                alt="Imagem expandida"
                className="expanded-image"
              />
            )}
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
                    <QrCodeStatus
                      itemId={item.id}
                      onStatusChange={(newStatus) => updateItemStatus(item.id, newStatus)}
                      currentStatus={item.status || 'PENDENTE'}
                      onPrintQrCode={() => printQRCode(item.id, item.name)}
                    />
                    <div className="action-buttons">
                      <a
                        href={`${API_URL}/uploads/${item.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                      >
                        Baixar arquivo pdf
                      </a>

                      <div className="ipt-file-viewer">

                        <a
                          href={`${API_URL}/uploads/${item.imagePath}`}
                          download
                          className="btn"
                        >
                          Baixar arquivo DWG
                        </a>
                        {/* Você pode adicionar um visualizador 3D aqui se necessário */}
                      </div>


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
