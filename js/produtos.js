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
            const resposta = await fetch('/sistema-estoque/backend/produtos.php?acao=cadastrarProduto', {
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
            const resposta = await fetch('/sistema-estoque/backend/produtos.php?acao=listarProdutos');
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
            <td>${parseFloat(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</td>
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

    async preencherSelect(selectId, selecionado) {
        try {
            const select = document.getElementById(selectId);
            if (!select) {
                console.warn(`Elemento select com id '${selectId}' não encontrado.`);
                return;
            }

            select.innerHTML = '<option value="">Selecione uma opção</option>';

            if (selectId === 'categoriaEdicaoProduto') {
                const resposta = await fetch('/sistema-estoque/backend/categorias.php?acao=listarCategorias');
                const categorias = await resposta.json();

                categorias.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria.id_categoria;
                    option.textContent = categoria.descricao;

                    if (categoria.descricao === selecionado) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
            } else if (selectId === 'fornecedorEdicaoProduto') {
                const resposta = await fetch('/sistema-estoque/backend/fornecedores.php?acao=listarFornecedores');
                const fornecedores = await resposta.json();

                fornecedores.forEach(fornecedor => {
                    const option = document.createElement('option');
                    option.value = fornecedor.id_fornecedor;
                    option.textContent = fornecedor.nome_fantasia;

                    if (fornecedor.nome_fantasia === selecionado) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
            } else {
                const resposta = await fetch('/sistema-estoque/backend/produtos.php?acao=listarProdutos');
                const produtos = await resposta.json();

                produtos.forEach(produto => {
                    const option = document.createElement('option');
                    option.value = produto.id_produto;
                    option.textContent = produto.nome;
                    select.appendChild(option);
                });
            }
        } catch (erro) {
            console.error('Erro ao preencher select:', erro);
        }
    }

    async registrarEntrada() {
        const dados = {
            id_produto: this.id_produto,
            quantidade: this.quantidade
        };

        try {
            const resposta = await fetch('/sistema-estoque/backend/produtos.php?acao=registrarEntrada', {
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
            id_produto: this.id_produto,
            quantidade: this.quantidade
        };

        try {
            const resposta = await fetch('/sistema-estoque/backend/produtos.php?acao=registrarSaida', {
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

    async abrirModalEdicao(produto) {
        const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
        if (!modal) return;

        await this.preencherSelect('categoriaEdicaoProduto', produto.categoria);
        await this.preencherSelect('fornecedorEdicaoProduto', produto.fornecedor);

        document.getElementById('idProduto').value = produto.id_produto;
        document.getElementById('nomeEdicaoProduto').value = produto.nome;
        document.getElementById('descricaoEdicaoProduto').value = produto.descricao;
        document.getElementById('unidadeMedidaEdicaoProduto').value = produto.unidade_medida;
        document.getElementById('precoEdicaoProduto').value = produto.preco;

        modal.show();
    }

    excluirProduto(id) {
        if (confirm("Tem certeza que deseja excluir esse produto?")) {
            fetch('/sistema-estoque/backend/produtos.php?acao=excluirProduto', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({id_produto: id })
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
            id_produto: id,
            nome: document.getElementById('nomeEdicaoProduto').value,
            descricao: document.getElementById('descricaoEdicaoProduto').value,
            categoria: document.getElementById('categoriaEdicaoProduto').value,
            unidade_medida: document.getElementById('unidadeMedidaEdicaoProduto').value,
            preco: document.getElementById('precoEdicaoProduto').value,
            fornecedor: document.getElementById('fornecedorEdicaoProduto').value
        };

        fetch('/sistema-estoque/backend/produtos.php?acao=editarProduto', {
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
        produto.preencherSelect('selectProdutoEntrada');
    }
    if (selectProdutoSaida) {
        produto.preencherSelect('selectProdutoSaida');
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
