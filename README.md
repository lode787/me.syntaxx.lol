# me.syntaxx.lol

Personal page for the person behind [Syntaxx](https://syntaxx.lol).

## Local

Any static server from this folder works:

```bash
npx --yes serve .
```

Then open the printed local URL.

## Publish

The site is static. GitHub Pages from the `main` branch root is enough.

1. Push this repo to `https://github.com/lode787/me.syntaxx.lol.git`
2. In the repo: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**
3. At your DNS host, add a CNAME:

   | Type  | Name | Value                 |
   | ----- | ---- | --------------------- |
   | CNAME | `me` | `lode787.github.io.`  |

4. In Pages, set the custom domain to `me.syntaxx.lol` and wait for HTTPS.

The `CNAME` file in this repo already points at `me.syntaxx.lol`.

## Cursor graph

The cube graph reads `cursor-activity.json`. That file is a snapshot of the public profile at [cursor.com/@syntaxx](https://cursor.com/@syntaxx). GitHub Pages cannot call Cursor from the browser, so a workflow refreshes the snapshot instead:

- every 6 hours
- or anytime from the repo: **Actions → Update Cursor activity → Run workflow**

After the workflow commits a change, Pages rebuilds and a refresh shows the new cubes.

```bash
python scripts/update_cursor_activity.py
```

## Edit the copy

Name, bio, and links live in `index.html`. Clock timezone is `Europe/Brussels` in `script.js`.
