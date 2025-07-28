class Produto {
    constructor() {
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
                        <td>
                            <button class="btn btn-danger btn-excluir-produto" data-id="${produto.id_produto}">Excluir</button>
                            <button type="button" class="btn btn-primary btn-editar-produto" data-id="${produto.id_produto}">Editar</button>
                        </td>
                    `;

                    // Evento de exclusão
                    linha.querySelector('.btn-excluir-produto').addEventListener('click', (event) => {
                        const id = event.target.getAttribute('data-id');
                        const p = new Produto();
                        p.excluirProduto(id);
                    });

                    // Evento de edição (abrir modal Bootstrap e preencher os campos)
                    linha.querySelector('.btn-editar-produto').addEventListener('click', (event) => {
                        const id = event.target.getAttribute('data-id');
                        const produtoSelecionado = produtos.find(p => p.id_produto == id);

                        // Preencher os campos do modal
                        document.getElementById('id_produto').value = produtoSelecionado.id_produto;
                        document.getElementById('nome_produto').value = produtoSelecionado.nome;
                        document.getElementById('descricao_produto').value = produtoSelecionado.descricao;
                        document.getElementById('categoria_produto').value = produtoSelecionado.categoria;
                        document.getElementById('unidade_medida').value = produtoSelecionado.unidade_medida;
                        document.getElementById('preco_produto').value = produtoSelecionado.preco;
                        document.getElementById('fornecedor').value = produtoSelecionado.fornecedor;

                        // Exibir modal com Bootstrap
                        const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
                        modal.show();
                    });

                    corpoTabela.appendChild(linha);
                });
            })
            .catch(erro => {
                console.error('Erro ao listar produtos:', erro);
            });
    }

    excluirProduto(id) {
        if(confirm("Tem certeza que deseja excluir esse produto?")) {
            fetch("../backend/produtos.php", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ action: 'excluir', id_produto: id })
            })
            .then(resposta => resposta.json())
            .then(resultado => {
                alert(resultado.mensagem);
                this.listarProdutos()
            })
            .catch(erro =>  {
                console.error('Erro ao excluir produto', erro);
            });
        }
    }

    editarProduto(id) {
        const dados = {
            action: 'editar',
            id_produto: id,
            nome: document.getElementById('nome_produto').value,
            descricao: document.getElementById('descricao_produto').value,
            categoria: document.getElementById('categoria_produto').value,
            unidade_medida: document.getElementById('unidade_medida').value,
            preco: document.getElementById('preco_produto').value,
            fornecedor: document.getElementById('fornecedor').value
        };

        fetch('../backend/produtos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(resposta => resposta.json())
        .then(resultado => {
            alert(resultado.mensagem);
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
            modal.hide();
            this.listarProdutos();
        })
        .catch(erro => {
            console.error('Erro ao editar produto:', erro);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProduto');
    const tabela = document.getElementById('tabelaProdutos');
    const btnEditar = document.getElementById('btnSalvarEdicao');
    
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

    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            const id = document.getElementById('id_produto').value;
            const produto = new Produto();
            produto.editarProduto(id);
        });
    }
});
