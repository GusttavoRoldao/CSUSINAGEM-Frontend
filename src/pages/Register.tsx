import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Ou import "./Register.css" se criar arquivo separado

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        setError(data.message || "Erro ao cadastrar");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <div className="register-header">
          <h2>Criar Conta</h2>
          <p>Preencha seus dados para se registrar</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <small className="text-muted">Mínimo 6 caracteres</small>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Criar Conta"}
          </button>

          <Link to="/login" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o Login
          </Link>
        </form>
      </div>
    </div>
  );
}