<?php 
require_once(__DIR__ . '/../../inclusions/config.php');

try {
    // Requête pour récupérer les joueurs
    $sql = "SELECT j.id_joueur, j.nom, j.prenom, j.photo,
                e.logo AS element_logo, e.nom AS element_nom,
                p.logo AS poste_logo, p.nom AS poste_nom,
                je.logo AS jeu_logo, je.nom AS jeu_nom,
                eq.logo AS equipe_logo, eq.nom AS equipe_nom
            FROM public.joueurs j
            LEFT JOIN ressources e ON j.id_element = e.id_ressource AND e.type = 'element'
            LEFT JOIN ressources p ON j.id_poste = p.id_ressource AND p.type = 'poste'
            LEFT JOIN ressources je ON j.id_jeu = je.id_ressource AND je.type = 'jeu'
            LEFT JOIN ressources eq ON j.id_equipe = eq.id_ressource AND eq.type = 'equipe'
            ORDER BY j.id_joueur ASC";

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
                    
                <?php foreach ($joueurs as $joueur): ?>
                    <a href="/php/characters/pages/character.php?id=<?= urlencode($joueur['id_joueur']) ?>" class="player-card-link">
                        <div class="player-card">
                            <?php if (!empty($joueur['photo'])): ?>
                                <img src="<?= htmlspecialchars($joueur['photo']) ?>" alt="<?= htmlspecialchars($joueur['nom']) ?>">
                            <?php else: ?>
                                <img src="/images/joueurs/default.png" alt="Aucune photo">
                            <?php endif; ?>

                            <h2><?= htmlspecialchars($joueur['nom'] . ' ' . $joueur['prenom']) ?></h2>

                            <!-- Logo de l'élément -->
                            <?php if (!empty($joueur['element_logo'])): ?>
                                <img class="element-logo" src="<?= htmlspecialchars($joueur['element_logo']) ?>" alt="<?= htmlspecialchars($joueur['element_nom']) ?>">
                            <?php endif; ?>

                            <!-- Logo du poste -->
                            <?php if (!empty($joueur['poste_logo'])): ?>
                                <img class="poste-logo" src="<?= htmlspecialchars($joueur['poste_logo']) ?>" alt="<?= htmlspecialchars($joueur['poste_nom']) ?>">
                            <?php endif; ?>

                            <!-- Logo du jeu -->
                            <?php if (!empty($joueur['jeu_logo'])): ?>
                                <img class="jeu-logo" src="<?= htmlspecialchars($joueur['jeu_logo']) ?>" alt="<?= htmlspecialchars($joueur['jeu_nom']) ?>">
                            <?php endif; ?>

                            <!-- Logo de l'équipe -->
                            <?php if (!empty($joueur['equipe_logo'])): ?>
                                <img class="equipe-logo" src="<?= htmlspecialchars($joueur['equipe_logo']) ?>" alt="<?= htmlspecialchars($joueur['equipe_nom']) ?>">
                            <?php endif; ?>
                        </div>
                    </a>
                <?php endforeach; ?>



            </main>


            <?php require_once(__DIR__ . '/../../inclusions/footer.php');?>


        </div>
    </body>
</html>