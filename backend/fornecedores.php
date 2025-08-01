<?php
    require 'conexao_db.php';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    class Fornecedores {
        private $conexao;

        public function __construct($conexao) {
            $this->conexao = $conexao;
        }

        public function cadastrarFornecedor($dados) {
            if (!$dados) {
                echo json_encode(['mensagem' => 'Dados inválidos.']);
                return;
            }

            $sql = "INSERT INTO fornecedores (razao_social, nome_fantasia, cnpj, cep, rua, numero, bairro, cidade, estado, telefone, email)
                    VALUES (:razao_social, :nome_fantasia, :cnpj, :cep, :rua, :numero, :bairro, :cidade, :estado, :telefone, :email)";

            $stmt = $this->conexao->prepare($sql);

            $stmt->bindParam(':razao_social', $dados['razao_social']);
            $stmt->bindParam(':nome_fantasia', $dados['nome_fantasia']);
            $stmt->bindParam(':cnpj', $dados['cnpj']);
            $stmt->bindParam(':cep', $dados['cep']);
            $stmt->bindParam(':rua', $dados['rua']);
            $stmt->bindParam(':numero', $dados['numero']);
            $stmt->bindParam(':bairro', $dados['bairro']);
            $stmt->bindParam(':cidade', $dados['cidade']);
            $stmt->bindParam(':estado', $dados['estado']);
            $stmt->bindParam(':telefone', $dados['telefone']);
            $stmt->bindParam(':email', $dados['email']);
            $stmt->execute();

            echo json_encode(['mensagem' => 'Fornecedor cadastrado com sucesso!']);
        }

        public function listarFornecedores() {
            try {
                $stmt = $this->conexao->query("SELECT id_fornecedor, nome_fantasia FROM fornecedores");
                $fornecedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($fornecedores);
            } catch (PDOException $e) {
                echo json_encode(['erro' => 'Erro ao buscar categorias: ' . $e->getMessage()]);
            }
        }
    }

    $acao = $_GET['acao'] ?? null;

    if ($acao === 'listarFornecedores') {
        $fornecedor = new Fornecedores($pdo);
        $fornecedor->listarFornecedores();
    } elseif ($acao === 'cadastrarFornecedor') {
        $dados = json_decode(file_get_contents('php://input'), true);
        $novoFornecedor = new Fornecedores($pdo);
        $novoFornecedor->cadastrarFornecedor($dados);
    } else {
        echo json_encode(['erro' => 'Ação inválida']);
    }
