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

let playing = false;

function setMusicState(isPlaying) {
  playing = isPlaying;

  if (musicIcon) {
    musicIcon.src = isPlaying ? "assets/music-on.png" : "assets/music-off.png";
    musicIcon.alt = isPlaying ? "Musica accesa" : "Musica spenta";
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
    hudCount.textContent = "COUNT: --";
  }
}

async function updateVisitorCount() {
  const hudCount = document.getElementById("hud-count");
  if (!hudCount) return;

  try {
    const res = await fetch("/count", { cache: "no-store" });
    const data = await res.json();

    if (typeof data.count === "number") {
      hudCount.textContent = `COUNT: ${data.count}`;
    } else {
      hudCount.textContent = "COUNT: --";
    }
  } catch (err) {
    console.error("Errore count:", err);
    hudCount.textContent = "COUNT: --";
  }
}

window.addEventListener("load", function () {
  tryAutoplay();
  updateHudDateTime();
  initHudCount();
  updateVisitorCount();
  setInterval(updateHudDateTime, 1000);
});