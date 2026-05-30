const root = document.documentElement;
const portal = document.querySelector('.video-portal');
const videos = [...document.querySelectorAll('.portal-video')];
const playButton = document.querySelector('[data-action="toggle-play"]');
const soundButton = document.querySelector('[data-action="toggle-sound"]');
const soundNudge = document.querySelector('[data-action="nudge-sound"]');
const celebrateButton = document.querySelector('[data-action="celebrate"]');
const photoCards = [...document.querySelectorAll('.photo-card')];
const spotlight = document.querySelector('.spotlight');
const spotlightImage = spotlight.querySelector('img');
const spotlightText = spotlight.querySelector('p');
const spotlightClose = document.querySelector('.spotlight-close');

let activeIndex = 0;
let isPlaying = true;
let soundEnabled = true;
let sequenceTimer = 0;
let soundFallbackHandled = false;
let needsSoundNudge = false;

function updateSoundNudge() {
  soundNudge.hidden = !needsSoundNudge || soundEnabled;
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
  dolphin.className = 'surface-dolphin';
  dolphin.style.setProperty('--surface-x', `${18 + Math.random() * 64}vw`);
  dolphin.style.setProperty('--surface-r', `${Math.random() > .5 ? 12 : -12}deg`);
  document.body.append(dolphin);
  dolphin.addEventListener('animationend', () => dolphin.remove(), { once: true });
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
soundNudge.addEventListener('click', toggleSound);
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
window.setInterval(spawnSurfaceDolphin, 9000);
