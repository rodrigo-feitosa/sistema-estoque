<?php
    require 'conexao_db.php';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    class Relatorios {
        private $conexao;

        public function __construct($conexao) {
            $this->conexao = $conexao;
        }

        public function contarProdutos() {
            $sql = "SELECT COUNT(id_produto) FROM produtos";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $total = $stmt->fetchColumn();

            echo json_encode($total);
        }
    }

    $contagemProdutos = new Relatorios($pdo);
    $contagemProdutos->contarProdutos();
?>