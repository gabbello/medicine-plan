# Architecture

## Principles

Everything runs client-side. There is no server, no API, no build pipeline. The entire app is one HTML file. All state lives either in `localStorage` or in JS variables for session-only state (e.g. "taken" card state). Adding a backend or bundler is an intentional future decision, not an oversight.

## Screen flow

```
HOME
 └─ "Create my plan" ──→ STEP 1

STEP 1 (period selection)
 └─ Next ──→ STEP 2

STEP 2 (add medicines)
 ├─ "Add medicine" ──→ appends to draft, stays on STEP 2
 ├─ "← Back" ──→ STEP 1
 └─ "Submit plan" ──→ writes to localStorage, ──→ DASHBOARD

DASHBOARD
 └─ "Reset plan" + confirm ──→ clears localStorage ──→ HOME

On any page load:
 └─ localStorage has status=active ──→ skip to DASHBOARD
 └─ otherwise ──→ HOME
```

## localStorage

Single key: `medplan_v1`. Value is a JSON object:

```json
{
  "status": "active",
  "periods": ["morning", "evening"],
  "medicines": [
    {
      "id": "abc123",
      "name": "Tritace",
      "amount": "0.5",
      "unit": "tablet",
      "note": "half dose if BP < 100",
      "periods": ["evening"],
      "duration": {
        "type": "days",
        "days": 30
      }
    }
  ]
}
```

`status` is either `"active"` (submitted plan) or absent/null (no plan). There is no `"draft"` status persisted — draft state lives only in the `draft` JS variable during setup and is discarded on page reload.

`periods` at the top level is the ordered list of periods the user selected in step 1. Order is always `morning → afternoon → evening`. `periods` on each medicine is the subset of those periods when that medicine is taken.

`duration.type` is either `"ongoing"` or `"days"`. If `"days"`, `duration.days` is a positive integer.

## JS structure

All logic is in a single `<script>` tag at the bottom of `index.html`, organized into sections marked with comments:

- **STATE** — `draft` object (periods + medicines being built), `loadPlan()`, `savePlan()`, `uuid()`
- **ROUTING** — `showScreen(id)`, `goToStep1()`, `goToStep2()`
- **STEP 1** — `togglePeriod(btn)`
- **STEP 2** — `buildPeriodChecks()`, `selectDuration()`, `resetMedForm()`, `addMedicine()`, `deleteMedicine()`, `renderMedicineList()`, `updateSubmitBtn()`, `submitPlan()`
- **DASHBOARD** — `buildDashboard(plan)`, `switchTab(period)`, `autoSelectTab(periods)`
- **RESET** — `showResetDialog()`, `hideResetDialog()`, `confirmReset()`
- **VISIBILITY CHANGE** — re-runs `autoSelectTab` when app returns to foreground
- **INIT** — immediately-invoked function that reads localStorage and routes to the correct screen on load

## Tab auto-selection logic

Runs on load and on every `visibilitychange` event (app returning to foreground):

```
hour >= 19 and plan has evening  → evening
hour >= 12 and plan has afternoon → afternoon
plan has morning                 → morning
fallback                         → first period in plan
```

Time boundaries: morning 00:00–11:59, afternoon 12:00–18:59, evening 19:00–23:59.

## "Taken" state

Card taken state (greyed out, ✓ suffix) is toggled by tapping a card. It is stored as a CSS class (`taken`) on the DOM element only — it is intentionally not persisted. It resets when the app is reopened or when `autoSelectTab` re-renders tabs. This is by design: the schedule repeats daily.

## PWA

`manifest.json` sets `display: standalone`, `start_url: /`, and `theme_color: #2d6a4f`. `sw.js` is a minimal network-first service worker — it does not cache aggressively; its sole purpose is satisfying the PWA installability requirement. If offline support becomes a requirement, the service worker should be expanded with a cache-first strategy.

## Constraints to be aware of

- `index.html` is the only source of truth. There is no separate CSS or JS file.
- The `draft` variable is reset on every call to `goToStep1()`. Navigating back from step 2 to step 1 clears all added medicines — this is intentional.
- Once a plan has `status: active`, the UI has no edit mode. The only mutation available is full reset. This is also intentional: it prevents partial edits that could leave the plan in an inconsistent state.
- `uuid()` uses `Math.random()` — not cryptographically secure, but sufficient for local IDs.
