  document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".cardBody");

    // Define a palette of warm, formal colors
    const colors = [
      "#b19cd9", /* Soft lavender */
      "#ffcccb", /* Light pink */
      "#ffc107", /* Warm amber */
      "#90caf9", /* Soft blue */
      "#ffb74d", /* Light orange */
      "#81c784", /* Pastel green */
    ];

    // Assign a random color to each card
    cards.forEach((card) => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      card.style.backgroundColor = randomColor;
    });
  });
