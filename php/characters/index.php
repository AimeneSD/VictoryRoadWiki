<?php
require_once '../config.php';

// Récupère tous les personnages depuis la table
$sql = "SELECT * FROM characters ORDER BY last_name ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$characters = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Characters - Victory Road Wiki</title>
    <link rel="stylesheet" href="/css/characters.css">
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <div class="site">
        <?php include '../header.php'; ?> <!-- si tu veux un header global -->

        <main class="main">
            <div class="toptext-container">
                <nav class="breadcrumb">
                    <a href="/index.php">Home</a> / <span>Characters</span>
                </nav>
                <h1>Characters</h1>
            </div>

            <div class="character-grid-container">
                <ul class="char-grid">
                    <?php foreach ($characters as $c): ?>
                        <li class="char" data-role="<?= htmlspecialchars($c['position']) ?>" data-element="<?= htmlspecialchars($c['element']) ?>">
                            <a href="character.php?id=<?= $c['id'] ?>">
                                <img src="<?= htmlspecialchars($c['portrait_url']) ?>" alt="<?= htmlspecialchars($c['first_name'] . ' ' . $c['last_name']) ?>" class="char-img">
                                <span class="name"><?= htmlspecialchars($c['first_name'] . ' ' . $c['last_name']) ?></span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </main>

        <?php include '../footer.php'; ?>
    </div>
</body>
</html>