class Relatorio {
    async contarProdutos() {
        try {
            const resposta = await fetch('/sistema-estoque/backend/relatorios.php?acao=produtos');
            const contagemProdutos = await resposta.json();

            const cardTotalProdutos = document.getElementById('cardTotalProdutos');
            if (!cardTotalProdutos) return;

            cardTotalProdutos.innerHTML = '';

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

            cardTotalTransacoes.innerHTML = '';

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

            cardTotalValorEstoque.innerHTML = '';

            cardTotalValorEstoque.innerHTML = `R$ ${contagemValorEstoque}`;
        } catch (erro) {
            console.error('Erro ao contar valor de estoque:', erro);
        }
    }

    async listarTransacoes() {
        try {
            const respostaListaTransacoes = await fetch('/sistema-estoque/backend/relatorios.php?acao=listaTransacoes');
            const listaTransacoes = await respostaListaTransacoes.json();

            const corpoTabelaTransacoes = document.getElementById('corpoTabelaTransacoes');
            if (!corpoTabelaTransacoes) return;

            corpoTabelaTransacoes.innerHTML = '';

            listaTransacoes.forEach(transacao => {
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
        } catch (erro) {
            console.error('Erro ao listar transações:', erro);
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
}

document.addEventListener('DOMContentLoaded', () => {
    const relatorioTotalProdutos = new Relatorio();
    relatorioTotalProdutos.contarProdutos();

    const relatorioTotalTransacoes = new Relatorio();
    relatorioTotalTransacoes.contarTransacoes();

    const relatorioTotalValorEstoque = new Relatorio();
    relatorioTotalValorEstoque.valorEstoque();

    const relatorioListaTransacoes = new Relatorio();
    relatorioListaTransacoes.listarTransacoes();

    const relatorioProdutosMaisVendidos = new Relatorio();
    relatorioProdutosMaisVendidos.listarProdutosMaisVendidos();
});