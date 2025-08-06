class Fornecedor {
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

    async listarFornecedores() {
        try {
            const resposta = await fetch('/sistema-estoque/backend/fornecedores.php?acao=listarFornecedores');
            const fornecedores = await resposta.json();

            const corpoTabela = document.getElementById('corpoTabelaFornecedores');
            if (!corpoTabela) return;

            corpoTabela.innerHTML = '';

            fornecedores.forEach(fornecedor => {
                const linha = this.criarLinhaFornecedor(fornecedor);
                corpoTabela.appendChild(linha);
            });

        } catch (erro) {
            console.error('Erro ao listar fornecedores:', erro);
        }
    }

    criarLinhaFornecedor(fornecedor) {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${fornecedor.nome_fantasia}</td>
            <td>${fornecedor.cnpj}</td>
            <td>${fornecedor.cep}</td>
            <td>${fornecedor.rua} - ${fornecedor.bairro} - ${fornecedor.cidade}, ${fornecedor.estado}</td>
            <td>${fornecedor.telefone} - ${fornecedor.email}</td>
            <td>
                <button class="btn btn-primary btn-editar-fornecedor" data-id="${fornecedor.id_fornecedor}">Editar</button>
            </td>
        `;

        linha.querySelector('.btn-editar-fornecedor').addEventListener('click', () => {
            this.abrirModalEdicao(fornecedor);
        });

        return linha;
    }

    abrirModalEdicao(fornecedor) {
        const modal = new bootstrap.Modal(document.getElementById('modalEdicaoFornecedor'));
        if (!modal) return;

        document.getElementById('idFornecedor').value = fornecedor.id_fornecedor;
        document.getElementById('razaoSocialEdicaoFornecedor').value = fornecedor.razao_social;
        document.getElementById('nomeFantasiaEdicaoFornecedor').value = fornecedor.nome_fantasia;
        document.getElementById('cnpjEdicaoFornecedor').value = fornecedor.cnpj;
        document.getElementById('cepEdicaoFornecedor').value = fornecedor.cep;
        document.getElementById('ruaEdicaoFornecedor').value = fornecedor.rua;
        document.getElementById('numeroEdicaoFornecedor').value = fornecedor.numero;
        document.getElementById('bairroEdicaoFornecedor').value = fornecedor.bairro;
        document.getElementById('cidadeEdicaoFornecedor').value = fornecedor.cidade;
        document.getElementById('estadoEdicaoFornecedor').value = fornecedor.estado;
        document.getElementById('telefoneEdicaoFornecedor').value = fornecedor.telefone;
        document.getElementById('emailEdicaoFornecedor').value = fornecedor.email;

        modal.show();
    }

    salvarEdicaoFornecedor(id) {
        const dados = {
            id_fornecedor: id,
            rua: document.getElementById('ruaEdicaoFornecedor').value,
            numero: document.getElementById('numeroEdicaoFornecedor').value,
            bairro: document.getElementById('bairroEdicaoFornecedor').value,
            cidade: document.getElementById('cidadeEdicaoFornecedor').value,
            estado: document.getElementById('estadoEdicaoFornecedor').value,
            cep: document.getElementById('cepEdicaoFornecedor').value,
            telefone: document.getElementById('telefoneEdicaoFornecedor').value,
            email: document.getElementById('emailEdicaoFornecedor').value
        };

        fetch('/sistema-estoque/backend/fornecedores.php?acao=editarFornecedor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(resposta => resposta.json())
        .then(resultado => {
            alert(resultado.mensagem);
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEdicaoFornecedor'));
            modal.hide();
            this.listarFornecedores();
        })
        .catch(erro => {
            console.error('Erro ao editar fornecedor:', erro);
        });
    }

    async preencherSelect(selectId) {
        try {
            const resposta = await fetch('/sistema-estoque/backend/fornecedores.php?acao=listarFornecedores');
            const fornecedores = await resposta.json();

            const select = document.getElementById(selectId);
            if (!select) {
                console.warn(`Elemento select com id '${selectId}' não encontrado.`);
                return;
            }

            // Limpa o select antes de preencher
            select.innerHTML = '<option value="">Selecione um fornecedor</option>';

            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id_fornecedor;
                option.textContent = fornecedor.nome_fantasia;
                select.appendChild(option);
            });
        } catch (erro) {
            console.error('Erro ao preencher select com fornecedores:', erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formCadastroFornecedor = document.getElementById('formCadastrarFornecedor');
    const formCadastroProduto = document.getElementById('formCadastrarProduto');
    const formEdicaoProduto = document.getElementById('formEditarProduto');
    const corpoTabelaFornecedores = document.getElementById('corpoTabelaFornecedores');
    const formEdicao = document.getElementById('formEdicaoFornecedor');
    const fornecedor = new Fornecedor();

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
        fornecedor.listarFornecedores();
        fornecedor.preencherSelect('fornecedorCadastroProduto');
    }

    if (formEdicaoProduto) {
        fornecedor.listarFornecedores();
        fornecedor.preencherSelect('fornecedorEdicaoProduto');
    }

    if (corpoTabelaFornecedores) {
        fornecedor.listarFornecedores();
    }

    if (formEdicao) {
        const btnSalvarEdicao = document.getElementById('btnSalvarEdicaoFornecedor');
        btnSalvarEdicao.addEventListener('click', async () => {
            const id = document.getElementById('idFornecedor').value;
            const fornecedorEdicao = new Fornecedor();
            await fornecedorEdicao.salvarEdicaoFornecedor(id);
        });
    }
});
