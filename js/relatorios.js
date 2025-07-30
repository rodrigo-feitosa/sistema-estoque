class Relatorio {
    async contarProdutos() {
        try {
            const resposta = await fetch('/sistema-estoque/backend/relatorios.php?acao=produtos');
            const contagemProdutos = await resposta.json();

            const cardTotalProdutos = document.getElementById('cardTotalProdutos');
            if (!cardTotalProdutos) return;

            cardTotalProdutos.innerHTML = '';

            cardTotalProdutos.innerHTML = `Total de produtos: ${contagemProdutos}`;

        } catch (erro) {
            console.error('Erro ao contar produtos:', erro);
        }
    }

    async contarTransacoes() {
        try {
            const respostaTotalTransacoes = await fetch('/sistema-estoque/backend/relatorios.php?acao=transacoes');
            const contagemTransacoes = await respostaTotalTransacoes.json();

            const respostaTotalTransacoesEntrada = await fetch('/sistema-estoque/backend/relatorios.php?acao=transacoesEntrada');
            const contagemTransacoesEntrada = await respostaTotalTransacoesEntrada.json();

            const respostaTotalTransacoesSaida = await fetch('/sistema-estoque/backend/relatorios.php?acao=transacoesSaida');
            const contagemTransacoesSaida = await respostaTotalTransacoesSaida.json();

            const cardTotalTransacoes = document.getElementById('cardTotalTransacoes');
            if (!cardTotalTransacoes) return;

            const cardTotalTransacoesEntrada = document.getElementById('cardTotalTransacoesEntrada');
            if (!cardTotalTransacoesEntrada) return;

            const cardTotalTransacoesSaida = document.getElementById('cardTotalTransacoesSaida');
            if (!cardTotalTransacoesSaida) return;

            cardTotalTransacoes.innerHTML = '';

            cardTotalTransacoes.innerHTML = `Total de transações: ${contagemTransacoes}`;
            cardTotalTransacoesEntrada.innerHTML = `Total de transações de entrada: ${contagemTransacoesEntrada}`;
            cardTotalTransacoesSaida.innerHTML = `Total de transações de saída: ${contagemTransacoesSaida}`;

        } catch (erro) {
            console.error('Erro ao contar transações:', erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const relatorioTotalProdutos = new Relatorio();
    relatorioTotalProdutos.contarProdutos();

    const relatorioTotalTransacoes = new Relatorio();
    relatorioTotalTransacoes.contarTransacoes();
});