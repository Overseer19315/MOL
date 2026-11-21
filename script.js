
'use strict';

// ACCESO VISUAL — no es seguridad real.
const ACCESS_USER = 'COS';
const ACCESS_PASSWORD = '201322';

// My Ordinary Life — The Living Tombstone
const VIDEO_ID = '9Zj0JOHJR-s';

const chapters = [
  {
    time: 0,
    kicker: 'CHAPTER 01 / THE OBSERVER',
    title: 'GUARDAR<br><i>Y OBSERVAR.</i>',
    body: 'A veces me resulta más fácil mirar, escuchar y entender en silencio que explicar lo que pasa por mi cabeza. No es que no tenga nada que decir. Es que primero necesito ordenar lo que pienso.',
    foot: 'I NOTICE THE THINGS THAT GO UNSAID.',
    note: 'No todo lo que callo significa que no tenga nada que decir.',
    place: 'PALMA / SOMEWHERE IN MY HEAD',
    progress: 0
  },
  {
    time: 36,
    kicker: 'CHAPTER 02 / THE VERSION THEY SEE',
    title: 'THE FACE<br><i>I SHOW.</i>',
    body: 'Puedo pasar de una idea a otra, construir mundos, proyectos y sistemas enteros. Desde fuera quizá parezca que siempre sé lo que hago. La verdad es menos ordenada: también improviso, dudo y me pierdo.',
    foot: 'A CALM SURFACE DOES NOT MEAN AN EMPTY MIND.',
    note: 'A veces construir algo es mi manera de intentar entenderme.',
    place: 'BETWEEN WHAT I SHOW AND WHAT I KEEP',
    progress: 15
  },
  {
    time: 59,
    kicker: 'CHAPTER 03 / THE THINGS THAT MATTER',
    title: 'LET IT<br><i>MEAN SOMETHING.</i>',
    body: 'Hay personas, conversaciones y pequeños momentos que se quedan mucho más tiempo del que esperaba. No siempre sé qué hacer con lo que siento. A veces solo sé que fue importante.',
    foot: 'NOT EVERYTHING IMPORTANT MAKES A SOUND.',
    note: 'No quiero fingir que algo no me importó solo porque terminó siendo complicado.',
    place: 'A MEMORY I DID NOT PLAN TO KEEP',
    progress: 24
  },
  {
    time: 91,
    kicker: 'CHAPTER 04 / BLANCA',
    title: 'BLANCA.<br><i>UN NOMBRE.</i>',
    body: 'No voy a convertirte en una villana ni a inventar lo que pensabas. Solo puedo hablar desde mi lado: hubo cariño, hubo ilusión y también hubo cosas que dolieron. Me habría gustado que algunas cosas fueran distintas. Aun así, lo que sentí fue real.',
    foot: 'SOME NAMES STAY QUIETLY IN THE MARGIN.',
    note: 'No necesito que esta historia tenga un culpable para admitir que me dolió.',
    place: 'THE PAGE I NEVER KNEW HOW TO WRITE',
    progress: 37
  },
  {
    time: 137,
    kicker: 'CHAPTER 05 / WHAT I CANNOT REWRITE',
    title: 'I AM<br><i>NOT PERFECT.</i>',
    body: 'He cometido errores. He dicho cosas que quizá habría expresado de otra manera. También he sentido miedo de perder a alguien y no haber sabido explicarlo bien. No puedo cambiar cada instante, pero sí aprender de él.',
    foot: 'REGRET CAN TEACH WITHOUT DEFINING ME.',
    note: 'Pedir perdón no borra el pasado; puede cambiar lo que hago después.',
    place: 'NO REWIND / JUST FORWARD',
    progress: 56
  },
  {
    time: 160,
    kicker: 'CHAPTER 06 / STILL BECOMING',
    title: 'ORDINARY<br><i>DOES NOT MEAN EMPTY.</i>',
    body: 'Mi vida no es una película perfecta. Son días normales, ideas enormes, amistades, dudas, proyectos que no salen y momentos que sí quiero guardar. Todavía estoy aprendiendo quién soy. No tengo que resolverlo todo hoy.',
    foot: 'UNFINISHED IS NOT THE SAME AS LOST.',
    note: 'Tengo tiempo para cambiar, para reparar y para descubrir qué quiero conservar.',
    place: 'PALMA / THE STORY CONTINUES',
    progress: 79
  },
  {
    time: 193,
    kicker: 'FINAL MOVEMENT / AFTER THE NOISE',
    title: 'STILL<br><i>HERE.</i>',
    body: 'Quizá crecer sea esto: aprender a mirar atrás sin quedarme a vivir allí. Guardar lo que merezca quedarse, soltar lo que no puedo controlar y seguir escribiendo, incluso cuando no sé cómo termina la frase.',
    foot: 'THIS IS NOT THE END OF THE STORY.',
    note: 'No soy solo lo que me pasó. También soy lo que elijo hacer con ello.',
    place: 'END OF THIS CHAPTER / NOT THE END',
    progress: 92
  }
];

const gate = document.getElementById('gate');
const welcome = document.getElementById('welcome');
const story = document.getElementById('story');

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

const chapterContent = document.getElementById('chapterContent');
const chapterKicker = document.getElementById('chapterKicker');
const chapterTitle = document.getElementById('chapterTitle');
const chapterBody = document.getElementById('chapterBody');
const chapterFoot = document.getElementById('chapterFoot');
const chapterIndex = document.getElementById('chapterIndex');
const chapterMeta = document.getElementById('chapterMeta');
const verticalNote = document.getElementById('verticalNote');
const noteLine = document.getElementById('noteLine');

const progressFill = document.getElementById('storyProgressFill');
const chapterDots = document.getElementById('chapterDots');
const endScreen = document.getElementById('endScreen');

const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const muteButton = document.getElementById('muteButton');

let player = null;
let playerReady = false;
let currentChapter = 0;
let isMuted = false;
let ticker = null;
let userHasStartedMusic = false;
let lastSyncedChapter = -1;

// REPRODUCTOR OFICIAL DE YOUTUBE

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('youtubePlayer', {
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      playsinline: 1,
      modestbranding: 1,
      origin: window.location.origin
    },
    events: {
      onReady: function () {
        playerReady = true;
      },

      onStateChange: function (event) {
        if (event.data === YT.PlayerState.PLAYING) {
          startTicker();
        }

        if (
          event.data === YT.PlayerState.PAUSED ||
          event.data === YT.PlayerState.ENDED
        ) {
          stopTicker();
        }

        if (event.data === YT.PlayerState.ENDED) {
          showEnding();
        }
      }
    }
  });
};

// LOGIN

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document
    .getElementById('username')
    .value.trim()
    .toUpperCase();

  const password = document.getElementById('password').value;

  if (
    username === ACCESS_USER &&
    password === ACCESS_PASSWORD
  ) {
    loginError.textContent = '';
    gate.classList.add('is-hidden');
    welcome.classList.remove('is-hidden');

  } else {
    loginError.textContent =
      'ACCESS DENIED / CHECK YOUR CREDENTIALS';

    document.getElementById('password').value = '';
  }
});

// INICIO DE LA EXPERIENCIA

document.getElementById('beginButton').addEventListener('click', function () {
  welcome.classList.add('is-hidden');
  story.classList.remove('is-hidden');

  renderDots();
  showChapter(0, false);

  userHasStartedMusic = true;

  if (
    playerReady &&
    player &&
    typeof player.playVideo === 'function'
  ) {
    player.playVideo();

  } else {
    const waitForPlayer = setInterval(function () {
      if (playerReady && player && userHasStartedMusic) {
        clearInterval(waitForPlayer);
        player.playVideo();
      }
    }, 500);

    setTimeout(function () {
      clearInterval(waitForPlayer);
    }, 15000);
  }
});

// INDICADORES DE CAPÍTULOS

function renderDots() {
  chapterDots.innerHTML = '';

  chapters.forEach(function (chapter, index) {
    const dot = document.createElement('button');

    dot.type = 'button';
    dot.setAttribute(
      'aria-label',
      'Ir al capítulo ' + (index + 1)
    );

    dot.addEventListener('click', function () {
      showChapter(index, true);
    });

    chapterDots.appendChild(dot);
  });
}

// CAMBIAR CAPÍTULO

function showChapter(index, seekMusic) {
  currentChapter = Math.max(
    0,
    Math.min(index, chapters.length - 1)
  );

  const data = chapters[currentChapter];

  chapterContent.classList.add('is-changing');
  endScreen.classList.add('is-hidden');

  window.setTimeout(function () {
    chapterKicker.textContent = data.kicker;
    chapterTitle.innerHTML = data.title;
    chapterBody.textContent = data.body;
    chapterFoot.textContent = data.foot;

    chapterIndex.textContent =
      String(currentChapter + 1).padStart(2, '0') +
      ' / ' +
      String(chapters.length).padStart(2, '0');

    chapterMeta.textContent =
      String(currentChapter + 1).padStart(2, '0') +
      ' — ' +
      String(chapters.length).padStart(2, '0');

    verticalNote.textContent = data.place;
    noteLine.textContent = data.note;

    progressFill.style.width = data.progress + '%';

    Array.from(chapterDots.children).forEach(function (dot, dotIndex) {
      dot.classList.toggle(
        'active',
        dotIndex === currentChapter
      );
    });

    previousButton.disabled = currentChapter === 0;

    nextButton.textContent =
      currentChapter === chapters.length - 1
        ? 'FINAL →'
        : 'SIGUIENTE →';

    chapterContent.classList.remove('is-changing');

  }, 280);

  if (
    seekMusic &&
    playerReady &&
    player &&
    typeof player.seekTo === 'function'
  ) {
    player.seekTo(data.time, true);
    player.playVideo();
    userHasStartedMusic = true;
  }

  lastSyncedChapter = currentChapter;
}

// NAVEGACIÓN

previousButton.addEventListener('click', function () {
  if (currentChapter > 0) {
    showChapter(currentChapter - 1, true);
  }
});

nextButton.addEventListener('click', function () {
  if (currentChapter < chapters.length - 1) {
    showChapter(currentChapter + 1, true);
  } else {
    showEnding();
  }
});

// SILENCIAR

muteButton.addEventListener('click', function () {
  if (!playerReady || !player) return;

  isMuted = !isMuted;

  if (isMuted) {
    player.mute();
  } else {
    player.unMute();
  }

  muteButton.textContent = isMuted
    ? 'SOUND OFF'
    : 'SOUND ON';
});

// SINCRONIZACIÓN CON LA CANCIÓN

function startTicker() {
  stopTicker();
  ticker = window.setInterval(syncToMusic, 500);
}

function stopTicker() {
  if (ticker) {
    window.clearInterval(ticker);
  }

  ticker = null;
}

function syncToMusic() {
  if (
    !playerReady ||
    !player ||
    typeof player.getCurrentTime !== 'function'
  ) return;

  const now = player.getCurrentTime();

  let target = 0;

  for (let i = 0; i < chapters.length; i++) {
    if (now >= chapters[i].time) {
      target = i;
    }
  }

  if (target !== lastSyncedChapter) {
    showChapter(target, false);
  }

  progressFill.style.width =
    Math.min(100, (now / 245) * 100) + '%';
}

// FINAL

function showEnding() {
  stopTicker();
  endScreen.classList.remove('is-hidden');
}

document.getElementById('restartButton').addEventListener('click', function () {
  endScreen.classList.add('is-hidden');
  showChapter(0, true);
});

// EFECTO DEL CURSOR

if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.querySelector('.cursor-glow');

  window.addEventListener('pointermove', function (event) {
    glow.style.left = event.clientX + 'px';
    glow.style.top = event.clientY + 'px';
  }, { passive: true });
}
