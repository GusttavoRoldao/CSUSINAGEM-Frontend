import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = await login(email, password);

    if (data.success) {
      localStorage.setItem("token", data.token);
      setError("");
      //navigate("/dashboard");
       window.location.href = "/dashboard";
    } else {
      setError(data.message || "Falha no login");
    }
  }

  console.log('API base URL:', import.meta.env.VITE_BACKEND_URL);


  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "auto", padding: 20 }}>
      <h2>Login Admin</h2>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button style={{ marginTop: 15 }} type="submit">
        Entrar
      </button>
      <button
        type="button"
        style={{ marginTop: 10, marginLeft: 10 }}
        onClick={() => navigate("/register")}
      >
        Registrar
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
