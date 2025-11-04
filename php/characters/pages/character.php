<?php 
require_once(__DIR__ . '/../../../inclusions/config.php');

// Vérifie si un joueur est passé dans l'URL (ex: ?id=1)
$id = $_GET['id'] ?? null;

if (!$id) {
    die("❌ Aucun joueur sélectionné. Exemple : <a href='?id=1'>?id=1</a>");
}

try {
    // Récupère les infos du joueur correspondant
    $sql = "SELECT j.id_joueur, j.nom, j.prenom, j.poste, j.jeu, j.element, j.equipe, j.photo, j.description,
               s.frappe, s.controle, s.pression, s.physique, s.agilite, s.intelligence, s.technique
            FROM public.joueurs j
            LEFT JOIN public.statistiques s ON j.id_joueur = s.id_joueur
            WHERE j.id_joueur = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id]);
    $joueur = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$joueur) {
        die("❌ Joueur introuvable.");
    }
} catch (PDOException $e) {
    die("❌ Erreur de récupération du joueur : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($joueur['nom'] . ' ' . $joueur['prenom']) ?></title>
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="character.css">
    <link rel="icon" type="image/png" href="/Ressources/sidebar_logo.png">
    <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    <script>
            const playerStats = <?= json_encode([
            'attaque' => $joueur['attaque'] ?? 0,
            'defense' => $joueur['defense'] ?? 0,
            'technique' => $joueur['technique'] ?? 0,
            'vitesse' => $joueur['vitesse'] ?? 0,
            'endurance' => $joueur['endurance'] ?? 0
            ]) ?>;
    </script>
    <script src="charts.js" defer></script>

</head>
<body>
    <div class="site">

        <?php require_once(__DIR__ . '/../../../inclusions/header.php'); ?>

        <main class="main">

            <div class="toptext-container">
                <div class="navigation-path">
                    <nav class="breadcrumb">
                        <a href="/index.php">Home</a> 
                        <span class="current">/</span>
                        <a href="/php/characters/list.php">Characters</a>
                        <span class="current">/</span>
                        <span class="current"><?= htmlspecialchars($joueur['nom'] . ' ' . $joueur['prenom']) ?></span>
                    </nav>
                    <h1><?= htmlspecialchars($joueur['nom'] . ' ' . $joueur['prenom']) ?></h1>
                </div>
            </div>

            <div class="character-container">
                <img class="character-image" 
                     src="<?= htmlspecialchars($joueur['photo']) ?>" 
                     alt="<?= htmlspecialchars($joueur['prenom'] . ' ' . $joueur['nom']) ?>">

                <div class="bio-stat">
                    <div class="bio">
                        <h2>Description</h2>

                        <div class="info-image">
                            <img class="poste-image" src="/Ressources/logo/<?= htmlspecialchars($joueur['poste']) ?>.png" alt="Poste">
                            <img class="element-image" src="/Ressources/logo/<?= htmlspecialchars($joueur['element']) ?>.png" alt="Élément">
                        </div>

                        <p><?= htmlspecialchars($joueur['description'] ?? "Aucune description disponible.") ?></p>
                    </div>

                    <div class="stat">
                        <h2>Stats</h2>
                        <canvas id="goodCanvas1" width="460" height="460" aria-label="Stats du joueur" role="img"></canvas>
                    </div>
                </div>
            </div>

            <div class="passif">
                <h2>Informations</h2>
                <p><strong>Équipe :</strong> <?= htmlspecialchars($joueur['equipe'] ?? "Inconnue") ?></p>
                <p><strong>Jeu :</strong> <?= htmlspecialchars($joueur['jeu'] ?? "Non précisé") ?></p>
            </div>

        </main>

        <?php require_once(__DIR__ . '/../../../inclusions/footer.php'); ?>

    </div>
</body>
</html>
