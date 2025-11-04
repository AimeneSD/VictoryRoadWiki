<?php 
require_once(__DIR__ . '/../../inclusions/config.php');

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
                        <?php 
                            // Normaliser le poste pour l'utiliser comme classe CSS
                            $posteClass = strtolower(str_replace(' ', '-', $joueur['poste']));
                        ?>
                        <a href="/php/characters/pages/character.php?id=<?= urlencode($joueur['id_joueur']) ?>" class="player-card-link">
                            <div class="player-card <?= htmlspecialchars($posteClass) ?>">
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


        </div>
    </body>
</html>