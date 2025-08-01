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

    async preencherSelectProdutos(selectId) {
        try {
            const resposta = await fetch('/sistema-estoque/backend/produtos.php');
            const produtos = await resposta.json();

            const select = document.getElementById(selectId);
            if (!select) {
                console.warn(`Elemento select com id '${selectId}' não encontrado.`);
                return;
            }

            // Limpa o select antes de preencher
            select.innerHTML = '<option value="">Selecione um produto</option>';

            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id_produto;
                option.textContent = produto.nome;
                select.appendChild(option);
            });
        } catch (erro) {
            console.error('Erro ao preencher select com produtos:', erro);
        }
    }

    async registrarEntrada() {
        const dados = {
            action: 'entrada',
            id_produto: this.id_produto,
            quantidade: this.quantidade
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
            console.error('Erro ao registrar entrada:', erro);
            alert('Erro ao registrar entrada no estoque.');
        }
    }

    async registrarSaida() {
        const dados = {
            action: 'saida',
            id_produto: this.id_produto,
            quantidade: this.quantidade
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
            console.error('Erro ao registrar saída:', erro);
            alert('Erro ao registrar saída no estoque.');
        }
    }


    abrirModalEdicao(produto) {
        document.getElementById('idProduto').value = produto.id_produto;
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('descricaoProduto').value = produto.descricao;
        document.getElementById('categoriaProduto').value = produto.categoria;
        document.getElementById('unidadeMedida').value = produto.unidade_medida;
        document.getElementById('precoProduto').value = produto.preco;
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
            nome: document.getElementById('nomeProduto').value,
            descricao: document.getElementById('descricaoProduto').value,
            categoria: document.getElementById('categoriaProduto').value,
            unidade_medida: document.getElementById('unidadeMedida').value,
            preco: document.getElementById('precoProduto').value,
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

    async listarFornecedores() {
        try {
            const resposta = await fetch('/sistema-estoque/backend/produtos.php');
            const fornecedores = await resposta.json();

            const selectFornecedor = document.getElementById('fornecedor');
            if (!selectFornecedor) return;

            selectFornecedor.innerHTML = '';

            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id;
                option.textContent = fornecedor.nome;
                selectFornecedor.appendChild(option);
            });

        } catch (erro) {
            console.error('Erro ao listar produtos:', erro);
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const formCadastrarProduto = document.getElementById('formCadastrarProduto');
    const btnEditar = document.getElementById('btnSalvarEdicao');
    const produto = new Produto();
    const corpoTabelaProdutos = document.getElementById('corpoTabelaProdutos');
    const selectProdutoEntrada = document.getElementById('selectProdutoEntrada');
    const selectProdutoSaida = document.getElementById('selectProdutoSaida');
    const formEntrada = document.getElementById('formEntrada');
    const formSaida = document.getElementById('formSaida');

    if (formCadastrarProduto) {
        formCadastrarProduto.addEventListener('submit', async (event) => {
            event.preventDefault();

            const novoProduto = new Produto();
            novoProduto.nome = document.getElementById('nomeCadastroProduto')?.value;
            novoProduto.descricao = document.getElementById('descricaoCadastroProduto')?.value;
            novoProduto.categoria = document.getElementById('categoriaCadastroProduto')?.value;
            novoProduto.unidade_medida = document.getElementById('unidadeMedidaCadastroProduto')?.value;
            novoProduto.preco = document.getElementById('precoCadastroProduto')?.value;
            novoProduto.quantidade = 0;
            novoProduto.fornecedor = document.getElementById('fornecedorCadastroProduto')?.value;

            await novoProduto.cadastrarProduto();
            formCadastrarProduto.reset();
        });
    }

    if (corpoTabelaProdutos) {
        produto.listarProdutos();
    }

    if (btnEditar) {
        btnEditar.addEventListener('click', async () => {
            const id = document.getElementById('idProduto').value;
            const produtoEdicao = new Produto();
            await produtoEdicao.editarProduto(id);
        });
    }

    if (selectProdutoEntrada) {
        produto.preencherSelectProdutos('selectProdutoEntrada');
    }
    if (selectProdutoSaida) {
        produto.preencherSelectProdutos('selectProdutoSaida');
    }

    if (formEntrada) {
        formEntrada.addEventListener('submit', async (event) => {
            event.preventDefault();

            const novaQuantidade = new Produto();
            novaQuantidade.id_produto = document.getElementById('selectProdutoEntrada')?.value;
            novaQuantidade.quantidade = document.getElementById('quantidadeProdutoEntrada')?.value;

            await novaQuantidade.registrarEntrada();
            formEntrada.reset();
        });
    }

    if (formSaida) {
        formSaida.addEventListener('submit', async (event) => {
            event.preventDefault();

            const novaQuantidade = new Produto();
            novaQuantidade.id_produto = document.getElementById('selectProdutoSaida')?.value;
            novaQuantidade.quantidade = document.getElementById('quantidadeProdutoSaida')?.value;

            await novaQuantidade.registrarSaida();
            formSaida.reset();
        });
    }
});
