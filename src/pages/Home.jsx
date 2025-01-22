import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const Home = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [title, setTitle] = useState("");
  const fullTitle = "PixelPals";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTitle((prev) => fullTitle.slice(0, index));
      index++;
      if (index > fullTitle.length) {
        setTimeout(() => setTitle(""), 1000);
        index = 0;
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      console.log("Tentando login com email:", email);
  
      const { data: users, error: userError } = await supabase
        .from("users_tg")
        .select("*")
        .eq("email", email)
        .eq("password", password);
  
      console.log("Resultado da consulta de login:", users);
  
      if (userError) {
        console.error("Erro na consulta de login:", userError);
        throw userError;
      }
  
      if (users.length === 0) {
        console.warn("Nenhum usuário encontrado com essas credenciais.");
        throw new Error("Email ou senha incorretos.");
      }
  
      const userId = users[0].id;
      console.log("Usuário autenticado com ID:", userId);
  
      localStorage.setItem("user_id", userId);
  
      const { data: pets, error: petsError } = await supabase
        .from("pets_tg")
        .select("*")
        .eq("owner_id", userId);
  
      console.log("Pets encontrados:", pets);
  
      if (petsError) {
        console.error("Erro ao buscar pets:", petsError);
        throw petsError;
      }
  
      if (pets.length > 0) {
        console.log("Redirecionando para a tela do pet...");
        navigate("/pet");
      } else {
        console.log("Redirecionando para a tela de registro do pet...");
        navigate("/register-pet");
      }
    } catch (error) {
      console.error("Erro no processo de login:", error);
      alert("Erro ao realizar login: " + error.message);
    }
  };
  
  const handleRegister = async (email, password, name) => {
    try {
      console.log("Tentando registrar usuário com email:", email);
  
      // Verifica se o email já está registrado
      const { data: existingUsers, error: checkError } = await supabase
        .from("users_tg")
        .select("*")
        .eq("email", email);
  
      console.log("Resultado da verificação de email existente:", existingUsers);
  
      if (checkError) {
        console.error("Erro ao verificar email existente:", checkError);
        throw checkError;
      }
  
      if (existingUsers.length > 0) {
        console.warn("Email já registrado:", email);
        throw new Error("Email já está registrado.");
      }
  
      // Insere o novo usuário
      const { data, error: insertError } = await supabase.from("users_tg").insert([
        {
          name,
          email,
          password,
        },
      ]);
  
      console.log("Resultado da inserção do usuário:", data);
  
      if (insertError) {
        console.error("Erro ao inserir novo usuário:", insertError);
        throw insertError;
      }
  
      if (!data || data.length === 0) {
        throw new Error("A inserção do usuário não retornou nenhum dado.");
      }
  
      const userId = data[0]?.id;
      if (!userId) {
        throw new Error("ID do usuário não retornado pela inserção.");
      }
  
      console.log("Usuário registrado com ID:", userId);
  
      localStorage.setItem("user_id", userId);
  
      console.log("Redirecionando para a tela de registro do pet...");
      navigate("/register-pet");
    } catch (error) {
      console.error("Erro no processo de registro:", error);
      alert("Erro ao registrar usuário: " + error.message);
    }
  };
  
  
  

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/cover.jpg')",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-pixel">{title}</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-6 px-4">
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Crie seu Pet</h2>
          <p>Escolha um nome, personalize e comece sua jornada!</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Cuide do seu Pet</h2>
          <p>Alimente, brinque e acompanhe a saúde do seu pet.</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Progresso</h2>
          <p>Veja como seu pet cresce e melhora ao longo do tempo.</p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowRegisterModal(true)}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-lg"
        >
          Criar Conta
        </button>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-lg"
        >
          Entrar
        </button>
      </div>

      {/* Modais */}
      {showLoginModal && (
        <Modal
          title="Entrar"
          onClose={() => setShowLoginModal(false)}
          onConfirm={(email, password) => handleLogin(email, password)}
        />
      )}
      {showRegisterModal && (
        <Modal
          title="Registrar"
          onClose={() => setShowRegisterModal(false)}
          onConfirm={(email, password, name) =>
            handleRegister(email, password, name)
          }
        />
      )}
    </div>
  );
};

// Componente Modal
const Modal = ({ title, onClose, onConfirm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {title === "Registrar" && (
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(email, password, name)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
