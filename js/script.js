class Produto {
    async cadastrarProduto() {
        const dados = {
            nome: this.nome,
            descricao: this.descricao,
            categoria: this.categoria,
            unidade_medida: this.unidade_medida,
            preco: this.preco,
            quantidade: this.quantidade,
            fornecedor: this.fornecedor
        };

        try {
            const resposta = await fetch('/sistema-estoque/backend/produtos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();
            alert(resultado.mensagem);
        } catch (erro) {
            console.error('Erro ao cadastrar produto:', erro);
        }
    }

    async listarProdutos() {
        try {
            const resposta = await fetch('/sistema-estoque/backend/produtos.php');
            const produtos = await resposta.json();

            const corpoTabela = document.getElementById('corpoTabelaProdutos');
            if (!corpoTabela) return;

            corpoTabela.innerHTML = '';

            produtos.forEach(produto => {
                const linha = this.criarLinhaProduto(produto);
                corpoTabela.appendChild(linha);
            });

        } catch (erro) {
            console.error('Erro ao listar produtos:', erro);
        }
    }

    criarLinhaProduto(produto) {
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
                <button class="btn btn-primary btn-editar-produto" data-id="${produto.id_produto}">Editar</button>
            </td>
        `;

        linha.querySelector('.btn-excluir-produto').addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            const produto = new Produto();
            produto.excluirProduto(id);
        });

        linha.querySelector('.btn-editar-produto').addEventListener('click', () => {
            this.abrirModalEdicao(produto);
        });

        return linha;
    }

    abrirModalEdicao(produto) {
        document.getElementById('id_produto').value = produto.id_produto;
        document.getElementById('nome_produto').value = produto.nome;
        document.getElementById('descricao_produto').value = produto.descricao;
        document.getElementById('categoria_produto').value = produto.categoria;
        document.getElementById('unidade_medida').value = produto.unidade_medida;
        document.getElementById('preco_produto').value = produto.preco;
        document.getElementById('fornecedor').value = produto.fornecedor;

        const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
        modal.show();
    }

    excluirProduto(id) {
        if (confirm("Tem certeza que deseja excluir esse produto?")) {
            fetch('../backend/produtos.php', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ action: 'excluir', id_produto: id })
            })
            .then(resposta => resposta.json())
            .then(resultado => {
                alert(resultado.mensagem);
                this.listarProdutos();
            })
            .catch(erro => {
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProduto');
    const btnEditar = document.getElementById('btnSalvarEdicao');
    const produto = new Produto();
    const corpoTabelaProdutos = document.getElementById('corpoTabelaProdutos');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const novoProduto = new Produto();
            novoProduto.nome = document.getElementById('nome_produto')?.value;
            novoProduto.descricao = document.getElementById('descricao_produto')?.value;
            novoProduto.categoria = document.getElementById('categoria_produto')?.value;
            novoProduto.unidade_medida = document.getElementById('unidade_medida')?.value;
            novoProduto.preco = document.getElementById('preco_produto')?.value;
            novoProduto.quantidade = document.getElementById('quantidade_produto')?.value;
            novoProduto.fornecedor = document.getElementById('fornecedor')?.value;

            await novoProduto.cadastrarProduto();
            form.reset();
        });
    }

    if (corpoTabelaProdutos) {
        produto.listarProdutos();
    }

    if (btnEditar) {
        btnEditar.addEventListener('click', async () => {
            const id = document.getElementById('id_produto').value;
            const produtoEdicao = new Produto();
            await produtoEdicao.editarProduto(id);
        });
    }
});
