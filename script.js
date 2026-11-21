
const intro = document.getElementById("intro");
const experience = document.getElementById("experience");
const ending = document.getElementById("ending");

const audio = document.getElementById("audio");
const audioFile = document.getElementById("audioFile");

const startButton = document.getElementById("startButton");
const playButton = document.getElementById("playButton");
const replayButton = document.getElementById("replayButton");
const soundButton = document.getElementById("soundButton");

const bigText = document.getElementById("bigText");
const description = document.getElementById("description");
const lyricText = document.getElementById("lyricText");
const chapter = document.getElementById("chapter");
const chapterCounter = document.getElementById("chapterCounter");
const sceneNumber = document.getElementById("sceneNumber");
const sceneTime = document.getElementById("sceneTime");
const smallText = document.getElementById("smallText");
const progressFill = document.getElementById("progressFill");
const musicStatus = document.getElementById("musicStatus");

const scene = document.getElementById("scene");
const character = document.getElementById("character");

// Cada escena representa una etapa de la historia.
// Los porcentajes permiten adaptar la narración
// a la duración del archivo de música.

const scenes = [
  {
    start: 0,
    end: 0.15,
    chapter: "CHAPTER 01 — THE OBSERVER",
    title: "OBSERVE.",
    description: "I notice more than I say. I think more than I show.",
    lyric: "I've always preferred watching the world before becoming part of it.",
    footer: "I WATCH. I THINK. I REMEMBER.",
    background: "linear-gradient(130deg, #111a27, #08090d 75%)",
    light: "#526e91"
  },
  {
    start: 0.15,
    end: 0.36,
    chapter: "CHAPTER 02 — THE MASK",
    title: "APPEARANCES.",
    description: "Sometimes the person everyone sees isn't the person they understand.",
    lyric: "There are things I keep behind a calm expression.",
    footer: "NOT EVERYTHING IS WHAT IT SEEMS.",
    background: "linear-gradient(130deg, #19151c, #08090d 75%)",
    light: "#81566a"
  },
  {
    start: 0.36,
    end: 0.56,
    chapter: "CHAPTER 03 — CONNECTIONS",
    title: "PEOPLE.",
    description: "Some people become part of your story without knowing how important they are.",
    lyric: "Some memories stay, even when people don't.",
    footer: "SOME THINGS ARE HARD TO LET GO.",
    background: "linear-gradient(130deg, #20171a, #08090d 75%)",
    light: "#a34d54"
  },
  {
    start: 0.56,
    end: 0.79,
    chapter: "CHAPTER 04 — CONSEQUENCES",
    title: "REGRETS.",
    description: "Not every decision was right. Not every word should have been said.",
    lyric: "I cannot rewrite everything. But I can decide what happens next.",
    footer: "LEARNING IS NOT THE SAME AS FORGETTING.",
    background: "linear-gradient(130deg, #1c1c21, #08090d 75%)",
    light: "#777982"
  },
  {
    start: 0.79,
    end: 0.94,
    chapter: "CHAPTER 05 — THE PRESENT",
    title: "BECOMING.",
    description: "I'm still figuring things out. And perhaps that's enough for now.",
    lyric: "I am still writing the parts of my story I haven't understood yet.",
    footer: "NOT FINISHED. NOT THE SAME.",
    background: "linear-gradient(130deg, #171a25, #08090d 75%)",
    light: "#506c91"
  }
];

let currentScene = -1;
let started = false;

// Introducción

startButton.addEventListener("click", () => {
  intro.classList.add("hidden");
  experience.classList.remove("hidden");

  started = true;

  if (audio.src) {
    audio.play().catch(() => {
      musicStatus.textContent = "PRESS PLAY TO START";
    });
  } else {
    musicStatus.textContent = "ADD YOUR SONG TO BEGIN";
  }
});

// Añadir canción desde el dispositivo

audioFile.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  audio.src = URL.createObjectURL(file);
  audio.load();

  musicStatus.textContent = "SONG LOADED";
  playButton.textContent = "▶ PLAY";

  if (started) {
    audio.play().catch(() => {});
  }
});

// Reproducción

playButton.addEventListener("click", () => {
  if (!audio.src) {
    musicStatus.textContent = "ADD YOUR SONG FIRST";
    audioFile.click();
    return;
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ PAUSE";
  musicStatus.textContent = "PLAYING";
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶ PLAY";

  if (!audio.ended) {
    musicStatus.textContent = "PAUSED";
  }
});

// Silenciar

soundButton.addEventListener("click", () => {
  audio.muted = !audio.muted;

  soundButton.textContent = audio.muted
    ? "SOUND OFF"
    : "SOUND ON";
});

// Cambiar escena según el progreso musical

function updateScene() {
  if (!audio.duration || !isFinite(audio.duration)) return;

  const progress = audio.currentTime / audio.duration;

  progressFill.style.width = `${progress * 100}%`;

  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60);

  sceneTime.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const index = scenes.findIndex((item) =>
    progress >= item.start && progress < item.end
  );

  if (index !== -1 && index !== currentScene) {
    currentScene = index;
    changeScene(scenes[index], index);
  }
}

// Animación de transición

function changeScene(data, index) {
  const elements = [
    bigText,
    description,
    lyricText,
    chapter
  ];

  elements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(12px)";
  });

  setTimeout(() => {
    chapter.textContent = data.chapter;
    bigText.textContent = data.title;
    description.textContent = data.description;
    lyricText.textContent = data.lyric;
    smallText.textContent = data.footer;

    chapterCounter.textContent = `0${index + 1} / 05`;
    sceneNumber.textContent = `0${index + 1} / 05`;

    scene.style.background = data.background;

    document.querySelector(".light-one").style.background =
      data.light;

    elements.forEach(element => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });

    character.style.filter =
      index === 2
        ? "drop-shadow(0 0 25px #a34d5450)"
        : "drop-shadow(0 0 20px #ffffff15)";

  }, 350);
}

audio.addEventListener("timeupdate", updateScene);

// Final de la canción

audio.addEventListener("ended", () => {
  experience.classList.add("hidden");
  ending.classList.remove("hidden");

  currentScene = -1;
  progressFill.style.width = "100%";
});

// Volver a empezar

replayButton.addEventListener("click", () => {
  ending.classList.add("hidden");
  intro.classList.remove("hidden");

  audio.pause();
  audio.currentTime = 0;

  currentScene = -1;
  started = false;

  progressFill.style.width = "0%";
  musicStatus.textContent = audio.src
    ? "SONG LOADED"
    : "NO AUDIO LOADED";
});
