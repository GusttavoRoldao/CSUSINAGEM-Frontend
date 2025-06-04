import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "./Login.css";

// Substitua este caminho pelo local correto do seu arquivo de imagem.
// Se você estiver usando a pasta `src/assets/`, garanta que `login-left.png` esteja lá.
import LoginIllustration from "../assets/login-left.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Falha no login");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      {/* ====================
          LADO ESQUERDO: IMAGEM
          ==================== */}
      <div className="login-left">
        <img
          src={LoginIllustration}
          alt="Ilustração de login"
          className="login-left-image"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* ====================
          LADO DIREITO: FORMULÁRIO
          ==================== */}
      <div className="login-right">
        <div className="form-wrapper">
          <h1 className="login-title">Entrar</h1>
          <p className="login-subtitle">continuar com endereço de e-mail</p>

          <form onSubmit={handleSubmit}>
            {/* Input de e-mail */}
            <div className="input-group">
              <span className="input-icon email-icon">
                {/* SVG de ícone de e-mail */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Input de senha */}
            <div className="input-group">
              <span className="input-icon lock-icon">
                {/* SVG de ícone de cadeado */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Botão de Entrar */}
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
          </form>

          {/* Link para registro */}
          <p className="register-text">
            Não possui uma conta?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Cadastre-se
            </span>
          </p>

          {/* Mensagem de erro, caso exista */}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}
