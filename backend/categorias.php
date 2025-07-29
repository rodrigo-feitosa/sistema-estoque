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

$categoria = new Categorias($pdo);
$categoria->listarCategorias();
