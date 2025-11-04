document.addEventListener("DOMContentLoaded", () => {
  if (typeof playerStats === "undefined") return;

  const ctx = document.getElementById("goodCanvas1");

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Frappe", "Contrôle", "Pression", "Physique", "Agilité", "intelligence", "technique"],
      datasets: [
        {
          label: "Stats du joueur",
          data: [
            playerStats.frappe,
            playerStats.controle,
            playerStats.pression,
            playerStats.physique,
            playerStats.agilite,
            playerStats.intelligence,
            playerStats.technique
          ],
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointBorderColor: "#fff",
        },
      ],
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
          },
        },
      },
    },
  });
});
