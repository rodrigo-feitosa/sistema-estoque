class Produto {
    async contarProdutos() {
        try {
            const resposta = await fetch('/sistema-estoque/backend/relatorios.php');
            const contagemProdutos = await resposta.json();

            const cardTotalProdutos = document.getElementById('cardTotalProdutos');
            if (!cardTotalProdutos) return;

            cardTotalProdutos.innerHTML = '';

            cardTotalProdutos.innerHTML = `Total de produtos: ${contagemProdutos}`;

        } catch (erro) {
            console.error('Erro ao contar produtos:', erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const corpoTabelaProdutos = document.getElementById('corpoTabelaProdutos');

    const relatorioTotalProdutos = new Produto();
    relatorioTotalProdutos.contarProdutos();
});