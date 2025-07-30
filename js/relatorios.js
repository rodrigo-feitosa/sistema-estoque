class Relatorio {
    constructor() {
        this.transacoes = [];
        this.paginaAtual = 1;
        this.transacoesPorPagina = 10;
    }

    async contarProdutos() {
        try {
            const resposta = await fetch('/sistema-estoque/backend/relatorios.php?acao=produtos');
            const contagemProdutos = await resposta.json();

            const cardTotalProdutos = document.getElementById('cardTotalProdutos');
            if (!cardTotalProdutos) return;

            cardTotalProdutos.innerHTML = `${contagemProdutos}`;
        } catch (erro) {
            console.error('Erro ao contar produtos:', erro);
        }
    }

    async contarTransacoes() {
        try {
            const respostaTotalTransacoes = await fetch('/sistema-estoque/backend/relatorios.php?acao=transacoes');
            const contagemTransacoes = await respostaTotalTransacoes.json();

            const cardTotalTransacoes = document.getElementById('cardTotalTransacoes');
            if (!cardTotalTransacoes) return;

            cardTotalTransacoes.innerHTML = `${contagemTransacoes}`;
        } catch (erro) {
            console.error('Erro ao contar transações:', erro);
        }
    }

    async valorEstoque() {
        try {
            const respostaValorEstoque = await fetch('/sistema-estoque/backend/relatorios.php?acao=valorEstoque');
            const contagemValorEstoque = await respostaValorEstoque.json();

            const cardTotalValorEstoque = document.getElementById('cardTotalValorEstoque');
            if (!cardTotalValorEstoque) return;

            cardTotalValorEstoque.innerHTML = `R$ ${contagemValorEstoque}`;
        } catch (erro) {
            console.error('Erro ao contar valor de estoque:', erro);
        }
    }

    async listarTransacoes() {
        try {
            const respostaListaTransacoes = await fetch('/sistema-estoque/backend/relatorios.php?acao=listaTransacoes');
            this.transacoes = await respostaListaTransacoes.json();
            this.paginaAtual = 1;
            this.renderizarTabela();
            this.criarPaginacao();
        } catch (erro) {
            console.error('Erro ao listar transações:', erro);
        }
    }

    renderizarTabela() {
        const corpoTabelaTransacoes = document.getElementById('corpoTabelaTransacoes');
        if (!corpoTabelaTransacoes) return;

        corpoTabelaTransacoes.innerHTML = '';

        const inicio = (this.paginaAtual - 1) * this.transacoesPorPagina;
        const fim = inicio + this.transacoesPorPagina;
        const transacoesPagina = this.transacoes.slice(inicio, fim);

        transacoesPagina.forEach(transacao => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${transacao.nome}</td>
                <td>${transacao.tipo_transacao}</td>
                <td>${transacao.quantidade}</td>
                <td>${transacao.valor}</td>
                <td>${transacao.data_transacao}</td>
            `;
            corpoTabelaTransacoes.appendChild(linha);
        });
    }

    criarPaginacao() {
        const totalPaginas = Math.ceil(this.transacoes.length / this.transacoesPorPagina);
        const paginacaoDiv = document.getElementById('paginacaoTransacoes');
        if (!paginacaoDiv) return;

        paginacaoDiv.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const botao = document.createElement('button');
            botao.className = 'btn btn-outline-primary btn-sm m-1';
            botao.textContent = i;
            botao.onclick = () => {
                this.paginaAtual = i;
                this.renderizarTabela();
            };
            paginacaoDiv.appendChild(botao);
        }
    }

    async listarProdutosMaisVendidos() {
        try {
            const respostaProdutosMaisVendidos = await fetch('/sistema-estoque/backend/relatorios.php?acao=produtosMaisVendidos');
            const produtosMaisVendidos = await respostaProdutosMaisVendidos.json();

            const corpoListaProdutosMaisVendidos = document.getElementById('corpoListaProdutosMaisVendidos');
            if (!corpoListaProdutosMaisVendidos) return;

            corpoListaProdutosMaisVendidos.innerHTML = '';

            produtosMaisVendidos.forEach(produto => {
                const linha = document.createElement('li');
                linha.innerHTML = `${produto.nome_produto}`;
                corpoListaProdutosMaisVendidos.appendChild(linha);
            });
        } catch (erro) {
            console.error('Erro ao listar produtos mais vendidos:', erro);
        }
    }

    async listarProdutosSemMovimentacao() {
        try {
            const respostaProdutosSemMovimentacao = await fetch('/sistema-estoque/backend/relatorios.php?acao=produtosSemMovimentacao');
            const produtosSemMovimentacao = await respostaProdutosSemMovimentacao.json();

            const corpoListaProdutosSemMovimentacao = document.getElementById('corpoListaProdutosSemMovimentacao');
            if (!corpoListaProdutosSemMovimentacao) return;

            corpoListaProdutosSemMovimentacao.innerHTML = '';

            produtosSemMovimentacao.forEach(produto => {
                const linha = document.createElement('li');
                linha.innerHTML = `${produto.nome_produto}`;
                corpoListaProdutosSemMovimentacao.appendChild(linha);
            });
        } catch (erro) {
            console.error('Erro ao listar produtos sem movimentação:', erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const relatorio = new Relatorio();
    relatorio.contarProdutos();
    relatorio.contarTransacoes();
    relatorio.valorEstoque();
    relatorio.listarTransacoes();
    relatorio.listarProdutosMaisVendidos();
    relatorio.listarProdutosSemMovimentacao();
});
