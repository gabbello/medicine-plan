# Story Decomposition: Daily Medicine Taken Status Persistence

## INVEST Analysis

### Abstract Task: "Daily Medicine Taken Status Persistence"

**Analysis Dimensions**:
- **Core Responsibility**: Allow a user to mark that a medicine was taken for a specific day and interval, and keep that status visible across new sessions on the same device until the day changes.
- **Primary Operations**: Mark a medicine as taken, keep the status during the current day across browser sessions, reset the status automatically on the next day.
- **Key Constraints**: The status must be stored locally without growing over time; only the current day’s status should be preserved.
- **Technical Complexity**: Low - the feature is focused on simple local persistence and day-based reset logic.
- **Business Complexity**: Low - the user experience is straightforward and centered on daily medication tracking.

### INVEST Evaluation
- ✅ **Independent**: Yes - this feature can be delivered as a self-contained capability without backend support.
- ✅ **Negotiable**: Yes - the exact visual treatment of the taken state can be refined with the team.
- ✅ **Valuable**: Yes - users can reliably keep track of what was already taken during the current day.
- ✅ **Estimable**: Yes - the scope is narrow and bounded by daily persistence and reset behavior.
- ✅ **Small**: Yes - the story fits within a short delivery window.
- ✅ **Testable**: Yes - the acceptance criteria define clear user-visible outcomes.

**Conclusion**: Ready as-is.

---

## [STORY-003-001] Daily Medicine Taken Status Persistence

### Background

Users need a simple way to record when they have already taken a medicine for a specific day and interval. Because the application is currently local-only, this status must remain available in future sessions on the same device without relying on a backend or account system.

This story focuses on keeping the taken state for the current day only, so the user experience remains consistent while the application stays lightweight over time.

### Business Value
- Help users keep track of medicines they already took during the current day.
- Prevent users from needing to re-mark a medicine after refreshing the app or reopening it on the same device.
- Keep the experience simple and lightweight without accumulating unnecessary stored history.

### Dependencies and Assumptions
- **Prerequisites**: The user can already see medicines and their scheduled intervals in the app.
- **Data assumptions**: Each medicine can be identified reliably, and the app already knows which interval it belongs to.
- **Integration points**: No external services are required; persistence is handled locally in the browser.
- **Business constraints**: The feature must work without a backend and must not store history for more than the current day.

### Scope In
- The user can mark a medicine as taken for the current day and interval.
- The taken state remains available in later sessions on the same device for the same day.
- The taken state resets automatically when the day changes.
- The storage approach keeps only the current day’s status and removes older day data.

### Scope Out
- Synchronization across multiple devices.
- Long-term history of taken medicines.
- Backend storage or account-based persistence.
- Shared or collaborative medication tracking.

### Acceptance Criteria

#### AC1: Taken state is preserved within the current day
**Given** a user has opened the app on a device and sees a medicine that is not yet marked as taken for today’s interval  
**When** the user clicks to mark that medicine as taken  
**Then** the medicine remains marked as taken for the rest of the current day even if the user refreshes the page or opens the app again in a new session on the same device

#### AC2: Taken state resets on the next day
**Given** a user has marked a medicine as taken for a specific day  
**When** the app is opened again on the next day  
**Then** that medicine is no longer shown as taken unless the user marks it again for the new day

#### AC3: Status is scoped to the correct medicine and interval
**Given** a user has marked one medicine as taken for a specific interval  
**When** the user views the same medicine in another interval or a different medicine in the list  
**Then** only the intended medicine and interval remains marked as taken, and the others stay unchanged

#### AC4: Storage remains lightweight over time
**Given** a user has used the app for several days  
**When** the app saves the taken status information  
**Then** it keeps only the current day’s status and does not keep growing with old day data over time

#### AC5: The user can toggle the taken state back off
**Given** a user has marked a medicine as taken for the current day  
**When** the user clicks the same action again  
**Then** the medicine is returned to the not-taken state for that day and the saved status is updated accordingly

#### Non-Functional Expectations
- The feature must feel immediate and reliable during everyday use.
- The storage approach must remain simple enough to avoid unnecessary growth in browser storage over time.
