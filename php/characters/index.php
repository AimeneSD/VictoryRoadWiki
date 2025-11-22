<?php
require_once(__DIR__ . '/../../inclusions/config.php');

try {
    // Récupérer les joueurs avec leur élément (image)
    $sql = "
        SELECT 
            j.id_joueur,
            j.nom,
            j.prenom,
            j.photo,
            r.chemin AS element_logo
        FROM public.joueurs j
        LEFT JOIN public.ressources r ON j.id_element = r.id_ressource
        ORDER BY j.id_joueur ASC
    ";

    $stmt = $pdo->query($sql);
    $joueurs = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die('Erreur : ' . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Victory Road Wiki</title>
        <link rel="stylesheet" href="/VictoryRoadWiki/css/characters.css">
        <link rel="stylesheet" href="/VictoryRoadWiki/css/styles.css">
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
                            <a href="/VictoryRoadWiki/php/characters/pages/character.php?id=<?= urlencode($joueur['id_joueur']) ?>" class="player-card-link">
                                <div class="player-card">
                                    <?php if (!empty($joueur['photo'])): ?>
                                        <img src="<?= htmlspecialchars($joueur['photo']) ?>" alt="<?= htmlspecialchars($joueur['nom']) ?>" class="player-photo">
                                    <?php else: ?>
                                        <div class="player-placeholder">Aucune image</div>
                                    <?php endif; ?>

                                    <div class="player-info">
                                        <h3><?= htmlspecialchars($joueur['nom'] . ' ' . $joueur['prenom']) ?></h3>

                                        <?php if (!empty($joueur['element_logo'])): ?>
                                            <img src="<?= htmlspecialchars($joueur['element_logo']) ?>" alt="Élément" class="element-icon">
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>

<style>
.players-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  padding: 20px;
}

.player-card-link {
  text-decoration: none;
  color: inherit;
}

.player-card {
  background: #222;
  border-radius: 15px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}
.player-card:hover {
  transform: scale(1.05);
}

.player-photo {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.player-info {
  padding: 10px;
  color: #ffffffff;
}

.element-icon {
  width: 25px;
  height: 25px;
  margin-top: 5px;
  border-radius: 50%;
}
</style>

            </main>


            <?php require_once(__DIR__ . '/../../inclusions/footer.php');?>


        </div>
    </body>
</html>