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
