document.getElementById("y").textContent = new Date().getFullYear();

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === "U")
  ) {
    e.preventDefault();
  }
});

const music = document.getElementById("bg-music");
const toggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const flameTrail = document.getElementById("flame-trail");

let playing = false;

function setMusicState(isPlaying) {
  playing = isPlaying;

  if (musicIcon) {
    musicIcon.src = isPlaying ? "assets/music-on.png" : "assets/music-off.png";
    musicIcon.alt = isPlaying ? "Musica accesa" : "Musica spenta";
  }

  if (toggle) {
    toggle.classList.toggle("is-on", isPlaying);
  }
}

async function tryAutoplay() {
  if (!music) return;

  try {
    music.volume = 0.20;
    await music.play();
    setMusicState(true);
  } catch (err) {
    setMusicState(false);
    console.warn("Autoplay bloccato dal browser:", err);
  }
}

if (music && toggle && musicIcon) {
  toggle.addEventListener("click", async function () {
    try {
      if (!playing) {
        music.volume = 0.20;
        await music.play();
        setMusicState(true);
      } else {
        music.pause();
        setMusicState(false);
      }
    } catch (err) {
      console.error("Audio non avviato:", err);
    }
  });
}

function updateHudDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const hudDate = document.getElementById("hud-date");
  const hudTime = document.getElementById("hud-time");

  if (hudDate) hudDate.textContent = `${day}/${month}/${year}`;
  if (hudTime) hudTime.textContent = `${hours}:${minutes}`;
}

function initHudCount() {
  const hudCount = document.getElementById("hud-count");
  if (hudCount) {
    hudCount.textContent = "VISITE OGGI: --";
  }
}

async function updateVisitorCount() {
  const hudCount = document.getElementById("hud-count");
  if (!hudCount) return;

  try {
    const res = await fetch("/count", { cache: "no-store" });
    const data = await res.json();

    if (typeof data.count === "number") {
      hudCount.textContent = `VISITE OGGI: ${data.count}`;
    } else {
      hudCount.textContent = "VISITE OGGI: --";
    }
  } catch (err) {
    console.error("Errore count:", err);
    hudCount.textContent = "VISITE OGGI: --";
  }
}

function createFlameParticle(x, y) {
  if (!flameTrail) return;

  const particle = document.createElement("div");
  particle.classList.add("flame-particle");

  const sizes = ["small", "medium", "large"];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  particle.classList.add(randomSize);

  const offsetX = (Math.random() - 0.5) * 12;
  const offsetY = (Math.random() - 0.5) * 12;

  const driftX = `${(Math.random() - 0.5) * 18}px`;
  const driftY = `${-18 - Math.random() * 24}px`;

  particle.style.left = `${x + offsetX}px`;
  particle.style.top = `${y + offsetY}px`;
  particle.style.setProperty("--drift-x", driftX);
  particle.style.setProperty("--drift-y", driftY);

  flameTrail.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 700);
}

let lastTrailTime = 0;

document.addEventListener("mousemove", function (e) {
  const now = Date.now();

  if (now - lastTrailTime < 20) return;
  lastTrailTime = now;

  createFlameParticle(e.clientX, e.clientY);

  if (Math.random() > 0.45) {
    createFlameParticle(e.clientX - 4, e.clientY + 2);
  }
});

window.addEventListener("load", function () {
  tryAutoplay();
  updateHudDateTime();
  initHudCount();
  updateVisitorCount();
  setInterval(updateHudDateTime, 1000);
});