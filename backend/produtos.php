<?php
require 'conexao_db.php';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

class Produtos {
    private $conexao;

    public function __construct($pdo) {
        $this->conexao = $pdo;
    }

    public function cadastrarProduto() {
        $dados = json_decode(file_get_contents("php://input"), true);

        if (!$dados) {
            echo json_encode(['mensagem' => 'Dados inválidos.']);
            return;
        }

        $sql = "INSERT INTO produtos (nome, descricao, categoria, unidade_medida, preco, fornecedor)
                VALUES (:nome, :descricao, :categoria, :unidade_medida, :preco, :fornecedor)";

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
        $sql = "SELECT id_produto AS id, nome, descricao, categoria, unidade_medida, preco, fornecedor FROM produtos ORDER BY id_produto DESC";
        $stmt = $this->conexao->prepare($sql);
        $stmt->execute();
        $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($produtos);
    }
}

header('Content-Type: application/json');

$produto = new Produtos($pdo);

// Verifica o tipo de requisição
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $produto->cadastrarProduto();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $produto->listarProdutos();
} else {
    echo json_encode(['mensagem' => 'Método não suportado.']);
}
