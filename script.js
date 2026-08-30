const I18N = {
  en: {
    langBtn: "BE",
    themeToLight: "White",
    themeToDark: "Dark",
    headline: "Hey, I'm <em>Louis</em>.",
    lede: "22 years old, living in Belgium. Born and raised in Lier, AKA Lierke Plezierke.",
    bio: "Cat person, code person. I build things for the fun of building them, whether anyone ends up using them or not. Music is non-negotiable, the harder the better: Tekk, Uptempo, that whole corner. I'm still working out what a portfolio is supposed to look like, but Syntaxx and Serene got made in the meantime.",
    cursorLove: "Most days look the same: music on, Cursor open, something getting built. Honestly, that's the whole setup.",
    email: "Email me",
    github: "GitHub",
    coffee: "Buy a coffee",
    now: "Age",
    nowValue: "22",
    based: "From",
    basedValue: "Lier, BE",
    localTime: "Local time",
    graphTitle: "The days I ship in Cursor",
    graphLede: "Every cube is a day I spent building in Cursor, pulled straight from my profile and repainted in this site's lilac. The live version lives at <a href=\"https://cursor.com/@syntaxx\">@syntaxx</a>.",
    longestStreak: "Longest streak",
    currentStreak: "Current streak",
    agents: "Agents",
    elsewhere: "Elsewhere",
    product: "Product",
    productHint: "The Discord bot I built. Features, economy, automod.",
    also: "Also",
    alsoHint: "Private mood tracker. Nothing leaves the device.",
    cursorHint: "The official cube graph and streaks.",
    nowPlaying: "On in the background",
    volume: "Volume",
    play: "Play",
    pause: "Pause",
    earlier: "Earlier weeks",
    later: "Later weeks",
    less: "Less",
    more: "More",
    active: "active",
    quiet: "quiet",
    graphFail: "Graph data did not load. The live one is on <a href=\"https://cursor.com/@syntaxx\">cursor.com/@syntaxx</a>.",
    longestAgent: "longest",
  },
  be: {
    langBtn: "ENG",
    themeToLight: "Wit",
    themeToDark: "Donker",
    headline: "Hey, ik ben <em>Louis</em>.",
    lede: "22 jaar, woont in België. Geboren en getogen in Lier, AKA Lierke Plezierke.",
    bio: "Kattenmens, codemens. Ik bouw dingen voor het plezier van het bouwen, of iemand ze nu gebruikt of niet. Muziek is niet onderhandelbaar, hoe harder hoe beter: Tekk, Uptempo, heel dat hoekje. Ik zoek nog uit hoe een portfolio eruit hoort te zien, maar Syntaxx en Serene zijn er ondertussen al.",
    cursorLove: "De meeste dagen zien er hetzelfde uit: muziek aan, Cursor open, iets aan het bouwen. Eerlijk, dat is de hele setup.",
    email: "Mail mij",
    github: "GitHub",
    coffee: "Koop een koffie",
    now: "Leeftijd",
    nowValue: "22",
    based: "Van",
    basedValue: "Lier, BE",
    localTime: "Lokale tijd",
    graphTitle: "De dagen dat ik in Cursor ship",
    graphLede: "Elke kubus is een dag dat ik in Cursor aan het bouwen was, rechtstreeks van mijn profiel en hergeschilderd in de lila van deze site. De live versie staat op <a href=\"https://cursor.com/@syntaxx\">@syntaxx</a>.",
    longestStreak: "Langste streak",
    currentStreak: "Huidige streak",
    agents: "Agents",
    elsewhere: "Elders",
    product: "Product",
    productHint: "De Discord-bot die ik bouwde. Features, economie, automod.",
    also: "Ook",
    alsoHint: "Privé mood-tracker. Niets verlaat je toestel.",
    cursorHint: "De officiële kubusgrafiek en streaks.",
    nowPlaying: "Op de achtergrond",
    volume: "Volume",
    play: "Afspelen",
    pause: "Pauze",
    earlier: "Eerdere weken",
    later: "Latere weken",
    less: "Minder",
    more: "Meer",
    active: "actief",
    quiet: "stil",
    graphFail: "Grafiekdata laadde niet. De live versie staat op <a href=\"https://cursor.com/@syntaxx\">cursor.com/@syntaxx</a>.",
    longestAgent: "langste",
  },
};

const heatState = {
  days: [],
  counts: {},
  max: 0,
  offset: 0,
  visibleWeeks: 16,
  weeks: 0,
};

function currentLang() {
  return document.documentElement.lang === "nl-BE" ? "be" : "en";
}

function t(key) {
  return I18N[currentLang()][key] || I18N.en[key] || key;
}

function applyI18n() {
  const pack = I18N[currentLang()];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!pack[key]) return;
    el.innerHTML = pack[key];
  });

  const langBtn = document.getElementById("lang-btn");
  if (langBtn) langBtn.textContent = pack.langBtn;

  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    const light = document.documentElement.dataset.theme === "light";
    themeBtn.textContent = light ? pack.themeToDark : pack.themeToLight;
  }

  const playBtn = document.getElementById("play-btn");
  const audio = document.getElementById("bg-audio");
  if (playBtn && audio) {
    playBtn.setAttribute("aria-label", audio.paused ? pack.play : pack.pause);
  }

  const prev = document.getElementById("heat-prev");
  const next = document.getElementById("heat-next");
  if (prev) prev.setAttribute("aria-label", pack.earlier);
  if (next) next.setAttribute("aria-label", pack.later);

  if (heatState.days.length) renderHeatWindow();
}

function setLang(lang) {
  document.documentElement.lang = lang === "be" ? "nl-BE" : "en";
  try {
    localStorage.setItem("me-lang", lang);
  } catch (_) {}
  applyI18n();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "light" ? "#f3eef3" : "#0a0a0b";
  try {
    localStorage.setItem("me-theme", theme);
  } catch (_) {}
  applyI18n();
}

const brusselsTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Brussels",
  hour: "2-digit",
  minute: "2-digit",
});

function paintClock() {
  const el = document.getElementById("local-time");
  if (!el) return;
  const now = new Date();
  el.textContent = brusselsTime.format(now);
  el.dateTime = now.toISOString();
}

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
paintClock();
setInterval(paintClock, 15_000);

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isoDay(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function levelFor(count, max) {
  if (!count || !max) return 0;
  const ratio = Math.log(count) / Math.log(max);
  if (ratio < 0.35) return 1;
  if (ratio < 0.55) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function formatAgentTime(seconds) {
  return `${(seconds / 3600).toFixed(1)}h`;
}

function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function measureVisibleWeeks(root) {
  const width = root.clientWidth || 320;
  const weekWidth = 15;
  return Math.max(8, Math.floor((width - 22) / weekWidth));
}

function dayFormatter() {
  return new Intl.DateTimeFormat(currentLang() === "be" ? "nl-BE" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthFormatter() {
  return new Intl.DateTimeFormat(currentLang() === "be" ? "nl-BE" : "en-GB", {
    month: "short",
    year: "numeric",
  });
}

async function paintHeatmap() {
  const root = document.getElementById("heat");
  if (!root) return;

  let data;
  try {
    const res = await fetch("/cursor-activity.json", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    data = await res.json();
  } catch {
    root.innerHTML = `<p class="lede">${t("graphFail")}</p>`;
    return;
  }

  heatState.counts = Object.fromEntries(
    (data.activityCounts || []).map((row) => [row.date, row.count]),
  );
  heatState.max = Math.max(0, ...Object.values(heatState.counts));
  heatState.offset = 0;

  const longest = document.getElementById("stat-longest");
  const current = document.getElementById("stat-current");
  const agents = document.getElementById("stat-agents");
  if (longest) longest.textContent = `${data.longestStreak}d`;
  if (current) current.textContent = `${data.currentStreak}d`;
  if (agents) {
    const total = (data.agentsLocal || 0) + (data.agentsCloud || 0);
    agents.textContent = `${total} · ${t("longestAgent")} ${formatAgentTime(data.longestAgentSeconds)}`;
  }

  const today = startOfDay(new Date());
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
  const days = [];
  const cursor = new Date(weekEnd);
  cursor.setDate(cursor.getDate() - 7 * 52 + 1);
  while (cursor <= weekEnd) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  heatState.days = days;
  heatState.weeks = Math.ceil(days.length / 7);
  renderHeatWindow();
}

function renderHeatWindow() {
  const root = document.getElementById("heat");
  if (!root || !heatState.days.length) return;

  heatState.visibleWeeks = measureVisibleWeeks(root);
  const maxOffset = Math.max(0, heatState.weeks - heatState.visibleWeeks);
  heatState.offset = Math.min(Math.max(0, heatState.offset), maxOffset);

  const startWeek = heatState.weeks - heatState.visibleWeeks - heatState.offset;
  const startDay = Math.max(0, startWeek * 7);
  const slice = heatState.days.slice(startDay, startDay + heatState.visibleWeeks * 7);

  const months = [];
  let lastMonth = -1;
  const weeks = heatState.visibleWeeks;
  for (let w = 0; w < weeks; w += 1) {
    const first = slice[w * 7];
    if (!first) continue;
    const month = first.getMonth();
    if (month !== lastMonth) {
      months.push({ index: w, label: first.toLocaleString(currentLang() === "be" ? "nl-BE" : "en-GB", { month: "short" }) });
      lastMonth = month;
    }
  }

  const monthRow = document.createElement("div");
  monthRow.className = "heat__month-row";
  months.forEach((month, i) => {
    const next = months[i + 1]?.index ?? weeks;
    const label = document.createElement("span");
    label.textContent = month.label;
    label.style.setProperty("--span", String(Math.max(1, next - month.index)));
    monthRow.append(label);
  });

  const monthsWrap = document.createElement("div");
  monthsWrap.className = "heat__months";
  monthsWrap.append(document.createElement("span"), monthRow);

  const dows = document.createElement("div");
  dows.className = "heat__dows";
  ["", "M", "", "W", "", "F", ""].forEach((label) => {
    const row = document.createElement("span");
    row.textContent = label;
    dows.append(row);
  });

  const grid = document.createElement("div");
  grid.className = "heat__grid";
  const fmt = dayFormatter();
  slice.forEach((date) => {
    const key = isoDay(date);
    const count = heatState.counts[key] || 0;
    const cell = document.createElement("span");
    cell.className = "heat__cell";
    cell.dataset.level = String(levelFor(count, heatState.max));
    cell.dataset.date = key;
    cell.dataset.count = String(count);
    cell.title = `${fmt.format(date)} · ${count ? t("active") : t("quiet")}`;
    grid.append(cell);
  });

  const body = document.createElement("div");
  body.className = "heat__body";
  body.append(dows, grid);

  const legend = document.createElement("div");
  legend.className = "heat__legend";
  legend.innerHTML = `${t("less")} <i></i><i class="heat__cell" data-level="1"></i><i class="heat__cell" data-level="2"></i><i class="heat__cell" data-level="3"></i><i class="heat__cell" data-level="4"></i> ${t("more")}`;

  root.replaceChildren(monthsWrap, body, legend);
  bindHeatTooltip(grid);

  const range = document.getElementById("heat-range");
  if (range && slice.length) {
    const mf = monthFormatter();
    range.textContent = `${mf.format(slice[0])}  →  ${mf.format(slice[slice.length - 1])}`;
  }

  const prev = document.getElementById("heat-prev");
  const next = document.getElementById("heat-next");
  if (prev) prev.disabled = heatState.offset >= maxOffset;
  if (next) next.disabled = heatState.offset <= 0;
}

function bindHeatTooltip(grid) {
  const tip = document.getElementById("heat-tip");
  if (!tip) return;
  let instant = false;
  const fmt = dayFormatter();

  grid.addEventListener("pointerover", (event) => {
    const cell = event.target.closest(".heat__cell");
    if (!cell || !grid.contains(cell) || !cell.dataset.date) return;
    const count = Number(cell.dataset.count || 0);
    const when = new Date(`${cell.dataset.date}T12:00:00`);
    tip.hidden = false;
    tip.textContent = `${fmt.format(when)} · ${count ? t("active") : t("quiet")}`;
    const box = cell.getBoundingClientRect();
    tip.style.left = `${box.left + box.width / 2}px`;
    tip.style.top = `${box.top}px`;
    if (instant) tip.style.transitionDuration = "0ms";
    requestAnimationFrame(() => tip.classList.add("is-on"));
    instant = true;
  });

  grid.addEventListener("pointerleave", () => {
    tip.classList.remove("is-on");
    tip.style.transitionDuration = "";
    instant = false;
    window.setTimeout(() => {
      if (!tip.classList.contains("is-on")) tip.hidden = true;
    }, 140);
  });
}

function bindHeatNav() {
  document.getElementById("heat-prev")?.addEventListener("click", () => {
    heatState.offset += 1;
    renderHeatWindow();
  });
  document.getElementById("heat-next")?.addEventListener("click", () => {
    heatState.offset -= 1;
    renderHeatWindow();
  });
  window.addEventListener("resize", () => {
    if (heatState.days.length) renderHeatWindow();
  });
}

function bindPrefs() {
  document.getElementById("lang-btn")?.addEventListener("click", () => {
    setLang(currentLang() === "en" ? "be" : "en");
  });
  document.getElementById("theme-btn")?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  });
}

function bindPlayer() {
  const audio = document.getElementById("bg-audio");
  const playBtn = document.getElementById("play-btn");
  const playIcon = document.getElementById("play-icon");
  const seek = document.getElementById("seek");
  const vol = document.getElementById("vol");
  const cur = document.getElementById("t-cur");
  const dur = document.getElementById("t-dur");
  if (!audio || !playBtn || !seek || !vol) return;

  audio.volume = Number(vol.value);
  let userPaused = false;

  function paintPlay() {
    playIcon.textContent = audio.paused ? "▶" : "❚❚";
    playBtn.setAttribute("aria-label", audio.paused ? t("play") : t("pause"));
  }

  function startSong() {
    if (userPaused) return Promise.resolve();
    return audio.play().then(paintPlay).catch(() => {});
  }

  function paintTime() {
    if (cur) cur.textContent = formatClock(audio.currentTime);
    if (dur) dur.textContent = formatClock(audio.duration);
    if (!seek.dataset.dragging) {
      const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
      seek.value = String(Math.round(ratio * 1000));
    }
  }

  playBtn.addEventListener("click", async () => {
    if (audio.paused) {
      userPaused = false;
      await startSong();
    } else {
      userPaused = true;
      audio.pause();
    }
    paintPlay();
  });

  vol.addEventListener("input", () => {
    audio.volume = Number(vol.value);
  });

  const seekTo = () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
  };
  seek.addEventListener("pointerdown", () => {
    seek.dataset.dragging = "1";
  });
  seek.addEventListener("pointerup", () => {
    delete seek.dataset.dragging;
    seekTo();
  });
  seek.addEventListener("input", seekTo);
  seek.addEventListener("change", seekTo);

  audio.addEventListener("play", paintPlay);
  audio.addEventListener("pause", paintPlay);
  audio.addEventListener("timeupdate", paintTime);
  audio.addEventListener("loadedmetadata", () => {
    paintTime();
    startSong();
  });
  audio.addEventListener("canplay", startSong);

  const unlock = (event) => {
    if (event.target.closest?.("#play-btn")) return;
    startSong();
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);

  paintPlay();
  paintTime();
  startSong();
}

bindPrefs();
bindHeatNav();
bindPlayer();
applyI18n();
paintHeatmap();
