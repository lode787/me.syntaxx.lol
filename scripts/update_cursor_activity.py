#!/usr/bin/env python3
"""Pull public Cursor profile stats into cursor-activity.json."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

HANDLE = os.environ.get("CURSOR_HANDLE", "syntaxx")
PROFILE_URL = f"https://cursor.com/@{HANDLE}"
REPO_ROOT = Path(__file__).resolve().parents[1]
OUTPUT = REPO_ROOT / "cursor-activity.json"
USER_AGENT = "me.syntaxx.lol activity sync (+https://me.syntaxx.lol)"


def fetch_profile_html(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        raise SystemExit(f"Cursor profile returned HTTP {exc.code}") from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"Could not fetch Cursor profile: {exc.reason}") from exc


def parse_profile(html: str, handle: str) -> dict:
    text = html.replace('\\"', '"')
    marker = f'"handle":"{handle}"'
    idx = text.find(marker)
    if idx < 0:
        raise SystemExit(f'Could not find handle "{handle}" in Cursor profile HTML')

    start = text.rfind("{", 0, idx)
    if start < 0:
        raise SystemExit("Could not find profile object in Cursor HTML")

    try:
        profile, _ = json.JSONDecoder().raw_decode(text, start)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Cursor profile JSON was malformed: {exc}") from exc

    stats = profile.get("stats") or {}
    counts = profile.get("activityCounts")
    if not isinstance(stats, dict) or not isinstance(counts, list):
        raise SystemExit("Cursor profile was missing stats or activityCounts")

    required = (
        "mostActiveMonth",
        "mostActiveDay",
        "longestStreak",
        "currentStreak",
        "agentsLocal",
        "agentsCloud",
        "longestAgentSeconds",
    )
    missing = [key for key in required if key not in stats]
    if missing:
        raise SystemExit(f"Cursor stats missing fields: {', '.join(missing)}")

    cleaned = []
    for row in counts:
        if not isinstance(row, dict):
            continue
        date = row.get("date")
        count = row.get("count")
        if isinstance(date, str) and isinstance(count, (int, float)):
            cleaned.append({"date": date, "count": int(count)})
    if not cleaned:
        raise SystemExit("Cursor activityCounts was empty")
    cleaned.sort(key=lambda row: row["date"])

    return {
        "handle": profile.get("handle") or handle,
        "displayName": profile.get("displayName") or handle,
        "profile": PROFILE_URL,
        "totalTokens": sum(row["count"] for row in cleaned),
        "createdAt": profile.get("joinedDate"),
        "mostActiveMonth": stats["mostActiveMonth"],
        "mostActiveDay": stats["mostActiveDay"],
        "longestStreak": int(stats["longestStreak"]),
        "currentStreak": int(stats["currentStreak"]),
        "agentsLocal": int(stats["agentsLocal"]),
        "agentsCloud": int(stats["agentsCloud"]),
        "longestAgentSeconds": int(stats["longestAgentSeconds"]),
        "activityCounts": cleaned,
    }


def write_if_changed(path: Path, data: dict) -> bool:
    rendered = json.dumps(data, indent=2) + "\n"
    if path.exists() and path.read_text(encoding="utf-8") == rendered:
        return False
    path.write_text(rendered, encoding="utf-8")
    return True


def main() -> int:
    html = fetch_profile_html(PROFILE_URL)
    data = parse_profile(html, HANDLE)
    changed = write_if_changed(OUTPUT, data)
    days = len(data["activityCounts"])
    state = "updated" if changed else "unchanged"
    print(
        f"{state}: {data['currentStreak']}d streak, "
        f"{days} days, {data['totalTokens']} tokens"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
