import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const INTERVAL_TIME = 60000; 
const DECAY_RATES = {
  health: -1, 
  happiness: -2, 
  hunger: 1, 
};

const updatePetStats = async (petId) => {
  try {
    const { data: pet, error: fetchError } = await supabase
      .from("pets_tg")
      .select("*")
      .eq("id", petId)
      .single();

    if (fetchError) throw fetchError;

    let { health, happiness, hunger } = pet;

    if (hunger >= 70) {
      health += DECAY_RATES.health; 
    }
    happiness += DECAY_RATES.happiness;
    hunger += DECAY_RATES.hunger;

    health = Math.max(0, Math.min(100, health));
    happiness = Math.max(0, Math.min(100, happiness));
    hunger = Math.max(0, Math.min(100, hunger));

    const { error: updateError } = await supabase
      .from("pets_tg")
      .update({ health, happiness, hunger })
      .eq("id", petId);

    if (updateError) throw updateError;

    console.log(`Pet ${petId} atualizado:`, { health, happiness, hunger });

    return { health, happiness, hunger };
  } catch (error) {
    console.error("Erro ao atualizar o estado do pet:", error.message);
  }
};

const interactWithPet = async (petId, action) => {
  try {
    const { data: pet, error: fetchError } = await supabase
      .from("pets_tg")
      .select("*")
      .eq("id", petId)
      .single();

    if (fetchError) throw fetchError;

    let { health, happiness, hunger } = pet;

    switch (action) {
      case "feed":
        hunger = Math.max(0, hunger - 20);
        happiness = Math.min(100, happiness + 10);
        break;
      case "play":
        happiness = Math.min(100, happiness + 15);
        hunger = Math.min(100, hunger + 5);
        break;
      case "sleep":
        health = Math.min(100, health + 10);
        hunger = Math.min(100, hunger + 5);
        break;
      default:
        console.warn("Ação desconhecida:", action);
    }

    const { error: updateError } = await supabase
      .from("pets_tg")
      .update({ health, happiness, hunger })
      .eq("id", petId);

    if (updateError) throw updateError;

    console.log(`Interação '${action}' realizada no pet ${petId}:`, {
      health,
      happiness,
      hunger,
    });

    return { health, happiness, hunger };
  } catch (error) {
    console.error("Erro ao interagir com o pet:", error.message);
  }
};

const startPetManager = (petId) => {
  console.log(`Iniciando gerenciamento do pet ${petId}...`);
  setInterval(() => {
    updatePetStats(petId);
  }, INTERVAL_TIME);
};

export { updatePetStats, interactWithPet, startPetManager };
