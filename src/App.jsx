import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterPetScreen from "./pages/RegisterPetScreen";
import PetScreen from "./pages/PetScreen";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-pet" element={<RegisterPetScreen />} />
        <Route path="/pet" element={<PetScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
