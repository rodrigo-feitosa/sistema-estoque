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
            $totalProdutos = $stmt->fetchColumn();

            echo json_encode($totalProdutos);
        }

        public function contarTransacoes() {
            $sql = "SELECT COUNT(id_transacao) FROM historico_fluxos";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $totalTransacoes = $stmt->fetchColumn();

            echo json_encode($totalTransacoes);
        }

        public function contarTransacoesEntrada() {
            $sql = "SELECT COUNT(id_transacao) FROM historico_fluxos WHERE tipo_transacao = 'entrada'";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $totalTransacoesEntrada = $stmt->fetchColumn();

            echo json_encode($totalTransacoesEntrada);
        }

        public function contarTransacoesSaida() {
            $sql = "SELECT COUNT(id_transacao) FROM historico_fluxos WHERE tipo_transacao = 'saida'";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $totalTransacoesSaida = $stmt->fetchColumn();

            echo json_encode($totalTransacoesSaida);
        }
    }

    $relatorio = new Relatorios($pdo);

    $acao = $_GET['acao'] ?? null;

    if ($acao === 'produtos') {
        $relatorio->contarProdutos();
    } elseif ($acao === 'transacoes') {
        $relatorio->contarTransacoes();
    } elseif($acao === 'transacoesEntrada') {
        $relatorio->contarTransacoesEntrada();
    } elseif($acao === 'transacoesSaida') {
        $relatorio->contarTransacoesSaida();
    }else {
        echo json_encode(['erro' => 'Ação inválida']);
    }
?>