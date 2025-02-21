require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("🔥 Conectado ao MongoDB"))
    .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

const EmpresaSchema = new mongoose.Schema({
    nome: String,
    cnpj: String,
    telefone: String,
    responsavel: String
});

const ServicoSchema = new mongoose.Schema({
    data: String,
    descricao: String,
    valor: Number,
    solicitante: String,
    empresa: String,
    finalizado: { type: Boolean, default: false }
});

const Empresa = mongoose.model("Empresa", EmpresaSchema);
const Servico = mongoose.model("Servico", ServicoSchema);

// 📌 Rota para adicionar empresas
app.post("/empresas", async (req, res) => {
    const novaEmpresa = new Empresa(req.body);
    await novaEmpresa.save();
    res.json(novaEmpresa);
});

// 📌 Rota para listar empresas
app.get("/empresas", async (req, res) => {
    const empresas = await Empresa.find();
    res.json(empresas);
});

// 📌 Rota para deletar uma empresa
app.delete("/empresas/:id", async (req, res) => {
    try {
        const empresaRemovida = await Empresa.findByIdAndDelete(req.params.id);
        if (!empresaRemovida) {
            return res.status(404).json({ message: "Empresa não encontrada" });
        }
        res.json({ message: "Empresa removida com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao excluir empresa", error: err });
    }
});


// 📌 Rota para adicionar serviços
app.post("/servicos", async (req, res) => {
    const novoServico = new Servico(req.body);
    await novoServico.save();
    res.json(novoServico);
});

// 📌 Rota para listar serviços
app.get("/servicos", async (req, res) => {
    const servicos = await Servico.find();
    res.json(servicos);
});

// 📌 Rota para atualizar um serviço (finalizar)
app.put("/servicos/:id", async (req, res) => {
    const servicoAtualizado = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(servicoAtualizado);
});

// 📌 Rota para deletar um serviço
app.delete("/servicos/:id", async (req, res) => {
    await Servico.findByIdAndDelete(req.params.id);
    res.json({ message: "Serviço removido!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
