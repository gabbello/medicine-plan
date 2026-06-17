# MedPlan

A lightweight, client-side PWA for building and tracking personal medication schedules. No backend, no accounts, no data leaves the device.

## What it does

Users create a medication plan in two steps: select which periods of the day they take medicine (morning, afternoon, evening), then add each medicine with its dose, schedule, duration, and an optional note. Once submitted, the plan is locked and displayed as a tabbed dashboard. The correct tab is auto-selected based on the device's local time. Users can tap a medicine card to mark it as taken for the session.

## Who it's for

People managing multi-medicine regimens — typically post-surgery or chronic condition patients — who want a simple, private, always-available reference on their phone without creating an account or relying on connectivity.

## Tech stack

Single HTML file + manifest + service worker. No framework, no build step, no dependencies. Deployed as a static site on Netlify. Installable as a PWA on Android and iOS.

## Files

```
index.html       — entire app (markup, styles, logic)
manifest.json    — PWA metadata (name, icons, theme color, start_url)
sw.js            — minimal service worker (network-first fetch)
icon-192.png     — PWA icon
icon-512.png     — PWA icon (large)
```

## Deploy

Drop all five files (or a zip containing them) onto [Netlify Drop](https://app.netlify.com/drop). Netlify renames `index.html` automatically and serves from `/`. `start_url` in `manifest.json` must be `/` for the PWA shortcut to work correctly.
