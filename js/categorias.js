class Categoria {
    async cadastrarCategoria() {
        const dados = {
            descricao: this.descricao
        };

        try {
            const resposta = await fetch('/sistema-estoque/backend/categorias.php?acao=cadastrarCategoria', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();
            alert(resultado.mensagem);
        } catch (erro) {
            console.error('Erro ao cadastrar categoria:', erro);
        }
    }

    async preencherSelect(selectId) {
        try {
            const resposta = await fetch('/sistema-estoque/backend/categorias.php?acao=listarCategorias');
            const categorias = await resposta.json();

            const select = document.getElementById(selectId);
            if (!select) {
                console.warn(`Elemento select com id '${selectId}' não encontrado.`);
                return;
            }

            // Limpa o select antes de preencher
            select.innerHTML = '<option value="">Selecione uma categoria</option>';

            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id_categoria;
                option.textContent = categoria.descricao;
                select.appendChild(option);
            });
        } catch (erro) {
            console.error('Erro ao preencher select com fornecedores:', erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formCadastroCategoria = document.getElementById('formCadastrarCategoria');
    const formCadastroProduto = document.getElementById('formCadastrarProduto');
    const formEdicaoProduto = document.getElementById('formEditarProduto');

    const categoria = new Categoria();

    if(formCadastroCategoria) {
        formCadastroCategoria.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            categoria.descricao = document.getElementById('descricaoCadastroCategoria').value;
            
            await categoria.cadastrarCategoria();
            formCadastroCategoria.reset();
        });
    }
    if(formCadastroProduto) {
        categoria.preencherSelect('categoriaCadastroProduto');
    }

    if (formEdicaoProduto) {
        categoria.preencherSelect('categoriaEdicaoProduto');
    }
});
