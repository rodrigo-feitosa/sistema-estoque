<?php
require 'conexao_db.php';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

header('Content-Type: application/json');

class Categorias {
    private $conexao;

    public function __construct($pdo) {
        $this->conexao = $pdo;
    }

    public function cadastrarCategoria($dados) {
        if (!$dados) {
            echo json_encode(['mensagem' => 'Dados inválidos.']);
            return;
        }

        $sql = "INSERT INTO categorias (descricao)
                VALUES (:descricao)";

        $stmt = $this->conexao->prepare($sql);

        $stmt->bindParam(':descricao', $dados['descricao']);
        $stmt->execute();

        echo json_encode(['mensagem' => 'Categoria cadastrada com sucesso!']);
    }

    public function listarCategorias() {
        try {
            $stmt = $this->conexao->query("SELECT id_categoria, descricao FROM categorias ORDER BY descricao");
            $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($categorias);
        } catch (PDOException $e) {
            echo json_encode(['erro' => 'Erro ao buscar categorias: ' . $e->getMessage()]);
        }
    }
}

    $acao = $_GET['acao'] ?? null;

    if ($acao === 'listarCategorias') {
        $categoria = new Categorias($pdo);
        $categoria->listarCategorias();
    } elseif ($acao === 'cadastrarCategoria') {
        $dados = json_decode(file_get_contents('php://input'), true);
        $novaCategoria = new Categorias($pdo);
        $novaCategoria->cadastrarCategoria($dados);
     } else {
        echo json_encode(['erro' => 'Ação inválida']);
    }
?>