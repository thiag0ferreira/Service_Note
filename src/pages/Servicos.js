import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const Servicos = () => {
    const [servicos, setServicos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [novoServico, setNovoServico] = useState({ data: "", descricao: "", valor: "", solicitante: "", empresa: "" });
    const [editando, setEditando] = useState(null);
    const [mostrarServicos, setMostrarServicos] = useState(true);

    useEffect(() => {
        axios.get("https://service-note.onrender.com/servicos")
            .then(res => setServicos(res.data))
            .catch(err => console.error("Erro ao buscar serviços:", err));

        axios.get("https://service-note.onrender.com/empresas")
            .then(res => setEmpresas(res.data))
            .catch(err => console.error("Erro ao buscar empresas:", err));
    }, []);

    const handleChange = (e) => {
        setNovoServico({ ...novoServico, [e.target.name]: e.target.value });
    };

    const adicionarServico = () => {
        if (!novoServico.data || !novoServico.descricao || !novoServico.valor || !novoServico.solicitante || !novoServico.empresa) {
            alert("Preencha todos os campos antes de adicionar o serviço!");
            return;
        }

        if (editando !== null) {
            axios.put(`https://service-note.onrender.com/servicos/${editando}`, novoServico)
                .then(res => {
                    setServicos(servicos.map(servico => servico._id === editando ? res.data : servico));
                    setEditando(null);
                })
                .catch(err => console.error("Erro ao atualizar serviço:", err));
        } else {
            axios.post("https://service-note.onrender.com/servicos", novoServico)
                .then(res => setServicos([...servicos, res.data]))
                .catch(err => console.error("Erro ao adicionar serviço:", err));
        }

        setNovoServico({ data: "", descricao: "", valor: "", solicitante: "", empresa: "" });
    };

    const excluirServico = (id) => {
        axios.delete(`https://service-note.onrender.com/servicos/${id}`)
            .then(() => setServicos(servicos.filter(servico => servico._id !== id)))
            .catch(err => console.error("Erro ao excluir serviço:", err));
    };

    return (
        <div>
            <h2>Cadastro de Serviços</h2>
            <select name="empresa" value={novoServico.empresa} onChange={handleChange}>
                <option value="">Selecione uma Empresa</option>
                {empresas.map((empresa) => (
                    <option key={empresa._id} value={empresa.nome}>{empresa.nome}</option>
                ))}
            </select>

            {novoServico.empresa && (
                <>
                    <input type="date" name="data" value={novoServico.data} onChange={handleChange} />
                    <input type="text" name="descricao" placeholder="Descrição do Serviço" value={novoServico.descricao} onChange={handleChange} />
                    <input type="number" name="valor" placeholder="Valor" value={novoServico.valor} onChange={handleChange} />
                    <input type="text" name="solicitante" placeholder="Solicitante" value={novoServico.solicitante} onChange={handleChange} />
                    <button className="btn" onClick={adicionarServico}>
                        {editando ? "Salvar Alteração" : "Adicionar Serviço"}
                    </button>
                </>
            )}

            <button className="toggle-btn" onClick={() => setMostrarServicos(!mostrarServicos)}>
                {mostrarServicos ? "Ocultar Serviços" : "Mostrar Serviços"}
            </button>

            {mostrarServicos && servicos.length > 0 && (
                <>
                    <h3>Serviços Cadastrados</h3>
                    <ul className="servico-list">
                        {servicos.map((servico) => (
                            <li key={servico._id} className="servico-item">
                                {servico.empresa} - {servico.descricao} - R${servico.valor} - {servico.solicitante}
                                <button className="edit-btn" onClick={() => setEditando(servico._id)}>Editar</button>
                                <button className="delete-btn" onClick={() => excluirServico(servico._id)}>Excluir</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Servicos;
