class Categorias {
    constructor(endpoint, selectId) {
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
    const categoria = new Categorias('/sistema-estoque/backend/categorias.php', 'categoria_produto');
    categoria.carregarCategorias();
});
