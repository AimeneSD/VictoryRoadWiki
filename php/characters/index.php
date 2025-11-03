<?php 
require_once(__DIR__ . '/../config.php');

try {
    // Requête pour récupérer les joueurs
    $sql = "SELECT id_joueur, nom, prenom, poste, jeu, element, equipe, photo 
            FROM public.joueurs 
            ORDER BY id_joueur ASC";
    $stmt = $pdo->query($sql);
    $joueurs = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("❌ Erreur de récupération des joueurs : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Victory Road Wiki</title>
        <link rel="stylesheet" href="/css/characters.css">
        <link rel="stylesheet" href="/css/styles.css">
        <script src="/js/script.js" defer></script>
        <script src="/js/characters.js" defer></script>
    </head>

    <body>
        <div class="site">

            <?php require_once(__DIR__ . '/../../inclusions/header.php');?>

            <main class="main">

                <div class="toptext-container">
                    <div class="navigation-path">
                        <nav class="breadcrumb">
                            <a href="/index.html">Home</a> 
                            <span class="current">/</span>
                            <span class="current">Characters</span>
                        </nav>
                        <h1>Characters</h1>
                    </div>
                </div>
                

                <!-- LISTE DES JOUEURS !-->
                    
                    <div class="players-grid">
                        <?php foreach ($joueurs as $joueur): ?>
                            <a href="/php/characters/pages/character.php?id=<?= urlencode($joueur['id_joueur']) ?>" class="player-card-link">
                                <div class="player-card">
                                    <?php if (!empty($joueur['photo'])): ?>
                                        <img src="<?= htmlspecialchars($joueur['photo']) ?>" alt="<?= htmlspecialchars($joueur['nom']) ?>">
                                    <?php else: ?>
                                        <img src="/images/joueurs/default.png" alt="Aucune photo">
                                    <?php endif; ?>

                                    <h2><?= htmlspecialchars($joueur['nom'] . ' ' . $joueur['prenom']) ?></h2>
                                    <?php if (!empty($joueur['element'])): ?>
                                        <p><strong>Élément :</strong> <?= htmlspecialchars($joueur['element']) ?></p>
                                    <?php endif; ?>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>


            </main>


            <?php require_once(__DIR__ . '/../../inclusions/footer.php');?>

            
<!-- Le style est généré par l'ia parce que je savais pas comment on ajoute du style au php par contre le reste c'est moi !-->
<style>
body {
    background-color: #121212;
    font-family: Arial, sans-serif;
}
.players-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 7 colonnes */
    gap: 20px;
    padding: 30px;
    justify-items: center;
}
.player-card {
    background-color: #1e1e1e;
    border: 2px solid #333;
    border-radius: 15px;
    color: #fff;
    width: 160px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.player-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.5);
}
.player-card img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
    border: 1px solid #555;
}
.player-card h2 {
    font-size: 1.1em;
    margin-bottom: 6px;
}
.player-card p {
    margin: 4px 0;
    font-size: 0.9em;
}
</style>


        </div>
    </body>
</html>