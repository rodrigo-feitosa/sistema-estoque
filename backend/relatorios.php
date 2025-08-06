<?php
    require 'conexao_db.php';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    class Relatorio {
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

        public function valorEstoque() {
            $sql = "SELECT SUM(p.qtd_estoque * p.preco) AS valor_total_estoque FROM produtos p";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $totalValorEstoque = $stmt->fetchColumn();

            echo json_encode($totalValorEstoque);
        }

        public function listarTransacoes() {
            $sql = "SELECT p.nome AS nome, hf.tipo_transacao AS tipo_transacao, hf.quantidade AS quantidade, SUM(hf.quantidade * p.preco) AS valor, hf.data_transacao AS data_transacao 
                    FROM historico_fluxos hf
                    INNER JOIN produtos p ON p.id_produto = hf.id_produto
                    GROUP BY p.nome, hf.tipo_transacao, hf.quantidade, hf.data_transacao";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $listaTransacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($listaTransacoes);
        }

        public function listarProdutosMaisVendidos() {
            $sql = "SELECT p.nome AS nome_produto, COUNT(hf.id_transacao) AS qtd_saidas FROM historico_fluxos hf 
                    INNER JOIN produtos p ON p.id_produto = hf.id_produto
                    WHERE tipo_transacao = 'saida'
                    GROUP BY p.nome
                    ORDER BY COUNT(hf.id_transacao) DESC
                    LIMIT 5";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $listaProdutosMaisVendidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($listaProdutosMaisVendidos);
        }

        public function listarProdutosSemMovimentacao() {
            $sql = "SELECT p.nome AS nome_produto
                    FROM produtos p
                    LEFT JOIN historico_fluxos hf ON p.id_produto = hf.id_produto
                    WHERE hf.id_transacao IS NULL
                    GROUP BY p.nome
                    ORDER BY p.nome;";
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            $listaProdutosSemMovimentacao = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($listaProdutosSemMovimentacao);
        }
    }

    $relatorio = new Relatorio($pdo);

    $acao = $_GET['acao'] ?? null;

    if ($acao === 'produtos') {
        $relatorio->contarProdutos();
    } elseif ($acao === 'transacoes') {
        $relatorio->contarTransacoes();
    } elseif ($acao === 'valorEstoque') {
        $relatorio->valorEstoque();
    } elseif ($acao === 'listaTransacoes') {
        $relatorio->listarTransacoes();
    } elseif ($acao === 'produtosMaisVendidos') {
        $relatorio->listarProdutosMaisVendidos();
    } elseif ($acao === 'produtosSemMovimentacao') {
        $relatorio->listarProdutosSemMovimentacao();
    } else {
        echo json_encode(['erro' => 'Ação inválida']);
    }
?>