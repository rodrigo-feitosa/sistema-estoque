class Fornecedores {
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
    const fornecedor = new Fornecedores();
    fornecedor.listarFornecedores('/sistema-estoque/backend/fornecedores.php', 'fornecedor');
    fornecedor.carregarFornecedores();
});
