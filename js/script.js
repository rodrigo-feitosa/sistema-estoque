class Produto {
    constructor(nome, descricao, categoria, unidade_medida, preco, fornecedor) {
        this.nome = document.getElementById('nome_produto')?.value;
        this.descricao = document.getElementById('descricao_produto')?.value;
        this.categoria = document.getElementById('categoria_produto')?.value;
        this.unidade_medida = document.getElementById('unidade_medida')?.value;
        this.preco = document.getElementById('preco_produto')?.value;
        this.fornecedor = document.getElementById('fornecedor')?.value;
    }

    cadastrarProduto() {
        const dados = {
            nome: this.nome,
            descricao: this.descricao,
            categoria: this.categoria,
            unidade_medida: this.unidade_medida,
            preco: this.preco,
            quantidade: this.quantidade,
            fornecedor: this.fornecedor
        };

        return fetch('../sistema-estoque/backend/produtos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
            .then(resposta => resposta.json())
            .then(resultado => {
                alert(resultado.mensagem);
            })
            .catch(erro => {
                console.error('Erro ao cadastrar produto:', erro);
            });
    }

    listarProdutos() {
        fetch('../backend/produtos.php')
            .then(resposta => resposta.json())
            .then(produtos => {
                const corpoTabela = document.getElementById('corpoTabelaProdutos');
                corpoTabela.innerHTML = '';

                produtos.forEach(produto => {
                    const linha = document.createElement('tr');

                    linha.innerHTML = `
                        <td>${produto.id_produto}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.descricao}</td>
                        <td>${produto.categoria}</td>
                        <td>${produto.unidade_medida}</td>
                        <td>${produto.preco}</td>
                        <td>${produto.qtd_estoque}</td>
                        <td>${produto.fornecedor}</td>
                    `;

                    corpoTabela.appendChild(linha);
                    
                });
            })
            .catch(erro => {
                console.error('Erro ao listar produtos:', erro);
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProduto');
    const tabela = document.getElementById('tabelaProdutos');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const novoProduto = new Produto();
            novoProduto.cadastrarProduto().then(() => {
                form.reset();
            });
        });
    }
    if (tabela) {
        const produtoLista = new Produto();
        produtoLista.listarProdutos();
    }
});
