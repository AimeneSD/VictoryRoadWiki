document.addEventListener("DOMContentLoaded", () => {
  if (!window.Chart) {
    console.error("Chart.js n'est pas chargé. Vérifie la balise <script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script> dans le HTML.");
    return;
  }

  const player = {
    fullName: "Mark Evans",
    stats: {
      attack: 20,
      defense: 40,
      technique: 60,
      speed: 30,
      stamina: 70
    }
  };

  const canvas = document.getElementById("goodCanvas1");
  if (!canvas) {
    console.error("Canvas #goodCanvas1 introuvable dans le HTML.");
    return;
  }

  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Attack", "Defense", "Technique", "Speed", "Stamina"],
      datasets: [{
        label: player.fullName,
        data: Object.values(player.stats),
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)"
        
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            display: false   // enlève les dizaines
          },
          pointLabels: {
            color: "white"   // garde les labels Attack/Defense visibles en blanc
          }
        }
      }
    }
  });
});