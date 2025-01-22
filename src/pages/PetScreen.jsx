import React, { useEffect, useState } from "react";
import Pet from "../components/Pet";
import { startPetManager, interactWithPet } from "../algorithms/petManager";

const PetScreen = () => {
  const [command, setCommand] = useState(null); 
  const [petStats, setPetStats] = useState({
    health: 100,
    hunger: 0,
    happiness: 100,
  });
  const petId = localStorage.getItem("pet_id"); 

  useEffect(() => {
    if (petId) {
      console.log("Iniciando gerenciador do pet...");
      startPetManager(petId);
    }
  }, [petId]);

  const handleCommand = async (action) => {
    setCommand(action); 
    const updatedStats = await interactWithPet(petId, action);
    if (updatedStats) {
      setPetStats(updatedStats); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-retro p-4">
     
      <div className="bg-gray-800 rounded-3xl border-4 border-gray-700 p-6 max-w-md w-full shadow-lg">
  
        <h1 className="text-center text-2xl mb-6">Seu Pet Virtual</h1>

    
        <div className="bg-gray-700 rounded-lg border-4 border-gray-600 p-4 h-60 flex justify-center items-center mb-6">
          <Pet command={command} />
        </div>

       
        <div className="bg-gray-700 rounded-lg p-3 border-4 border-gray-600 text-center mb-6">
          <p className="text-sm">
            <span className="font-bold">Saúde:</span> {petStats.health}% |{" "}
            <span className="font-bold">Fome:</span> {petStats.hunger}% |{" "}
            <span className="font-bold">Felicidade:</span> {petStats.happiness}%
          </p>
        </div>


        <div className="flex justify-between gap-4">
          <button
            onClick={() => handleCommand("feed")}
            className="flex-1 bg-gray-600 px-3 py-2 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 text-sm"
          >
            Alimentar
          </button>
          <button
            onClick={() => handleCommand("play")}
            className="flex-1 bg-gray-600 px-3 py-2 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 text-sm"
          >
            Brincar
          </button>
          <button
            onClick={() => handleCommand("sleep")}
            className="flex-1 bg-gray-600 px-3 py-2 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 text-sm"
          >
            Dormir
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetScreen;
