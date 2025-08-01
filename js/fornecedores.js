class Fornecedores {
    constructor() {
        window.callback_api = this.callback_api.bind(this);
    }

    limpaFormularioEndereco() {
        document.getElementById('ruaCadastroFornecedor').value = '';
        document.getElementById('bairroCadastroFornecedor').value = '';
        document.getElementById('cidadeCadastroFornecedor').value = '';
        document.getElementById('estadoCadastroFornecedor').value = '';
    }

    callback_api(conteudo) {
        if (!("erro" in conteudo)) {
            document.getElementById('ruaCadastroFornecedor').value = conteudo.logradouro || '';
            document.getElementById('bairroCadastroFornecedor').value = conteudo.bairro || '';
            document.getElementById('cidadeCadastroFornecedor').value = conteudo.localidade || '';
            document.getElementById('estadoCadastroFornecedor').value = conteudo.uf || '';
        } else {
            alert("CEP não encontrado.");
            this.limpaFormularioEndereco();
        }
    }

    pesquisacep(valor) {
        let cep = valor.replace(/\D/g, '');

        if (cep !== "") {
            let validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {
                document.getElementById('ruaCadastroFornecedor').value = "...";
                document.getElementById('bairroCadastroFornecedor').value = "...";
                document.getElementById('cidadeCadastroFornecedor').value = "...";
                document.getElementById('estadoCadastroFornecedor').value = "...";

                let script = document.createElement('script');
                script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=callback_api';
                document.body.appendChild(script);
            } else {
                alert("Formato de CEP inválido.");
                this.limpaFormularioEndereco();
            }
        } else {
            this.limpaFormularioEndereco();
        }
    }

    async cadastrarFornecedor() {
        const dados = {
            razao_social: this.razao_social,
            nome_fantasia: this.nome_fantasia,
            cnpj: this.cnpj,
            cep: this.cep,
            rua: this.rua,
            numero: this.numero,
            bairro: this.bairro,
            cidade: this.cidade,
            estado: this.estado,
            telefone: this.telefone,
            email: this.email
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

    // Evento de pesquisa de CEP
    const cepInput = document.getElementById('cepCadastroFornecedor');
    if (cepInput) {
        cepInput.addEventListener('blur', () => {
            fornecedor.pesquisacep(cepInput.value);
        });
    }

    if (formCadastroFornecedor) {
        formCadastroFornecedor.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Coleta todos os campos
            fornecedor.razao_social = document.getElementById('razaoSocialCadastroFornecedor').value;
            fornecedor.nome_fantasia = document.getElementById('nomeFantasiaCadastroFornecedor').value;
            fornecedor.cnpj = document.getElementById('cnpjCadastroFornecedor').value;
            fornecedor.cep = document.getElementById('cepCadastroFornecedor').value;
            fornecedor.rua = document.getElementById('ruaCadastroFornecedor').value;
            fornecedor.numero = document.getElementById('numeroCadastroFornecedor').value;
            fornecedor.bairro = document.getElementById('bairroCadastroFornecedor').value;
            fornecedor.cidade = document.getElementById('cidadeCadastroFornecedor').value;
            fornecedor.estado = document.getElementById('estadoCadastroFornecedor').value;
            fornecedor.telefone = document.getElementById('telefoneCadastroFornecedor').value;
            fornecedor.email = document.getElementById('emailCadastroFornecedor').value;

            await fornecedor.cadastrarFornecedor();
            formCadastroFornecedor.reset();
        });
    }

    if (formCadastroProduto) {
        fornecedor.listarFornecedores('/sistema-estoque/backend/fornecedores.php?acao=listarFornecedores', 'fornecedorCadastroProduto');
        fornecedor.carregarFornecedores();
    }
});
