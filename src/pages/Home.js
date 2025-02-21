import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const Home = () => {
    const [servicos, setServicos] = useState([]);
    const [mostrarServicos, setMostrarServicos] = useState(true);

    useEffect(() => {
        axios.get("https://service-note.onrender.com/servicos")
            .then((res) => setServicos(res.data))
            .catch((err) => console.error("Erro ao buscar serviços:", err));
    }, []);

    const toggleFinalizado = async (id) => {
        const servico = servicos.find((s) => s._id === id);
        if (!servico) return;

        try {
            const { data } = await axios.put(`https://service-note.onrender.com/servicos/${id}`, { finalizado: !servico.finalizado });
            setServicos(servicos.map((s) => (s._id === id ? data : s)));
        } catch (err) {
            console.error("Erro ao atualizar serviço:", err);
        }
    };

    const servicosPorEmpresa = servicos.reduce((acc, servico) => {
        acc[servico.empresa] = acc[servico.empresa] || [];
        acc[servico.empresa].push(servico);
        return acc;
    }, {});

    return (
        <div>
            <h2>Histórico de Serviços</h2>
            <button className="toggle-btn" onClick={() => setMostrarServicos(!mostrarServicos)}>
                {mostrarServicos ? "Ocultar Serviços" : "Mostrar Serviços"}
            </button>
            {mostrarServicos && (
                <div>
                    {Object.keys(servicosPorEmpresa).map((empresa, index) => (
                        <div key={index} className="empresa-section">
                            <h3>{empresa}</h3>
                            <ul className="servico-list">
                                {servicosPorEmpresa[empresa].map((servico) => (
                                    <li key={servico._id} className="servico-item" style={{ backgroundColor: servico.finalizado ? "#28a745" : "#dc3545", color: "white", padding: "10px", borderRadius: "5px" }}>
                                        {servico.descricao} - R${servico.valor} - {servico.solicitante}
                                        <button className="finalizar-btn" onClick={() => toggleFinalizado(servico._id)}>
                                            {servico.finalizado ? "Desmarcar Finalizado" : "Marcar como Finalizado"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
