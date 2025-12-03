let count = parseInt(localStorage.getItem("tap-count")) || 0;
let lastResetId = localStorage.getItem("reset-id") || null;
let config = {
  beep: true,
  resetId: null
};

const counterEl = document.getElementById("counter");
counterEl.textContent = count;

async function loadConfig() {
  try {
    const res = await fetch("config.json", { cache: "no-store" });
    config = await res.json();

    if (config.resetId && config.resetId !== lastResetId) {
      count = 0;
      localStorage.setItem("tap-count", "0");
      localStorage.setItem("reset-id", config.resetId);
      counterEl.textContent = 0;
    }

  } catch (err) {
    console.error("Failed to load config:", err);
  }
}

function vibrate() {
  if (navigator.vibrate) navigator.vibrate(1000);
}

function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function tapHandler() {
  count++;
  localStorage.setItem("tap-count", count);
  counterEl.textContent = count;

  vibrate();
  if (config.beep) beep();
}

document.body.addEventListener("click", tapHandler);

loadConfig();
