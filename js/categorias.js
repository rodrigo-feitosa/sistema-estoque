class Categorias {
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

    listarCategorias(endpoint, selectId) {
        this.endpoint = endpoint;
        this.selectElement = document.getElementById(selectId);
    }

    async carregarCategorias() {
        try {
            const response = await fetch(this.endpoint);
            const categorias = await response.json();
            this.preencherSelect(categorias);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            this.mostrarErro();
        }
    }

    preencherSelect(categorias) {
        if (!this.selectElement) return;

        this.selectElement.innerHTML = '<option value="">Selecione uma categoria</option>';

        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id_categoria;
            option.textContent = cat.descricao;
            this.selectElement.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formCadastroCategoria = document.getElementById('formCadastrarCategoria');
    const formCadastroProduto = document.getElementById('formCadastrarProduto');
    const categoria = new Categorias();

    if(formCadastroCategoria) {
        formCadastroCategoria.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            categoria.descricao = document.getElementById('descricaoCadastroCategoria').value;
            
            await categoria.cadastrarCategoria();
            formCadastroCategoria.reset();
        });
    }
    if(formCadastroProduto) {
        categoria.listarCategorias('/sistema-estoque/backend/categorias.php?acao=listarCategorias', 'categoriaCadastroProduto');
        categoria.carregarCategorias();
    }
});
