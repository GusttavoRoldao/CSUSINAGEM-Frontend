import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "./Login.css"; // Importe o CSS

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
      <div className="login-form-wrapper">
        <div className="login-header">
          <h2>Login Admin</h2>
          <p>Acesse o painel de administração</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="btn-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/register")}
            >
              Registrar
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}