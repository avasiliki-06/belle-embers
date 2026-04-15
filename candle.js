// getting the candle wrapper so I can move it up and down with scroll
const taper = document.getElementById("taper");

// getting the flame
const flame = document.getElementById("flame");

// getting the halo glow around the flame
const halo = document.getElementById("flameHalo");

// selecting all sparkles on the page
const sparkles = document.querySelectorAll(".sparkle");

// selecting the hanging drawings
const drawings = document.querySelectorAll(".hanging-piece");

// scene for home page
const scene = document.getElementById("scene");

// scene for about page
const aboutScene = document.getElementById("aboutScene");

// scene for builder page
const builderScene = document.getElementById("builderScene");

// currentY is the current position of the candle
let currentY = -30;

// targetY is where I want the candle to move to
let targetY = -30;

// helper function to keep a number between a minimum and maximum
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// this scales the scene so it still fits smaller screens
function setSceneScale(targetScene, baseWidth = 1330) {
  if (!targetScene) return;

  const availableWidth = window.innerWidth - 24;
  const scale = Math.min(1, availableWidth / baseWidth);

  targetScene.style.transform = `translateX(-50%) scale(${scale})`;
  targetScene.style.transformOrigin = "top center";

  // this sets the height of the wall based on the scaled scene
  const parent = targetScene.parentElement;
  if (parent) {
    parent.style.height = `${targetScene.offsetHeight * scale}px`;
  }
}

// this clears scene styles on mobile so css can control the layout
function resetScene(targetScene) {
  if (!targetScene) return;

  targetScene.style.transform = "";
  targetScene.style.transformOrigin = "";
  targetScene.style.height = "";
  targetScene.style.minHeight = "";

  const parent = targetScene.parentElement;
  if (parent) {
    parent.style.height = "";
    parent.style.minHeight = "";
  }
}

// figure out which page we are on and scale that page
function scaleScenes() {
  const isMobile = window.innerWidth <= 900;

  if (document.body.classList.contains("home")) {
    if (isMobile) resetScene(scene);
    else setSceneScale(scene);
  }

  if (document.body.classList.contains("about-home")) {
    if (isMobile) resetScene(aboutScene);
    else setSceneScale(aboutScene);
  }

  if (document.body.classList.contains("builder-home")) {
    if (isMobile) resetScene(builderScene);
    else setSceneScale(builderScene);
  }
}

// reveal sparkles when they come into view
function revealSparkles() {
  sparkles.forEach((sparkle) => {
    const rect = sparkle.getBoundingClientRect();

    // checking if the sparkle is visible in the screen
    const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

    sparkle.classList.toggle("show", isVisible);
  });
}

// reveal the hanging drawings when scrolling down
function revealDrawings() {
  drawings.forEach((drawing) => {
    const rect = drawing.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.95) {
      drawing.classList.add("show");
    }
  });
}

// updates the movement and light effect as the page scrolls
function updateFlameEffects() {
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;

  // moving the candle down the page as the user scrolls
  if (taper) {
    targetY = -30 + progress * (window.innerHeight - 260);
  }

  // changing the flame flicker speed a bit
  if (flame) {
    const speed = clamp(0.20 - progress * 0.12, 0.08, 0.20);
    flame.style.animationDuration = `${speed}s`;
  }

  // moving and fading the halo glow
  if (halo) {
    halo.style.top = `${currentY + 92}px`;
    halo.style.opacity = 0.28 + progress * 0.18;
  }
}

// everything that should happen on scroll
function onScroll() {
  updateFlameEffects();
  revealSparkles();
  revealDrawings();
}

// smooth animation loop
function animate() {
  if (taper) {
    // easing the candle movement so it feels smoother
    currentY += (targetY - currentY) * 0.18;
    taper.style.top = `${currentY}px`;
  }

  if (halo) {
    halo.style.top = `${currentY + 92}px`;
  }

  requestAnimationFrame(animate);
}

// run this when resizing the browser
function onResize() {
  scaleScenes();
  onScroll();
}

// event listeners
window.addEventListener("scroll", onScroll);
window.addEventListener("resize", onResize);

// when page fully loads, set everything up
window.addEventListener("load", () => {
  scaleScenes();
  onScroll();
  animate();
});

// also running these once just in case
scaleScenes();
onScroll();