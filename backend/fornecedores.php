<?php
    require 'conexao_db.php';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    class Fornecedores {
        private $conexao;

        public function __construct($conexao) {
            $this->conexao = $conexao;
        }

        public function listarFornecedores() {
            try {
                $stmt = $this->conexao->query("SELECT nome_fantasia FROM fornecedores");
                $fornecedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($fornecedores);
            } catch (PDOException $e) {
                echo json_encode(['erro' => 'Erro ao buscar categorias: ' . $e->getMessage()]);
            }
        }
    }
$fornecedor = new Fornecedores($pdo);
$fornecedor->listarFornecedores();