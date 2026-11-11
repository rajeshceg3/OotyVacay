# Verify OotyVacay
Ooty Vacay - static trip planner for Ooty with map and location modal.
## Launch
Any static file server from the repo root, e.g. python3 -m http.server.
## Doctor
`python3 .cursor/skills/verify-ooty-vacay/verify.py`
## Drive
Serves the static site and renders it in headless Chromium asserting the boot marker, modal container, and zero JS console errors.
## Evidence
`.cursor/skills/verify-ooty-vacay/evidence.json`
## Cleanup
Static/streamlit server terminated after the render.
## Known boundaries
Render smoke only; scene quality unverified. Playwright e2e configs are not exercised (chromium-only sandbox).
