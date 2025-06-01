import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
   const API_URL = import.meta.env.VITE_BACKEND_URL;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Cadastro</h2>

      <div>
        <label>Nome</label><br />
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Email</label><br />
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Senha</label><br />
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>

      <button style={{ marginTop: 15 }} type="submit">Cadastrar</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
