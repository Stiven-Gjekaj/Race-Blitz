# Race‑Blitz

A lightweight single‑page racing manager built with vanilla HTML/CSS/JS (ES modules). Runs entirely in the browser with localStorage persistence and hash routing.

## Routes
- `#garage`: manage cars, open in Tuning, create/rename/sell.
- `#shop`: browse categories, buy/sell parts.
- `#tuning`: select parts and adjust tunables; live derived stats and deltas; warnings.
- `#championships`: pick event, see weather preview and strategy; start race.
- `#leaderboard`: local highscores (disabled if Debug used).
- `#saveload`: export/import Base64 save; hard reset.
- `#debug`: debug tools; enabling permanently disables scores for the save.

## Controls
- Debug toggle: `Ctrl + \`` (backtick). First toggle marks the save as debugged.

## Save/Load
- Saves are stored under `RB_STATE_V1` in localStorage.
- Use Save/Load view to export/import a Base64 string.

## Data
- Seed parts/tracks/ladder in `js/parts.js`, `js/tracks.js`, `js/ladder.js`.
- Core systems: stats, weather, strategy, sim in `js/*.js`; views in `js/views/`.

## Credits
Made by Stiven Gjekaj
