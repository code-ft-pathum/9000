// ── Your photos ────────────────────────────────────────
const sachiniPhotos = [
  "images/1650976845911.jpg", "images/1718766665647.jpg", "images/1735637167910.jpg",
  "images/1739453789522.jpg", "images/1739453922096.jpg", "images/1739454221624.jpg",
  "images/FB_IMG_1735637491165.jpg", "images/FB_IMG_1735637498492.jpg",
  "images/IMG-20210618-WA0041-01.jpeg", "images/IMG-20210715-WA0003.jpg",
  "images/IMG-20211120-WA0037.jpg", "images/IMG-20220318-WA0047.jpg",
  "images/IMG-20220328-WA0062.jpg", "images/IMG-20220610-WA0013.jpg",
  "images/IMG-20220610-WA0014.jpg", "images/IMG-20220610-WA0016.jpg",
  "images/IMG-20230331-WA0012.jpg", "images/IMG-20230419-WA0015.jpg",
  "images/IMG-20240606-WA0003.jpg", "images/IMG-20240814-WA0008.jpg",
  "images/IMG-20240814-WA0014.jpg", "images/IMG-20240814-WA0017.jpg",
  "images/IMG-20241001-WA0021.jpg", "images/IMG-20250124-WA0016.jpg"
];

// ── Global State ──────────────────────────────────────
let currentLevel = 0;
const totalQuestLevels = 15; // 0 to 14
const $ = id => document.getElementById(id);

// ── Loader ─────────────────────────────────────────────
window.addEventListener('load', () => {
  const progress = $('ld-progress');
  let val = 0;
  const timer = setInterval(() => {
    val += 2.5;
    if (progress) progress.style.width = val + '%';
    if (val >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        $('loader').classList.add('hidden');
        $('content').classList.remove('hidden');
        startTypewriter();
        initPetals();
      }, 800);
    }
  }, 40);
});

// ── Romantic typewriter ────────────────────────────────
const loveMessages = [
  "To the girl who makes every sunrise feel like a love letter…",
  "9000 days of Sachini = 9000 reasons the world is more beautiful…",
  "Your kindness, your laugh, your light — thank you for existing…",
  "You deserve every gentle thing this life can give you…",
  "I hope today feels like the warmest hug from the universe… ♡"
];
let msgIdx = 0, char = 0;
const typeEl = $('typewriter');

function startTypewriter() {
  if (!typeEl) return;
  typeEl.textContent = '';
  char = 0;
  const text = loveMessages[msgIdx];
  const interval = setInterval(() => {
    if (char < text.length) {
      typeEl.textContent += text[char++];
    } else {
      clearInterval(interval);
      setTimeout(() => {
        msgIdx = (msgIdx + 1) % loveMessages.length;
        startTypewriter();
      }, 3500);
    }
  }, 60);
}

// ── Floating petals & hearts ───────────────────────────
function initPetals() {
  const canvas = $('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  class Petal {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -50 - Math.random() * 100;
      this.size = Math.random() * 20 + 10;
      this.speed = Math.random() * 1.5 + 0.8;
      this.angle = Math.random() * Math.PI * 2;
      this.rot = Math.random() * 0.05 - 0.025;
      this.opacity = Math.random() * 0.5 + 0.5;
      this.type = Math.random() > 0.4 ? '🌸' : '💗';
    }
    update() {
      this.y += this.speed;
      this.angle += this.rot;
      if (this.y > canvas.height + 50) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.font = `${this.size}px serif`;
      ctx.fillText(this.type, -this.size / 2, this.size / 2);
      ctx.restore();
    }
  }

  const petals = Array.from({ length: 50 }, () => new Petal());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── Quest Transitions ─────────────────────────────────
$('start-quest-btn').onclick = () => {
  $('hero-section').style.display = 'none';
  $('quest-section').style.display = 'flex';
  showLevel(0);
};

function nextLevel() {
  currentLevel++;
  if (currentLevel >= totalQuestLevels) {
    finishQuest();
  } else {
    showLevel(currentLevel);
  }
}

function showLevel(lvl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(`s${lvl}`).classList.add('active');
  $('progress-fill').style.width = (lvl / (totalQuestLevels - 1) * 100) + '%';
  initLevelGame(lvl);
}

function initLevelGame(lvl) {
  if (lvl === 2) initMemory();
  if (lvl === 3) initSimon();
  if (lvl === 4) initQuiz();
  if (lvl === 6) initHangman();
  if (lvl === 10) initCatch();
  if (lvl === 12) initBubbles();
  if (lvl === 13) initColor();
}

// ── Level Games ───────────────────────────────────────

// L1: Riddle
function check1() { if ($('in1').value.toLowerCase().includes('sentence')) nextLevel(); }

// L2: Memory (Expanded to 16 cards)
function initMemory() {
  const icons = ['🌸', '🌸', '💖', '💖', '🌹', '🌹', '💍', '💍', '🍰', '🍰', '🧸', '🧸', '🌟', '🌟', '🍫', '🍫'];
  const shuffled = icons.sort(() => 0.5 - Math.random());
  const grid = $('memory-grid'); grid.innerHTML = '';
  let flipped = [];
  shuffled.forEach(icon => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => {
      if (flipped.length < 2 && !card.classList.contains('flipped')) {
        card.textContent = icon; card.classList.add('flipped');
        flipped.push(card);
        if (flipped.length === 2) {
          if (flipped[0].textContent === flipped[1].textContent) {
            flipped = [];
            if (document.querySelectorAll('.flipped').length === 16) setTimeout(nextLevel, 800);
          } else {
            setTimeout(() => { flipped.forEach(c => { c.classList.remove('flipped'); c.textContent = '' }); flipped = []; }, 600);
          }
        }
      }
    };
    grid.appendChild(card);
  });
}

// L3: Simon
let simonSeq = [];
let userSeq = [];
function initSimon() {
  simonSeq = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
  userSeq = [];
  let i = 0;
  $('simon-msg').textContent = "Watch carefully...";
  const interval = setInterval(() => {
    if (currentLevel !== 3) { clearInterval(interval); return; }
    const p = $('p' + simonSeq[i]);
    if (p) {
      p.classList.add('lit');
      setTimeout(() => p.classList.remove('lit'), 400);
    }
    i++;
    if (i >= 4) { clearInterval(interval); $('simon-msg').textContent = "Your turn!"; }
  }, 800);
}
function padTap(id) {
  if ($('simon-msg').textContent !== "Your turn!") return;
  const p = $('p' + id); p.classList.add('lit'); setTimeout(() => p.classList.remove('lit'), 200);
  userSeq.push(id);
  if (userSeq[userSeq.length - 1] !== simonSeq[userSeq.length - 1]) initSimon();
  else if (userSeq.length === 4) setTimeout(nextLevel, 600);
}

// L4: Quiz
function initQuiz() {
  const btns = $('q-btns'); btns.innerHTML = '';
  ['A Movie Star', 'Sachini Herself!', 'The Moon'].forEach((text, i) => {
    const b = document.createElement('button');
    b.className = 'quest-btn';
    b.textContent = text;
    b.onclick = () => { if (i === 1) nextLevel(); else b.style.opacity = '0.5'; };
    btns.appendChild(b);
  });
}

// L5: Unscramble
function check5() { if ($('in5').value.toLowerCase().replace(/\s/g, '').includes('loveyouforever')) nextLevel(); }

// L6: Hangman
function initHangman() {
  const word = "9000DAYS";
  let guessed = [];
  const draw = () => {
    $('h-word').textContent = word.split('').map(l => guessed.includes(l) ? l : '_').join(' ');
    if (!$('h-word').textContent.includes('_')) setTimeout(nextLevel, 800);
  };
  $('h-keys').innerHTML = '';
  "90DAYSLOVE".split('').forEach(l => {
    const b = document.createElement('button'); b.className = 'quest-btn';
    b.style.padding = '8px 15px'; b.textContent = l;
    b.onclick = () => { guessed.push(l); b.disabled = true; b.style.opacity = 0.5; draw(); };
    $('h-keys').appendChild(b);
  });
  draw();
}

// L7: RPS
let rScore = 0;
function playRps(move) {
  const moves = ['🪨', '📄', '✂️'];
  const ai = moves[Math.floor(Math.random() * 3)];
  if ((move === '🪨' && ai === '✂️') || (move === '📄' && ai === '🪨') || (move === '✂️' && ai === '📄')) rScore++;
  $('rps-res').textContent = `AI chose ${ai}. Result: ${rScore}/2`;
  if (rScore >= 2) setTimeout(nextLevel, 800);
}

// L9: Number Guess
let targetNum = Math.floor(Math.random() * 100);
function check9() {
  const g = parseInt($('in9').value);
  if (g === targetNum) nextLevel();
  else $('hint9').textContent = g < targetNum ? "Try Higher! 🚀" : "Try Lower! 📉";
}

// L10: Catch
let cScore = 0;
function initCatch() {
  cScore = 0;
  if ($('c-score')) $('c-score').textContent = "Caught: 0/5";
  const area = $('catch-area');
  const bucket = $('player-bucket');
  if (!area || !bucket) return;

  const spawn = setInterval(() => {
    if (currentLevel !== 10 || cScore >= 5) { clearInterval(spawn); return; }
    const h = document.createElement('div');
    h.className = 'falling-heart';
    h.textContent = Math.random() > 0.5 ? '💖' : '💋';
    let x = Math.random() * 80 + 10;
    h.style.left = x + '%';
    h.style.top = '-40px';
    area.appendChild(h);

    let y = -40;
    const fall = setInterval(() => {
      if (currentLevel !== 10) { h.remove(); clearInterval(fall); return; }
      y += 5;
      h.style.top = y + 'px';

      const bRect = bucket.getBoundingClientRect();
      const hRect = h.getBoundingClientRect();

      // Collision check
      if (hRect.bottom > bRect.top && hRect.top < bRect.bottom &&
        hRect.left < bRect.right && hRect.right > bRect.left) {
        cScore++;
        if ($('c-score')) $('c-score').textContent = `Caught: ${cScore}/5`;
        h.remove();
        clearInterval(fall);
        if (cScore >= 5) {
          setTimeout(nextLevel, 600);
        }
      }

      if (y > 280) {
        if (h.parentNode) h.remove();
        clearInterval(fall);
      }
    }, 20);
  }, 1000);
}

function moveBasket(e) {
  e.preventDefault();
  const rect = $('catch-area').getBoundingClientRect();
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  let x = ((clientX - rect.left) / rect.width) * 100;
  x = Math.max(5, Math.min(95, x));
  $('player-bucket').style.left = x + '%';
}

// L11: Tap
let taps = 0;
function heartTap() {
  taps++; $('tap-count').textContent = `${taps}/10`;
  $('tap-heart').style.transform = "scale(1.4)";
  setTimeout(() => $('tap-heart').style.transform = "scale(1)", 100);
  if (taps >= 10) setTimeout(nextLevel, 600);
}

// L12: Bubbles
let bScore = 0;
function initBubbles() {
  bScore = 0;
  if ($('b-score')) $('b-score').textContent = "Dream Pop: 0/5";
  const area = $('bubble-area');
  if (!area) return;
  area.innerHTML = '';

  const spawn = setInterval(() => {
    if (currentLevel !== 12 || bScore >= 5) { clearInterval(spawn); return; }

    const b = document.createElement('div');
    const isBomb = Math.random() > 0.7; // 30% chance for cloud
    b.className = 'bubble';
    b.textContent = isBomb ? '☁️' : '✨';
    b.style.left = (Math.random() * 80 + 10) + '%';
    b.style.top = '260px';
    area.appendChild(b);

    // Animate up
    setTimeout(() => { b.style.top = '-60px'; }, 50);

    b.onclick = (e) => {
      e.stopPropagation();
      if (isBomb) {
        // Reset level on cloud hit
        initBubbles();
      } else {
        bScore++;
        if ($('b-score')) $('b-score').textContent = `Dream Pop: ${bScore}/5`;
        b.remove();
        if (bScore >= 5) setTimeout(nextLevel, 600);
      }
    };

    // Cleanup if not clicked
    setTimeout(() => { if (b.parentNode) b.remove(); }, 3500);
  }, 900);
}

// L13: Color
function initColor() {
  const colors = ['#ff79c6', '#a2f2e9', '#fccf31', '#d0aaff'];
  const names = ['PINK', 'MINT', 'GOLD', 'PURPLE'];
  const idx = Math.floor(Math.random() * 4);
  $('color-name').textContent = names[idx];
  $('color-name').style.color = colors[Math.floor(Math.random() * 4)];
  $('color-btns').innerHTML = '';
  colors.forEach((c, i) => {
    const b = document.createElement('div');
    b.style.cssText = `height:60px; background:${c}; border-radius:15px; cursor:pointer; box-shadow:0 5px 15px rgba(0,0,0,0.1);`;
    b.onclick = () => { if (i === idx) nextLevel(); else initColor(); };
    $('color-btns').appendChild(b);
  });
}

// L14: Final
function check14() {
  const val = $('in14').value.toLowerCase();
  if (val.includes('love') || val.includes('trust') || val.includes('us')) nextLevel();
}

// ── Conclusion ────────────────────────────────────────
function finishQuest() {
  $('quest-section').style.display = 'none';
  const gallery = $('gallery');
  const wish = $('final-wish');
  if (gallery) gallery.style.display = 'block';
  if (wish) wish.style.display = 'block';

  populateGallery();
  initScrollReveal();

  // Smooth scroll to results
  setTimeout(() => {
    gallery.scrollIntoView({ behavior: 'smooth' });
  }, 200);
}

function populateGallery() {
  const grid = $('photo-grid');
  if (!grid) return;
  grid.innerHTML = '';
  sachiniPhotos.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.transitionDelay = (idx * 0.05) + 's';

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Memory ${idx + 1}`;
    img.loading = 'lazy';

    // Fallback for broken images
    img.onerror = () => { img.src = 'https://via.placeholder.com/300x400?text=Lovely+Memory'; };

    item.appendChild(img);
    grid.appendChild(item);
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
}
