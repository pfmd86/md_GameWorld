# md_GameWorld

>A small collection of lightweight, single-file browser games focused on learning and quick fun.

## Games Included
- **Time** — a reaction / sequencing game that trains time-reading and quick responses.
- **Math** — mental arithmetic challenges with configurable difficulty and score tracking.
- **German** — vocabulary practice that uses speech synthesis for listening and speaking drills.
- **Memory** — classic memory match with emoji themes, timers and best-score persistence.

Each game is implemented with plain HTML/CSS/JavaScript (no frameworks) and lives in its own folder.

## Quick Start
Prerequisites: a modern browser. To run locally you can serve the folder with any static server, for example:

```bash
# using node http-server (install with: npm i -g http-server)
http-server -c-1 .

# or using Python 3
python -m http.server 8000
```

Then open `http://localhost:8080` (or `:8000`) and navigate to a game folder.

## Development
- Lint JavaScript with ESLint (project already includes a config):

```bash
npm install
npm run lint
```

- Edit the per-game HTML and `js/*.js` files. The codebase favors attaching event listeners from JS rather than inline `onclick` handlers.

## Contributing
- Send PRs for bug fixes, accessibility improvements, or new games.
- Run `npm run lint` before opening a PR and keep changes focused.

## License
This repository includes an open source license in `LICENSE`.

## Support
If you enjoy the project, consider supporting development:

[Buy Me a Coffee](https://www.buymeacoffee.com/pfmd86)

---
Made with ❤️ — Mathias Denzin