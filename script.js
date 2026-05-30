const root = document.documentElement;
const portal = document.querySelector('.video-portal');
const videos = [...document.querySelectorAll('.portal-video')];
const playButton = document.querySelector('[data-action="toggle-play"]');
const soundButton = document.querySelector('[data-action="toggle-sound"]');
const celebrateButton = document.querySelector('[data-action="celebrate"]');
const photoCards = [...document.querySelectorAll('.photo-card')];
const spotlight = document.querySelector('.spotlight');
const spotlightImage = spotlight.querySelector('img');
const spotlightText = spotlight.querySelector('p');
const spotlightClose = document.querySelector('.spotlight-close');

let activeIndex = 0;
let isPlaying = true;
let soundEnabled = false;
let sequenceTimer = 0;
let soundFallbackHandled = false;
let needsSoundNudge = true;
let soundBalloonTimeline = null;

function buildSoundBalloon() {
  if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  window.gsap.set(soundButton, {
    transformOrigin: '50% 55%',
    scale: .84,
    opacity: 1,
    borderRadius: '50%',
  });

  return window.gsap.timeline({ repeat: -1, repeatDelay: .18 })
    .to(soundButton, {
      scaleX: 1.08,
      scaleY: 1.18,
      rotation: -2,
      borderRadius: '48% 52% 54% 46%',
      duration: .32,
      ease: 'sine.out',
    })
    .to(soundButton, {
      scaleX: 1.42,
      scaleY: 1.58,
      rotation: 2,
      borderRadius: '55% 45% 50% 50%',
      duration: .34,
      ease: 'sine.out',
    })
    .to(soundButton, {
      scaleX: 1.82,
      scaleY: 2.08,
      rotation: -1,
      borderRadius: '46% 54% 58% 42%',
      duration: .34,
      ease: 'power1.out',
    })
    .to(soundButton, {
      scaleX: 2.35,
      scaleY: 2.75,
      rotation: 1,
      borderRadius: '60% 40% 48% 52%',
      duration: .28,
      ease: 'power1.in',
    })
    .to(soundButton, {
      scaleX: .18,
      scaleY: .08,
      opacity: .15,
      rotation: -8,
      borderRadius: '50%',
      duration: .07,
      ease: 'power4.in',
    })
    .to(soundButton, {
      scaleX: 1.12,
      scaleY: .82,
      opacity: 1,
      rotation: 4,
      duration: .16,
      ease: 'back.out(3)',
    })
    .to(soundButton, {
      scaleX: .84,
      scaleY: .84,
      rotation: 0,
      duration: .18,
      ease: 'elastic.out(1, .45)',
    });
}

function syncSoundBalloon() {
  if (!soundButton.classList.contains('needs-sound')) {
    if (soundBalloonTimeline) {
      soundBalloonTimeline.kill();
      soundBalloonTimeline = null;
    }
    if (window.gsap) {
      window.gsap.set(soundButton, { clearProps: 'transform,opacity,borderRadius' });
    } else {
      soundButton.style.transform = '';
      soundButton.style.opacity = '';
      soundButton.style.borderRadius = '';
    }
    return;
  }

  if (!soundBalloonTimeline) {
    soundBalloonTimeline = buildSoundBalloon();
  }
}

function updateSoundNudge() {
  soundButton.classList.toggle('needs-sound', !soundEnabled);
  syncSoundBalloon();
}

function setPointerLight(event) {
  root.style.setProperty('--x', `${event.clientX}px`);
  root.style.setProperty('--y', `${event.clientY}px`);
}

function activeVideo() {
  return videos[activeIndex];
}

function showVideo(index) {
  activeIndex = index;
  videos.forEach((video, videoIndex) => {
    const active = videoIndex === index;
    video.classList.toggle('is-active', active);
    video.muted = !soundEnabled || !active;
    if (active && isPlaying) {
      video.play().catch(() => {});
    }
  });
}

function handleSoundFallback() {
  if (soundFallbackHandled) return;
  soundFallbackHandled = true;
  soundEnabled = false;
  needsSoundNudge = true;
  soundButton.textContent = 'Sound on';
  updateSoundNudge();
  videos.forEach((fallbackVideo) => {
    fallbackVideo.muted = true;
    fallbackVideo.play().catch(() => {});
  });
}

function scheduleNextVideo() {
  window.clearTimeout(sequenceTimer);
  const current = activeVideo();
  const duration = Number.isFinite(current.duration) && current.duration > 2 ? current.duration : 12;
  const nextDelay = Math.max(4500, (duration - 1.2) * 1000);
  sequenceTimer = window.setTimeout(() => {
    const nextIndex = (activeIndex + 1) % videos.length;
    videos[nextIndex].currentTime = 0;
    showVideo(nextIndex);
    scheduleNextVideo();
  }, nextDelay);
}

function startVideos() {
  isPlaying = true;
  portal.classList.add('is-playing');
  playButton.textContent = 'Pause video';
  videos.forEach((video) => {
    video.play().catch(handleSoundFallback);
  });
  scheduleNextVideo();
}

function pauseVideos() {
  isPlaying = false;
  portal.classList.remove('is-playing');
  playButton.textContent = 'Play video';
  window.clearTimeout(sequenceTimer);
  videos.forEach((video) => video.pause());
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    needsSoundNudge = false;
  }
  soundButton.textContent = soundEnabled ? 'Sound off' : 'Sound on';
  updateSoundNudge();
  videos.forEach((video, index) => {
    video.muted = !soundEnabled || index !== activeIndex;
  });
  if (soundEnabled) {
    startVideos();
  }
}

function spawnSurfaceDolphin() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dolphin = document.createElement('span');
  const splash = document.createElement('span');
  const surfaceX = `${18 + Math.random() * 64}vw`;
  dolphin.className = 'surface-dolphin';
  dolphin.innerHTML = `
    <svg viewBox="0 0 260 130" aria-hidden="true" focusable="false">
      <path class="dolphin-tail" d="M220 60 C246 36 254 28 260 21 C255 49 246 66 229 77 C248 90 255 104 259 124 C247 117 232 105 216 86 Z"></path>
      <path class="dolphin-body" d="M17 78 C43 33 104 10 163 25 C194 33 220 50 236 72 C202 76 173 88 143 104 C99 128 49 117 17 78 Z"></path>
      <path class="dolphin-belly" d="M47 82 C89 102 137 99 183 75 C151 111 91 125 47 82 Z"></path>
      <path class="dolphin-fin" d="M124 56 C139 28 154 17 174 13 C164 36 151 50 130 65 Z"></path>
      <path class="dolphin-flipper" d="M126 86 C143 97 155 111 162 127 C137 121 121 109 112 91 Z"></path>
      <circle cx="66" cy="61" r="5"></circle>
    </svg>
  `;
  splash.className = 'surface-splash';
  dolphin.style.setProperty('--surface-x', surfaceX);
  splash.style.setProperty('--surface-x', surfaceX);
  dolphin.style.setProperty('--surface-r', `${Math.random() > .5 ? 12 : -12}deg`);
  document.body.append(splash, dolphin);
  dolphin.addEventListener('animationend', () => dolphin.remove(), { once: true });
  splash.addEventListener('animationend', () => splash.remove(), { once: true });
}

function spawnAmbientBubbles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const originX = window.innerWidth * (.08 + Math.random() * .84);
  const originY = window.innerHeight + 40;
  popBubbles(originX, originY, 8 + Math.floor(Math.random() * 8));
}

function popBubbles(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 16) {
  for (let index = 0; index < count; index += 1) {
    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.style.left = `${x + (Math.random() - .5) * 160}px`;
    bubble.style.top = `${y + (Math.random() - .5) * 90}px`;
    bubble.style.setProperty('--size', `${14 + Math.random() * 42}px`);
    bubble.style.setProperty('--time', `${1.6 + Math.random() * 1.4}s`);
    document.body.append(bubble);
    bubble.addEventListener('animationend', () => bubble.remove(), { once: true });
  }
}

function launchConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 32) {
  const colors = ['#ffd447', '#45ffe8', '#ff4f9a', '#c9ff38', '#efffff'];
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.setProperty('--color', colors[index % colors.length]);
    piece.style.setProperty('--dx', `${(Math.random() - .5) * 520}px`);
    piece.style.setProperty('--dy', `${120 + Math.random() * 320}px`);
    document.body.append(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
  }
}

function celebrate(x, y) {
  popBubbles(x, y, 22);
  launchConfetti(x, y, 38);
}

function openSpotlight(card) {
  spotlightImage.src = card.dataset.image;
  spotlightImage.alt = card.querySelector('img').alt;
  spotlightText.textContent = `${card.dataset.title} / Championwoman`;
  spotlight.hidden = false;
  spotlightClose.focus();
}

function closeSpotlight() {
  spotlight.hidden = true;
  spotlightImage.removeAttribute('src');
}

function makeDraggable(card) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  card.addEventListener('pointerdown', (event) => {
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
    originX = Number(card.dataset.x || 0);
    originY = Number(card.dataset.y || 0);
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener('pointermove', (event) => {
    if (!card.hasPointerCapture(event.pointerId)) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 8) {
      dragging = true;
      card.dataset.x = originX + dx;
      card.dataset.y = originY + dy;
      card.style.translate = `${originX + dx}px ${originY + dy}px`;
    }
  });

  card.addEventListener('pointerup', (event) => {
    card.releasePointerCapture(event.pointerId);
    if (!dragging) {
      celebrate(event.clientX, event.clientY);
      openSpotlight(card);
    }
  });
}

window.addEventListener('pointermove', setPointerLight);

portal.addEventListener('click', () => {
  if (isPlaying) {
    pauseVideos();
  } else {
    startVideos();
  }
});

playButton.addEventListener('click', () => {
  if (isPlaying) {
    pauseVideos();
  } else {
    startVideos();
  }
});

soundButton.addEventListener('click', toggleSound);
celebrateButton.addEventListener('click', (event) => celebrate(event.clientX, event.clientY));
spotlightClose.addEventListener('click', closeSpotlight);
spotlight.addEventListener('click', (event) => {
  if (event.target === spotlight) {
    closeSpotlight();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !spotlight.hidden) {
    closeSpotlight();
  }
});

videos.forEach((video, index) => {
  video.addEventListener('loadedmetadata', () => {
    if (index === activeIndex) {
      scheduleNextVideo();
    }
  });
  video.addEventListener('ended', () => {
    const nextIndex = (activeIndex + 1) % videos.length;
    videos[nextIndex].currentTime = 0;
    showVideo(nextIndex);
    scheduleNextVideo();
  });
});

photoCards.forEach(makeDraggable);
showVideo(0);
startVideos();
updateSoundNudge();
window.setTimeout(spawnSurfaceDolphin, 1400);
window.setInterval(spawnSurfaceDolphin, 7200);
window.setTimeout(spawnAmbientBubbles, 900);
window.setInterval(spawnAmbientBubbles, 2600);
