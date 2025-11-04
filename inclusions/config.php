<?php
// Config de connexion Supabase / PostgreSQL
$host = 'aws-1-eu-west-3.pooler.supabase.com';
$port = '5432';
$dbname = 'postgres';
$user = 'postgres.ygwefkgcmeqldzplecbo';
$password = '2KwCNpzGp8jCJqGd';

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>