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

window.addEventListener("load", tryAutoplay);