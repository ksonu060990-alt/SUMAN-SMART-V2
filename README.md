# SUMAN SMART v4 — Created by Sonu

A mobile-first study companion for Classes 9, 10 and 11.

## Features
- Class selector for 9, 10 and 11.
- Class 11 Commerce subject workspace: English, Urdu, Statistics, Accountancy, Economics, Business Administration (BA), Secretarial Practice (SP).
- Class 9 and 10 starter subject lists: English, Gujarati, Urdu, Mathematics, Science and Social Science.
- Daily motivation rotates by calendar date (not every refresh).
- Current news headlines through RSS feeds (BBC World, with The Hindu fallback).
- Gujarati-to-Urdu word/sentence meaning: small built-in offline starter dictionary plus AI translation for other entries.
- AI explanations, revision notes, exam-style questions, mind maps, quizzes, formula help, weekly timetable and daily study timetable.
- Focus timer, task checklist, flashcards, English vocabulary, exam countdown, notes and marks percentage tracker.
- Installable PWA with basic offline app-shell caching.

## Deploy from Android phone (GitHub + Netlify)
1. Download this ZIP and extract it on your phone using Files / ZArchiver.
2. On GitHub, create a repository named `suman-smart-v4`.
3. Open the repository and upload the **extracted files and folders**, not the ZIP file itself. Keep `netlify/functions/` folder structure unchanged.
4. On Netlify, choose **Add new project → Import an existing project → GitHub**.
5. Select `suman-smart-v4`. Leave build command blank and set publish directory to `.`. The included `netlify.toml` specifies the Functions directory.
6. Deploy. Open the Netlify URL on your phone.

## Enable AI and Gujarati translation for words outside the starter dictionary
1. Open Netlify site settings / project configuration → Environment variables.
2. Add `OPENAI_API_KEY` and paste your API key as the value.
3. Optional: add `OPENAI_MODEL` with `gpt-4.1-mini`.
4. Save and trigger a new deploy.
5. Never place the key in frontend files, GitHub, or a public message. API usage may cost money; check usage limits first.

## Important limitations
- Without `OPENAI_API_KEY`, AI-powered explanations, generated quizzes, study plans, and non-dictionary Gujarati-to-Urdu translation will not work. The built-in starter dictionary works offline.
- The included subject lists are starter guidance, not a verified full GSEB chapter-by-chapter syllabus. Confirm exact chapters and exam pattern from the current school/board textbook.
- News needs internet and depends on public RSS feeds; feed providers can change or temporarily fail.
- Checklist, flashcards, notes, marks and activity streak are saved in local browser storage on that device only. There are no logins, cloud backup or sync.
- Do not store private student details or sensitive school records in this starter app.
- The streak counts days when the student adds a task or starts a focus session; it is not a measure of learning quality.

## Project layout
- `index.html`, `style.css`, `app.js`
- `netlify/functions/study-ai.js` — server-side AI proxy
- `netlify/functions/news.js` — RSS headline proxy
- `manifest.webmanifest`, `service-worker.js`, `icon.svg`
- `netlify.toml`
