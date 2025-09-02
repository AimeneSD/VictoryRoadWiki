document.addEventListener("DOMContentLoaded", () => {
  if (!window.Chart) {
    console.error("Chart.js n'est pas chargé. Vérifie la balise <script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script> dans le HTML.");
    return;
  }

  const player = {
    fullName: "Mark Evans",
    stats: {
      frappe: 20,
      controle: 45,
      pression: 75,
      physique: 40,
      agilite: 65,
      intelligence: 85,
      technique: 80
    }
  };

  const canvas = document.getElementById("goodCanvas1");
  if (!canvas) {
    console.error("Canvas #goodCanvas1 introuvable dans le HTML.");
    return;
  }

  const ctx = canvas.getContext("2d");

  const labels = [
    "Frappe",
    "Contrôle",
    "Pression",
    "Physique",
    "Agilité",
    "Intelligence",
    "Technique"
  ];

  // IMPORTANT: aligne les valeurs avec les labels, ne pas utiliser Object.values()
  const data = [
    player.stats.frappe,
    player.stats.controle,
    player.stats.pression,
    player.stats.physique,
    player.stats.agilite,
    player.stats.intelligence,
    player.stats.technique
  ];

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [{
        label: player.fullName,
        data: data,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)"
        
      }]
    },
    options: {
      responsive: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            display: false   // enlève les dizaines
          },
          pointLabels: {
            color: "white"   // garde les labels Attack/Defense visibles en blanc
          },
          grid: {
            color: "rgba(255, 255, 255, 0.5)" // lignes du radar en blanc semi-transparent
          }
        }
      }
    }
  });
});