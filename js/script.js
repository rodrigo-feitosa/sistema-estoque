class Produto {
    constructor() {
        this.nome = document.getElementById('nome_produto').value;
        this.descricao = document.getElementById('descricao_produto').value;
        this.categoria = document.getElementById('categoria_produto').value;
        this.unidade_medida = document.getElementById('unidade_medida').value;
        this.preco = document.getElementById('preco_produto').value;
        this.fornecedor = document.getElementById('fornecedor').value;
    }

    async cadastrarProduto() {
        const dados = {
            nome: this.nome,
            descricao: this.descricao,
            categoria: this.categoria,
            unidade_medida: this.unidade_medida,
            preco: this.preco,
            fornecedor: this.fornecedor
        };

        const resposta = await fetch('./backend/index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();
        alert(resultado.mensagem);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProduto');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const produto = new Produto();
        await produto.cadastrarProduto();

        form.reset();
    });
});