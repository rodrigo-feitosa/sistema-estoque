class Fornecedores {
    async cadastrarFornecedor() {
        const dados = {
            razao_social: this.razao_social,
            nome_fantasia: this.nome_fantasia,
            cnpj: this.cnpj
        };

        try {
            const resposta = await fetch('/sistema-estoque/backend/fornecedores.php?acao=cadastrarFornecedor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();
            alert(resultado.mensagem);
        } catch (erro) {
            console.error('Erro ao cadastrar fornecedor:', erro);
        }
    }

    listarFornecedores(endpoint, selectId) {
        this.endpoint = endpoint;
        this.selectElement = document.getElementById(selectId);
    }

    async carregarFornecedores() {
        try {
            const response = await fetch(this.endpoint);
            const fornecedores = await response.json();
            this.preencherSelect(fornecedores);
        } catch (error) {
            console.error('Erro ao carregar fornecedores:', error);
            this.mostrarErro();
        }
    }

    preencherSelect(fornecedores) {
        if (!this.selectElement) return;

        this.selectElement.innerHTML = '<option value="">Selecione um fornecedor</option>';

        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id_fornecedor;
            option.textContent = fornecedor.nome_fantasia;
            this.selectElement.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formCadastroFornecedor = document.getElementById('formCadastrarFornecedor');
    const formCadastroProduto = document.getElementById('formCadastrarProduto');
    const fornecedor = new Fornecedores();

    if (formCadastroFornecedor) {
        formCadastroFornecedor.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            fornecedor.razao_social = document.getElementById('razaoSocialCadastroFornecedor').value;
            fornecedor.nome_fantasia = document.getElementById('nomeFantasiaCadastroFornecedor').value;
            fornecedor.cnpj = document.getElementById('cnpjCadastroFornecedor').value;

            await fornecedor.cadastrarFornecedor();
            formCadastroFornecedor.reset();
        });
    }
    if(formCadastroProduto) {
        fornecedor.listarFornecedores('/sistema-estoque/backend/fornecedores.php?acao=listarFornecedores', 'fornecedorCadastroProduto');
        fornecedor.carregarFornecedores();
    }
});
