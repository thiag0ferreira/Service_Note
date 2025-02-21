import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [novaEmpresa, setNovaEmpresa] = useState({ nome: "", cnpj: "", telefone: "", responsavel: "" });
    const [editando, setEditando] = useState(null);
    const [mostrarEmpresas, setMostrarEmpresas] = useState(false);

    useEffect(() => {
        carregarEmpresas();
    }, []);

    const carregarEmpresas = () => {
        axios.get("https://service-note.onrender.com/empresas")
            .then(res => setEmpresas(res.data))
            .catch(err => console.error("Erro ao buscar empresas:", err));
    };

    const handleEmpresaChange = (e) => {
        setNovaEmpresa({ ...novaEmpresa, [e.target.name]: e.target.value });
    };

    const adicionarEmpresa = () => {
        if (!novaEmpresa.nome || !novaEmpresa.cnpj || !novaEmpresa.telefone || !novaEmpresa.responsavel) {
            alert("Preencha todos os campos antes de adicionar a empresa!");
            return;
        }

        if (editando !== null) {
            axios.put(`http://localhost:5000/empresas/${editando}`, novaEmpresa)
                .then(() => {
                    carregarEmpresas();
                    setEditando(null);
                })
                .catch(err => console.error("Erro ao atualizar empresa:", err));
        } else {
            axios.post("http://localhost:5000/empresas", novaEmpresa)
                .then(() => carregarEmpresas())
                .catch(err => console.error("Erro ao adicionar empresa:", err));
        }

        setNovaEmpresa({ nome: "", cnpj: "", telefone: "", responsavel: "" });
    };

    const editarEmpresa = (id) => {
        const empresaSelecionada = empresas.find(emp => emp._id === id);
        setNovaEmpresa(empresaSelecionada);
        setEditando(id);
    };

    const excluirEmpresa = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
            axios.delete(`http://localhost:5000/empresas/${id}`)
                .then(() => {
                    carregarEmpresas(); // Atualiza a lista após a exclusão
                    alert("Empresa excluída com sucesso!");
                })
                .catch(err => console.error("Erro ao excluir empresa:", err));
        }
    };

    return (
        <div>
            <h2>Cadastro de Empresas</h2>
            <input type="text" name="nome" placeholder="Nome da Empresa" value={novaEmpresa.nome} onChange={handleEmpresaChange} />
            <input type="text" name="cnpj" placeholder="CNPJ" value={novaEmpresa.cnpj} onChange={handleEmpresaChange} />
            <input type="text" name="telefone" placeholder="Telefone" value={novaEmpresa.telefone} onChange={handleEmpresaChange} />
            <input type="text" name="responsavel" placeholder="Responsável" value={novaEmpresa.responsavel} onChange={handleEmpresaChange} />
            <button className="btn" onClick={adicionarEmpresa}>
                {editando !== null ? "Salvar Alteração" : "Adicionar Empresa"}
            </button>

            <button className="toggle-btn" onClick={() => setMostrarEmpresas(!mostrarEmpresas)}>
                {mostrarEmpresas ? "Ocultar Empresas" : "Mostrar Empresas"}
            </button>

            {mostrarEmpresas && (
                <ul className="empresa-list">
                    {empresas.map((empresa) => (
                        <li key={empresa._id} className="empresa-item">
                            {empresa.nome} - {empresa.cnpj} - {empresa.telefone} - {empresa.responsavel}
                            <button className="edit-btn" onClick={() => editarEmpresa(empresa._id)}>Editar</button>
                            <button className="delete-btn" onClick={() => excluirEmpresa(empresa._id)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Empresas;
