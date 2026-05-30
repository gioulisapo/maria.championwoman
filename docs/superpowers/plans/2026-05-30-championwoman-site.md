# Championwoman Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub Pages-ready celebration website for Maria Giouli, Championwoman of the Open Sea, centered on a circular video loop that crossfades from `win.mp4` to `interview.mp4`.

**Architecture:** Plain static frontend at the repository root. `index.html` owns semantic content, `styles.css` owns visual design and responsive layout, and `script.js` owns video sequencing plus interactive photo effects.

**Tech Stack:** HTML, CSS, vanilla JavaScript, local JPEG/MP4 media.

---

### Task 1: Static Site Shell

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Create: `.gitignore`

- [x] Create a GitHub Pages-friendly root document that references local CSS, JS, videos, and images.
- [x] Build the Championwoman aquatic arcade layout with central circular video, orbiting photos, dolphins, bubbles, crown, and copy.
- [x] Add interactive JavaScript for video crossfade, sound toggle, photo spotlight, confetti, bubbles, and pointer-reactive lighting.
- [x] Replace the race facts scoreboard with the “A champion / A woman / A Championwoman” chant.
- [x] Remove the explanatory bottom feature strip.
- [x] Remove the crown/pyramid overlay and video-loop label from the portal.
- [x] Try sound on by default with browser fallback, and keep Championwoman on one line.
- [x] Add `.gitignore` entries for local brainstorming artifacts and extensionless duplicate source media.

### Task 2: Verification And Publish

**Files:**
- Modify: repository root git state

- [x] Run a local static server and inspect that the page loads.
- [x] Verify no HTML/CSS/JS syntax errors appear in the browser console where possible.
- [ ] Commit deployable files and media.
- [ ] Push to `origin main` for GitHub Pages deployment.
