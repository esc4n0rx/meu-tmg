import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const RegisterPetScreen = () => {
  const navigate = useNavigate();
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterPet = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) throw new Error("Usuário não autenticado.");

      const { error } = await supabase.from("pets_tg").insert([
        {
          owner_id: userId,
          pet_name: petName,
          health: 100,
          hunger: 0,
          happiness: 100,
        },
      ]);
      if (error) throw error;

      alert("Pet registrado com sucesso!");
      navigate("/pet"); 
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar o pet: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-retro p-4">
      <div className="bg-gray-800 rounded-3xl border-4 border-gray-700 p-6 max-w-md w-full shadow-lg">
        <h1 className="text-center text-2xl mb-6">Crie seu Pet</h1>
        <p className="text-center mb-6">
          Escolha um nome para o seu novo pet pixelado!
        </p>
        <input
          type="text"
          placeholder="Nome do Pet"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleRegisterPet}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded"
          disabled={loading || !petName}
        >
          {loading ? "Registrando Pet..." : "Registrar Pet"}
        </button>
      </div>
    </div>
  );
};

export default RegisterPetScreen;
