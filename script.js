/* eslint-disable no-use-before-define */
/* Shared script for all romantic pages */

const TARGET = {
  day: 18,
  monthIndo: "mei",
  monthNumber: 5, // May
  year: 2026,
};

function normalizeSpaces(s) {
  return (s || "").toString().replace(/\s+/g, " ").trim();
}

function normalizeForCompare(s) {
  return normalizeSpaces(s)
    .toLowerCase()
    .replace(/[-/\\.]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, "");
}

function parseIndoMayDate(input) {
  // Accept formats like:
  // - "18 Mei 2026"
  // - "18mei2026" (loose)
  // - "18/05/2026"
  // Returns {day, year} if matches, else null.
  const raw = (input || "").toString();
  const s = raw.toLowerCase().replace(/[-/\\.]/g, " ").trim();

  // Format: DD mei YYYY
  const m1 = s.match(/(\d{1,2})\s*mei\s*(\d{4})/i);
  if (m1) {
    const day = Number(m1[1]);
    const year = Number(m1[2]);
    return { day, year };
  }

  // Format: DD MM YYYY (e.g. 18/05/2026)
  const m2 = s.match(/(\d{1,2})\s+(\d{1,2})\s+(\d{4})/);
  if (m2) {
    const day = Number(m2[1]);
    const mm = Number(m2[2]);
    const year = Number(m2[3]);
    if (mm === TARGET.monthNumber) return { day, year };
  }

  return null;
}

function isValidJadianDate(input) {
  const parsed = parseIndoMayDate(input);
  if (!parsed) return false;
  return parsed.day === TARGET.day && parsed.year === TARGET.year;
}

function setupHeartsLayer() {
  const layer =
    document.getElementById("heartsLayer") ||
    document.querySelector(".hearts");

  return (
    layer ||
    (() => {
      const el = document.createElement("div");
      el.className = "hearts";
      el.id = "heartsLayer";
      document.body.appendChild(el);
      return el;
    })()
  );
}

function spawnHearts(count = 18) {
  const layer = setupHeartsLayer();
  const colors = ["#ff4da6", "#ff86c7", "#ffd36e"];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heartFall";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.background = colors[Math.floor(Math.random() * colors.length)];

    const size = 10 + Math.random() * 14;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;

    const duration = 1250 + Math.random() * 1250;
    heart.style.animationDuration = `${duration}ms`;
    heart.style.animationDelay = `${Math.random() * 250}ms`;

    layer.appendChild(heart);
    window.setTimeout(() => {
      heart.remove();
    }, duration + 500);
  }
}

async function typewriter(el, text, speedMs = 22) {
  if (!el) return;
  el.textContent = "";

  for (let i = 0; i < text.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, speedMs));
    el.textContent += text[i];
  }
}

function initTypeRotator() {
  const typeEl = document.getElementById("typeText");
  const subtitleEl = document.getElementById("subtitleText");
  const nextBtn = document.getElementById("nextQuoteBtn");

  if (!typeEl) return;

  const quotes = [
    "Elii… kamu itu tenang yang bikin aku berani percaya.",
    "Kalau cinta punya rumah, aku mau tinggal di hatimu terus.",
    "Aku milih kamu lagi dan lagi, sampai hidupku nggak punya pilihan lain.",
    "Setiap doa-ku punya namamu. Setiap rindu-ku pulangnya ke kamu.",
    "Elii, kamu bukan cuma pacarku. Kamu tujuan hatiku.",
    "Aku sayang kamu dengan cara yang makin hari makin besar.",
  ];

  const subtitles = [
    "Jalan kita mungkin panjang, tapi pilihanku selalu kamu.",
    "Kalau dunia ribut, aku tetap tenang karena kamu.",
    "Kamu bikin aku versi terbaik dari diriku.",
    "Malam terasa lebih hangat saat kamu ada di pikiranku.",
    "Terima kasih sudah jadi 'pulang' buat hatiku.",
    "Aku jatuh cinta tanpa lelah, karena kamu.",
  ];

  let idx = 0;
  let running = false;

  async function renderCurrent() {
    if (running) return;
    running = true;
    await typewriter(typeEl, quotes[idx], 20);
    if (subtitleEl) subtitleEl.textContent = subtitles[idx];
    running = false;
  }

  if (subtitleEl) subtitleEl.textContent = subtitles[idx];
  renderCurrent();

  if (nextBtn) {
    nextBtn.addEventListener("click", async () => {
      idx = (idx + 1) % quotes.length;
      await renderCurrent();
      spawnHearts(10);
    });
  }
}

// Simple confetti
function initConfettiCanvas() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return null;
  const ctx = canvas.getContext("2d", { alpha: true });
  return { canvas, ctx };
}

function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startConfetti(confetti, opts = {}) {
  if (!confetti) return;
  const { canvas, ctx } = confetti;
  if (!ctx) return;

  resizeCanvas(canvas);

  const duration = opts.duration ?? 3200;
  const start = performance.now();

  const colors = ["#ff4da6", "#ff86c7", "#ffd36e", "#41d17a", "#9b7bff"];
  const originX = window.innerWidth * (opts.originX ?? 0.5);
  const originY = window.innerHeight * (opts.originY ?? 0.35);

  const particles = [];
  const count = opts.count ?? 160;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.55;
    const speed = 3 + Math.random() * 10;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
      vy: Math.sin(angle) * speed * (0.6 + Math.random() * 0.8),
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      w: 6 + Math.random() * 10,
      h: 6 + Math.random() * 14,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
    });
  }

  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Gravity
    const g = 0.14;
    particles.forEach((p) => {
      p.vy += g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - t / duration);
    });

    particles.forEach((p) => {
      if (p.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (t < duration) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  requestAnimationFrame(frame);
}

function initPage1() {
  const input = document.getElementById("dateInput");
  const err = document.getElementById("dateError");
  const btn = document.getElementById("checkDateBtn");
  const bubble = document.getElementById("successBubble");

  if (!input || !btn) return;

  // Prefill hint but keep user control
  input.addEventListener("input", () => {
    if (err) err.textContent = "";
    const wrap = document.getElementById("dateWrap");
    if (wrap) wrap.classList.remove("shake");
  });

  btn.addEventListener("click", () => {
    const ok = isValidJadianDate(input.value);
    if (!ok) {
      if (err) err.innerHTML = "Hmm… coba lagi sayang. Kamu tulisnya belum tepat. <strong>Ingat: 18 Mei 2026.</strong>";
      spawnHearts(8);
      const wrap = document.getElementById("dateWrap");
      if (wrap) {
        wrap.classList.remove("shake");
        // Force reflow to restart animation
        void wrap.offsetWidth;
        wrap.classList.add("shake");
      }
      return;
    }

    if (bubble) {
      bubble.innerHTML = "Benar! Izin masuk diberikan penuh oleh hati aku. 💗";
    }
    sessionStorage.setItem("eli_access_page2", "yes");
    spawnHearts(22);
    window.setTimeout(() => {
      window.location.href = "page2.html";
    }, 850);
  });
}

function initPage2() {
  const hasAccess = sessionStorage.getItem("eli_access_page2") === "yes";
  if (!hasAccess) {
    window.location.href = "index.html";
    return;
  }

  const video = document.getElementById("romanticVideo");
  const playBtn = document.getElementById("playMusicBtn");
  const status = document.getElementById("musicStatus");

  if (!video) return;
  video.loop = true;

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const tryPlay = async () => {
    try {
      await video.play();
      setStatus(video.muted ? "Video berputar (mode mute)." : "Video romantis sedang berputar...");
      if (playBtn) playBtn.textContent = video.muted ? "Nyalakan Suara Video" : "Pause Video";
    } catch (_err) {
      setStatus("Tap tombol untuk memutar video.");
      if (playBtn) playBtn.textContent = "Putar Video";
    }
  };

  // Attempt autoplay after previous click interaction from page 1.
  tryPlay();

  if (playBtn) {
    playBtn.addEventListener("click", async () => {
      if (!video.paused && !video.muted) {
        video.pause();
        playBtn.textContent = "Putar Video";
        setStatus("Video dipause.");
        return;
      }
      video.muted = false;
      await tryPlay();
    });
  }
}

function initPage3() {
  const meterBar = document.getElementById("loveMeterBar");
  const meterValue = document.getElementById("meterValue");
  const clickBtn = document.getElementById("heartClickBtn");
  const clickMessage = document.getElementById("clickMessage");

  const promiseInput = document.getElementById("promiseInput");
  const savePromiseBtn = document.getElementById("savePromiseBtn");
  const promiseResult = document.getElementById("promiseResult");

  if (!meterBar || !clickBtn) return;

  const confetti = initConfettiCanvas();

  let value = 0; // 0..100
  const increment = 10;
  const target = 100;

  function updateUI() {
    const v = Math.max(0, Math.min(target, value));
    meterBar.style.width = `${v}%`;
    if (meterValue) meterValue.textContent = `${v}%`;

    if (clickMessage) {
      if (v >= 100) clickMessage.innerHTML = "Selesai… ini bukan sekadar cinta. Ini janji yang hidup. 💞";
      else if (v >= 70) clickMessage.innerHTML = "Kamu bikin aku meleleh… tinggal sedikit lagi. 💗";
      else if (v >= 40) clickMessage.innerHTML = "Oh Eliii… makin dalam makin romantis. ✨";
      else clickMessage.innerHTML = "Klik lagi ya… biar hatiku makin yakin. 🌷";
    }
  }

  updateUI();

  clickBtn.addEventListener("click", () => {
    if (value >= target) {
      spawnHearts(14);
      return;
    }

    value += increment;
    if (value > target) value = target;
    spawnHearts(10);
    updateUI();

    if (value >= target) {
      startConfetti(confetti, { duration: 3600, count: 200, originY: 0.28 });
      window.setTimeout(() => {
        const finalBtn = document.getElementById("finalGlowBtn");
        if (finalBtn) finalBtn.disabled = false;
      }, 200);
    }
  });

  if (savePromiseBtn && promiseInput && promiseResult) {
    savePromiseBtn.addEventListener("click", () => {
      const text = normalizeSpaces(promiseInput.value);
      if (!text) {
        promiseResult.innerHTML = "Tulis pelan-pelan ya… janji kecil kamu yang paling penting. 🌙";
        spawnHearts(7);
        return;
      }
      promiseResult.innerHTML = `Janji kamu tersimpan di hati: <strong>${escapeHtml(text)}</strong>`;
      promiseInput.value = "";
      spawnHearts(12);
    });
  }

  const glowBtn = document.getElementById("finalGlowBtn");
  if (glowBtn) {
    glowBtn.addEventListener("click", () => {
      startConfetti(confetti, { duration: 2800, count: 160, originY: 0.22 });
      spawnHearts(25);
    });
  }
}

function escapeHtml(s) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  initTypeRotator();

  const page = document.body?.dataset?.page;
  if (page === "1") initPage1();
  if (page === "2") initPage2();
  if (page === "3") initPage3();

  // Gentle welcome hearts
  if (Math.random() < 0.9) {
    // Delay to feel nicer
    window.setTimeout(() => spawnHearts(10), 250);
  }
});

