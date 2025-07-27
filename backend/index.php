<?php
    require 'conexao_db.php';

    $conexao = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    $dados = json_decode(file_get_contents("php://input"), true);

    $sql = "INSERT INTO produtos (nome, descricao, categoria, unidade_medida, preco, fornecedor)
        VALUES (:nome, :descricao, :categoria, :unidade_medida, :preco, :fornecedor)";

    $stmt = $conexao->prepare($sql);

    $stmt->bindParam(':nome', $dados['nome']);
    $stmt->bindParam(':descricao', $dados['descricao']);
    $stmt->bindParam(':categoria', $dados['categoria']);
    $stmt->bindParam(':unidade_medida', $dados['unidade_medida']);
    $stmt->bindParam(':preco', $dados['preco']);
    $stmt->bindParam(':fornecedor', $dados['fornecedor']);

    $stmt->execute();

    echo json_encode(['mensagem' => 'Produto cadastrado com sucesso!']);
?>

    