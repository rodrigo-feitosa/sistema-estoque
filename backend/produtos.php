<?php
require 'conexao_db.php';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

class Produtos {
    private $conexao;

    public function __construct($pdo) {
        $this->conexao = $pdo;
    }

    public function cadastrarProduto($dados) {
        if (!$dados) {
            echo json_encode(['mensagem' => 'Dados inválidos.']);
            return;
        }

        $sql = "INSERT INTO produtos (nome, descricao, categoria, unidade_medida, preco, qtd_estoque, fornecedor)
                VALUES (:nome, :descricao, :categoria, :unidade_medida, :preco, 0, :fornecedor)";

        $stmt = $this->conexao->prepare($sql);

        $stmt->bindParam(':nome', $dados['nome']);
        $stmt->bindParam(':descricao', $dados['descricao']);
        $stmt->bindParam(':categoria', $dados['categoria']);
        $stmt->bindParam(':unidade_medida', $dados['unidade_medida']);
        $stmt->bindParam(':preco', $dados['preco']);
        $stmt->bindParam(':fornecedor', $dados['fornecedor']);

        $stmt->execute();

        echo json_encode(['mensagem' => 'Produto cadastrado com sucesso!']);
    }


    public function listarProdutos() {
        $sql = "SELECT id_produto, nome, descricao, categoria, unidade_medida, preco, qtd_estoque, fornecedor FROM produtos ORDER BY id_produto DESC";
        $stmt = $this->conexao->prepare($sql);
        $stmt->execute();
        $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($produtos);
    }

    public function excluirProduto() {
        $dados = json_decode(file_get_contents("php://input"), true);
        $id_produto = $dados['id_produto'] ?? null;

        if ($id_produto) {
            $stmt = $this->conexao->prepare("DELETE FROM produtos WHERE id_produto = ?");
            $stmt->execute([$id_produto]);

            echo json_encode(['mensagem' => 'Produto excluído com sucesso.']);
        } else {
            http_response_code(400);
            echo json_encode(['mensagem' => 'ID do produto não fornecido.']);
        }
    }

    public function editarProduto($dados) {
        $sql = "UPDATE produtos SET 
                    nome = :nome,
                    descricao = :descricao,
                    categoria = :categoria,
                    unidade_medida = :unidade_medida,
                    preco = :preco,
                    fornecedor = :fornecedor
                WHERE id_produto = :id_produto";

        $stmt = $this->conexao->prepare($sql);

        $stmt->bindParam(':nome', $dados['nome']);
        $stmt->bindParam(':descricao', $dados['descricao']);
        $stmt->bindParam(':categoria', $dados['categoria']);
        $stmt->bindParam(':unidade_medida', $dados['unidade_medida']);
        $stmt->bindParam(':preco', $dados['preco']);
        $stmt->bindParam(':fornecedor', $dados['fornecedor']);
        $stmt->bindParam(':id_produto', $dados['id_produto']);

        $stmt->execute();

        echo json_encode(['mensagem' => 'Produto atualizado com sucesso!']);
    }

}

header('Content-Type: application/json');

$produto = new Produtos($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents("php://input"), true);
    $acao = $dados['action'] ?? null;

    if ($acao === 'excluir') {
        $produto->excluirProduto();
    } elseif ($acao === 'editar') {
        $produto->editarProduto($dados);
    } else {
        $produto->cadastrarProduto($dados);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $produto->listarProdutos();
} else {
    echo json_encode(['mensagem' => 'Método não suportado.']);
}
