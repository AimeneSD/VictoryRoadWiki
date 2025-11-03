<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Victory Road Wiki</title>
        <link rel="stylesheet" href="css/home.css">
        <link rel="stylesheet" href="css/styles.css">
        <script src="js/script.js" defer></script>
        <link rel="icon" type="image/png" href="ressources/sidebar_logo.png">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&family=Vend+Sans:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet">
    </head>
    <body>
        
        
        <?php require_once(__DIR__ . '/inclusions/header.php');?>


        <main class="main">
            <img class="main-logo" src="ressources/main-logo.png" oncontextmenu="return false;" alt="Victory Road Wiki Logo">
            <p class="descriptionsite">Welcome to Victory Road Wiki! <br>Your ultimate encyclopedia for Inazuma Eleven: Victory Road. <br>Here you’ll find everything you need to dive into the game.</p>
            <br>
            <div class="cards-container">
                <!-- Characters -->
                <div class="card card--with-image">
                    <a href="/php/characters/index.php" class="card-link">
                        <div class="card__content">
                            <h2>Characters</h2>
                            <p>Meet all characters, their background and stats.</p>
                            <button class="btn">Go to →</button>
                        </div>
                        <img class="card__image" src="ressources/markevansartwork.png" alt="Characters">
                    </a>
                </div>

                <!-- Guides -->
                <div class="card card--with-image">
                    <a href="/php/guides/index.html" class="card-link">
                        <div class="card__content">
                            <h2>Guides</h2>
                            <p>Informations that the game doesn't tell you.</p>
                            <button class="btn">Go to →</button>
                        </div>
                        <img class="card__image" id="NotebookImage" src="ressources/grandpa_training_notes.png" alt="Guides">
                    </a>
                </div>

                <!-- Techniques -->
                <div class="card card--with-image">
                    <a href="/php/techniques/index.html" class="card-link">
                        <div class="card__content">
                            <h2>Techniques</h2>
                            <p>List of all Hissatsu Techniques & Kenshin.</p>
                            <button class="btn">Go to →</button>
                        </div>
                        <img class="card__image" src="ressources/hector.png" alt="Techniques">
                    </a>
                </div>

                <!-- Items -->
                <div class="card card--with-image">
                    <a href="/php/items/index.html" class="card-link">
                        <div class="card__content">
                            <h2>Items</h2>
                            <p>Complete list of items, equipements & how to obtain them.</p>
                            <button class="btn">Go to →</button>
                        </div>
                        <img class="card__image" id="KidouImage" src="ressources/kidou_goggles.png" alt="Items">
                    </a>
                </div>

                <!-- Home -->
                <div class="card card--with-image">
                    <a href="/php/tiers/index.html" class="card-link">  
                        <div class="card__content">
                            <h2>Tiers</h2>
                            <p>Discover the best characters and strategies.</p>
                            <button class="btn">Go to →</button>
                        </div>
                        <img class="card__image" src="ressources/zanark.png">
                    </a>
                </div>

                <div class="card card--with-image">
                    <a href="/php/teams/index.html" class="card-link">
                        <div class="card__content">
                            <h2>Teams</h2>
                            <p>Explore different team setups and formations.</p>
                            <button class="btn">Go to →</button>
                        </div>
                        <img class="card__image" id="destinImage" src="ressources/destin billows1.png">
                    </a>
                </div>
            </div>
        </main>

        <?php require_once(__DIR__ . '/inclusions/footer.php');?>

    </body>
</html>