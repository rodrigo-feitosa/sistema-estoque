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
        $sql = "SELECT p.id_produto, p.nome, p.descricao, c.descricao AS categoria, p.unidade_medida, p.preco, p.qtd_estoque, f.nome_fantasia AS fornecedor
                FROM produtos p
                INNER JOIN categorias c ON c.id_categoria = p.categoria
                INNER JOIN fornecedores f ON f.id_fornecedor = p.fornecedor
                ORDER BY id_produto DESC";
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

    public function registrarEntrada ($dados) {
        if (!$dados) {
            echo json_encode(['mensagem' => 'Dados inválidos.']);
            return;
        }

        $sql = "UPDATE produtos SET qtd_estoque = qtd_estoque + :valor WHERE id_produto = :id_produto";

        $stmt = $this->conexao->prepare($sql);
        $stmt->bindParam(':id_produto', $dados['id_produto']);
        $stmt->bindParam(':valor', $dados['quantidade']);
        $stmt->execute();

        $this->registrarFluxoEntrada($dados['id_produto'], $dados['quantidade']);

        echo json_encode(['mensagem' => 'Entrada realizada com sucesso!']);
    }

    public function registrarFluxoEntrada($id_produto, $quantidade) {
        $sql = "INSERT INTO historico_fluxos (id_produto, tipo_transacao, quantidade, data_transacao) 
                VALUES (:id_produto, 'entrada', :quantidade, NOW())";

        $stmt = $this->conexao->prepare($sql);
        $stmt->bindParam(':id_produto', $id_produto);
        $stmt->bindParam(':quantidade', $quantidade);
        $stmt->execute();
    }

    public function registrarSaida ($dados) {
        if (!$dados) {
            echo json_encode(['mensagem' => 'Dados inválidos.']);
            return;
        }

        $sql = "UPDATE produtos SET qtd_estoque = qtd_estoque - :valor WHERE id_produto = :id_produto";

        $stmt = $this->conexao->prepare($sql);
        $stmt->bindParam(':id_produto', $dados['id_produto'], PDO::PARAM_INT);
        $stmt->bindParam(':valor', $dados['quantidade'], PDO::PARAM_INT);
        $stmt->execute();

        $this->registrarFluxoSaida($dados['id_produto'], $dados['quantidade']);

        echo json_encode(['mensagem' => 'Saida realizada com sucesso!']);
    }

    public function registrarFluxoSaida($id_produto, $quantidade) {
        $sql = "INSERT INTO historico_fluxos (id_produto, tipo_transacao, quantidade, data_transacao) 
                VALUES (:id_produto, 'saida', :quantidade, NOW())";

        $stmt = $this->conexao->prepare($sql);
        $stmt->bindParam(':id_produto', $id_produto);
        $stmt->bindParam(':quantidade', $quantidade);
        $stmt->execute();
    }
}

header('Content-Type: application/json');

$produto = new Produtos($pdo);

    $dados = json_decode(file_get_contents("php://input"), true);
    $acao = $_GET['acao'] ?? null;

    if ($acao === 'excluirProduto') {
        $produto->excluirProduto();
    } elseif ($acao === 'editarProduto') {
        $produto->editarProduto($dados);
    } elseif ($acao === 'registrarEntrada') {
        $produto->registrarEntrada($dados);
    } elseif ($acao === 'registrarSaida'){
        $produto->registrarSaida($dados);   
    }elseif ($acao === 'cadastrarProduto') {
        $produto->cadastrarProduto($dados);
    } elseif ($acao === 'listarProdutos') {
        $produto->listarProdutos();
    }
?>