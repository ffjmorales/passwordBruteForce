const passwordInput = document.getElementById("password");
const resultDiv = document.getElementById("result");
const tabButtons = document.querySelectorAll(".tab-button");

let mode = "cpu";

const guessesPerSecondMap = {
  cpu: 1_000_000,      // 1 million guesses/sec for CPU
  gpu: 14_852_795      // ~14 million guesses/sec for GPU
};

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mode = btn.dataset.mode;
    updateResult(); // Recalculate when switching mode
  });
});

passwordInput.addEventListener("input", updateResult);

function updateResult() {
  const password = passwordInput.value;
  const timeEstimate = estimateTimeToCrack(password, mode);
  resultDiv.innerHTML = `
    <span class="emoji">${timeEstimate.emoji}</span>
    ${timeEstimate.message}
  `;
  resultDiv.className = `result ${timeEstimate.class}`;
}

function estimateTimeToCrack(password, mode) {
  if (!password) return { message: "", class: "", emoji: "🔍" };

  const charsets = {
    lowercase: /[a-z]/.test(password) ? 26 : 0,
    uppercase: /[A-Z]/.test(password) ? 26 : 0,
    digits: /[0-9]/.test(password) ? 10 : 0,
    symbols: /[^a-zA-Z0-9]/.test(password) ? 32 : 0,
  };

  const charsetSize =
    charsets.lowercase +
    charsets.uppercase +
    charsets.digits +
    charsets.symbols;

  const combinations = Math.pow(charsetSize, password.length);
  const guessesPerSecond = guessesPerSecondMap[mode];
  const seconds = combinations / guessesPerSecond;

  let message = "";
  let cssClass = "";
  let emoji = "🔓";

  if (seconds < 1) {
    message = "It can be cracked in less than 1 second!";
    cssClass = "fast";
    emoji = "⚡";
  } else if (seconds < 60) {
    message = `It can be cracked in ${seconds.toFixed(1)} seconds.`;
    cssClass = "fast";
    emoji = "⚡";
  } else if (seconds < 3600) {
    message = `It can be cracked in ${Math.floor(seconds / 60)} minutes.`;
    cssClass = "medium";
    emoji = "⏱️";
  } else if (seconds < 86400) {
    message = `It can be cracked in ${Math.floor(seconds / 3600)} hours.`;
    cssClass = "medium";
    emoji = "🕓";
  } else if (seconds < 31536000) {
    message = `It can be cracked in ${Math.floor(seconds / 86400)} days.`;
    cssClass = "slow";
    emoji = "📅";
  } else {
    const years = Math.floor(seconds / 31536000);
    message = `Estimated: ${years} years to crack.`;
    cssClass = "slow";
    emoji = "🔐";
  }

  return { message, class: cssClass, emoji };
}
