import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Empresas from "./pages/Empresas";
import Servicos from "./pages/Servicos";

const App = () => {
  return (
      <Router>
        <div className="container">
          <nav>
            <Link to="/">🏠 Home</Link>
            <Link to="/empresas">🏢 Empresas</Link>
            <Link to="/servicos">📝 Serviços</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/servicos" element={<Servicos />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
