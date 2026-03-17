const taper = document.getElementById("taper");
const flame = document.getElementById("flame");
const halo = document.getElementById("flameHalo");

const sparkles = document.querySelectorAll(".sparkle");
const drawings = document.querySelectorAll(".hanging-piece");

const scene = document.getElementById("scene");
const aboutScene = document.getElementById("aboutScene");
const wall = document.querySelector(".wall");

let currentY = -30;
let targetY = -30;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setSceneScale(targetScene, baseWidth = 1330) {
  if (!targetScene || !wall) return;

  const availableWidth = window.innerWidth - 24;
  const scale = Math.min(1, availableWidth / baseWidth);

  targetScene.style.transform = `translateX(-50%) scale(${scale})`;
  wall.style.height = `${targetScene.offsetHeight * scale}px`;
}

function scaleScenes() {
  if (document.body.classList.contains("home")) {
    setSceneScale(scene);
  }

  if (document.body.classList.contains("about-home")) {
    setSceneScale(aboutScene);
  }
}

function revealSparkles() {
  sparkles.forEach((sparkle) => {
    const rect = sparkle.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    sparkle.classList.toggle("show", isVisible);
  });
}

function revealDrawings() {
  drawings.forEach((drawing) => {
    const rect = drawing.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      drawing.classList.add("show");
    }
  });
}

function updateFlameEffects() {
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;

  if (taper) {
    targetY = -30 + progress * (window.innerHeight - 260);
  }

  if (flame) {
    const speed = clamp(0.20 - progress * 0.12, 0.08, 0.20);
    flame.style.animationDuration = `${speed}s`;
  }

  if (halo) {
    halo.style.top = `${currentY + 92}px`;
    halo.style.opacity = 0.28 + progress * 0.18;
  }
}

function onScroll() {
  updateFlameEffects();
  revealSparkles();
  revealDrawings();
}

function animate() {
  if (taper) {
    currentY += (targetY - currentY) * 0.18;
    taper.style.top = `${currentY}px`;
  }

  if (halo) {
    halo.style.top = `${currentY + 92}px`;
  }

  requestAnimationFrame(animate);
}

function onResize() {
  scaleScenes();
  onScroll();
}

window.addEventListener("scroll", onScroll);
window.addEventListener("resize", onResize);
window.addEventListener("load", () => {
  scaleScenes();
  onScroll();
  animate();
});

scaleScenes();
onScroll();