# SPDD Analysis: Share Plan Link Generation

## Original Business Requirement

````markdown
# Story Decomposition: Share Plan Link Generation

## Source Requirement

```text
Thius tool does not have a backend/database, it uses only local storage for all created plans.
As a customer, i want to be able to create a plan and then share the link of the plan to anther device/user/instance. This should work by encoding the entire plan into some variable into the url

Acceptance criteria:
Link can be used on anther browser/device/session and all settings will be visible.
customer should be able to do an action to click somewhere to generate the link
if the customer further changews the plan, he needs to get a new link (to have new pararmters)
```

## INVEST Analysis

### Abstract Task: "Share Plan Link Generation"

**Analysis Dimensions**:
- **Core Responsibility**: Allow a customer to create a shareable link that contains the complete current medicine plan so it can be opened in another browser, device, session, or by another user without a backend or database.
- **Primary Operations**: Generate a share link for the current plan, open a shared link, restore all plan settings from the shared link.
- **Key Constraints**: The complete shared plan must be represented in the URL; the link reflects the plan state at the moment it is generated; later plan changes require the customer to generate a new link.
- **Technical Complexity**: Medium - the feature depends on reliable plan serialization and URL-based restoration, but does not require server-side persistence.
- **Business Complexity**: Medium - the customer expects the shared plan to be portable across devices and sessions while understanding that links are snapshots, not live synchronized plans.

### INVEST Evaluation
- **Independent**: Yes - share link generation and opening can be delivered as a complete customer-facing capability without requiring backend storage.
- **Negotiable**: Yes - product and design details such as the exact action label, placement, and confirmation wording can be discussed with the team.
- **Valuable**: Yes - customers can transfer or share a medicine plan without manually recreating it on another device or session.
- **Estimable**: Yes - the behavior is bounded by generating a link, opening it elsewhere, and restoring the captured plan settings.
- **Small**: Yes - the story contains three closely related functional points and fits a 1-5 day delivery window.
- **Testable**: Yes - acceptance criteria can be validated by creating concrete plans, generating links, opening them in different sessions, and checking restored values.

**Conclusion**: Ready as-is.

### Split Strategy

No split is needed. The feature is a single customer workflow: generate a snapshot link for the current plan and use that link to restore the same plan in another browser, device, session, or user instance. Splitting generation from opening would break the business value loop.

---

## [STORY-001-001] Share Plan Link Generation API Development

### Background

Customers create medicine plans in a tool that stores plans locally and does not use a backend or database. This makes normal account-based sharing unavailable, but customers still need a simple way to move a plan from one browser, device, or session to another, or to share it with another user.

This story provides a portable share link that captures the complete current plan in the URL. The shared link represents a snapshot of the plan at the time the customer generates it. If the customer changes the plan later, the previous link remains unchanged and the customer must generate a new link to share the updated version.

### Business Value
- Provide customers with a way to share or transfer a medicine plan without requiring accounts, backend storage, or manual re-entry.
- Support plan continuity when a customer moves from one browser, device, or session to another.
- Enable a locally stored planning tool to support basic sharing while preserving the no-backend product constraint.

### Dependencies and Assumptions
- **Prerequisites**: A customer can already create or edit a medicine plan with visible settings in the tool.
- **Data assumptions**: A plan may include medicine names, dose settings, schedule settings, start dates, durations, notes, or other user-visible plan configuration already supported by the tool.
- **Integration points**: No external systems are required; the share link works through the browser URL and the receiving browser session.
- **Business constraints**: The product has no backend or database, so shared links are snapshots and do not synchronize future changes automatically.

### Scope In
- Customer action to generate a shareable link for the current plan.
- The generated link contains enough information to restore the complete plan state visible to the customer at generation time.
- Opening the link in another browser, device, session, or user instance restores all shared plan settings.
- Clear customer-facing behavior that later plan changes require generating a new share link.

### Scope Out
- Live synchronization between the original plan and already generated links.
- Backend storage, accounts, permissions, or server-hosted share records.
- Expiration dates, revocation, access control, passwords, or recipient management for shared links.
- Collaborative editing or merge behavior when multiple users change copies of the same plan.

### Acceptance Criteria

#### AC1: Generate a Share Link for the Current Plan
**Given** a customer has a plan named "Morning medication plan" with "Amoxicillin 500 mg", a schedule of "08:00 and 20:00 daily", a start date of "2026-07-01", a duration of "7 days", and a note "take after food"  
**When** the customer uses the share action for the plan  
**Then** the system provides a shareable link for that exact current plan state, and the customer can copy or use the link without creating an account or saving anything to a backend

#### AC2: Open a Shared Plan in Another Browser or Device
**Given** a customer generated a share link for a plan containing "Amoxicillin 500 mg", schedule "08:00 and 20:00 daily", start date "2026-07-01", duration "7 days", and note "take after food"  
**When** the link is opened in a different browser, device, session, or user instance with no existing local copy of that plan  
**Then** the opened plan shows the same medicine, schedule, start date, duration, note, and other visible plan settings that were present when the link was generated

#### AC3: Shared Links Preserve the Generated Snapshot
**Given** a customer generated a share link while the plan duration was "7 days"  
**And** the customer later changes the original local plan duration to "10 days"  
**When** the previously generated share link is opened in another session  
**Then** the shared plan still shows the duration as "7 days"  
**And** the customer must generate a new link for another session to receive the updated "10 days" duration

#### AC4: Generate a New Link After Plan Changes
**Given** a customer generated a first share link for a plan with one medicine, "Amoxicillin 500 mg"  
**And** the customer later adds a second medicine, "Ibuprofen 200 mg", to the same local plan  
**When** the customer uses the share action again  
**Then** the system provides a new shareable link that includes both "Amoxicillin 500 mg" and "Ibuprofen 200 mg"

#### AC5: Empty or Incomplete Plans Are Not Shared as Complete Plans
**Given** a customer has not added any medicine to the current plan  
**When** the customer uses the share action  
**Then** the system either prevents share link generation with a clear customer-facing message explaining that a plan must contain at least one medicine, or generates a link that clearly opens as an empty plan rather than implying medicine details were shared

#### AC6: Invalid Shared Link Cannot Restore a Plan
**Given** a customer opens a link that looks like a plan share link but does not contain a valid plan snapshot  
**When** the browser loads the link  
**Then** the system does not replace the customer's existing local plan with invalid information  
**And** the customer sees a clear message that the shared plan could not be opened

#### Non-Functional Expectations
- Shared links must be usable in normal customer sharing channels such as copying from the browser and pasting into a message.
- Restoring a shared link must be fast enough that a customer can immediately confirm the plan details after opening it.

### Quality Check

**Structure and Completeness**:
- Contains Background, Business Value, Dependencies and Assumptions, Scope In/Out, and Acceptance Criteria.
- Acceptance criteria use Given-When-Then format with concrete values and examples.
- Acceptance criteria are written in business language and avoid implementation instructions.
- Acceptance criteria cover happy path, snapshot behavior, validation, and error conditions.

**Business Clarity**:
- Business value is clear for customers who need to share or transfer a locally stored plan.
- Scope In and Scope Out separate snapshot sharing from live synchronization, backend storage, and collaboration.
- No duplication with existing stories was found because no `requirements/` stories existed before this document.
- A QA engineer can write tests from the acceptance criteria without reading source code.

**Sizing and Independence**:
- The story contains three core functional points: generate a link, open a link elsewhere, and preserve snapshot behavior after changes.
- The story can be developed and delivered independently.
- Estimated workload is 2-4 days.

### Final INVEST Re-Validation
- **Independent**: The story delivers the complete share-and-open workflow without depending on backend features.
- **Complete**: The customer can generate a link, open it elsewhere, and understand snapshot behavior.
- **Valuable**: The story removes manual re-entry when customers move or share a medicine plan.
- **Estimable**: The scope is concrete and bounded by visible plan state restoration.
- **Right-sized**: Estimated at 2-4 days and limited to three core functional points.
- **Testable**: The acceptance criteria define concrete plan examples, expected restored values, and failure behavior.
````

## Domain Concept Identification

#### Existing Concepts (from codebase)
- **Plan**: The customer's saved medication schedule. In the current static PWA, a plan can become active, is persisted in browser local storage, and drives the dashboard experience.
- **Draft Plan**: The customer's in-progress selection before creating an active plan. It contains selected medicine-taking periods and medicines before the plan is saved.
- **Medicine**: A user-entered medicine entry that belongs to a plan and carries visible customer-facing details such as name, amount, unit, note, selected periods, and duration.
- **Period**: A business time bucket for when medicine is taken. The current product recognizes morning, afternoon, and evening and uses these periods both during plan creation and dashboard display.
- **Dashboard**: The active plan view shown after plan creation or when an existing local plan is loaded. It organizes medicines by period and lets the customer mark visible cards as taken for the current session.
- **Local Plan Storage**: Browser-local persistence for the active plan. It supports the no-backend product promise but is limited to the current browser storage context.
- **Reset Plan**: The existing customer action that removes the locally saved plan and returns the tool to the start state.

#### New Concepts Required
- **Shareable Plan Snapshot**: A portable representation of the active plan at a specific moment. It must contain the same customer-visible plan settings needed to reconstruct the plan in another browser, device, session, or user instance.
- **Shared Plan Link**: A URL that carries a shareable plan snapshot and can be copied or opened elsewhere. It is not a live link to the original plan and does not imply ongoing synchronization.
- **Shared Plan Import Outcome**: The customer-facing result of opening a shared link, including either a restored plan or a clear failure state when the link cannot be used.

#### Key Business Rules
- **Snapshot rule**: A shared link represents the plan exactly as it existed when the customer generated the link; later local changes do not alter that link.
- **No-backend rule**: Sharing must work without accounts, server storage, database records, permissions, or external integrations.
- **Completeness rule**: A valid shared link must restore all customer-visible plan settings that affect the created plan and dashboard.
- **Non-destructive invalid-link rule**: An invalid shared link must not overwrite or corrupt an existing local plan.
- **Customer clarity rule**: The customer must have an understandable action to generate a link and must be able to understand when a new link is needed after changes.
- **Plan eligibility rule**: The product needs a clear stance on whether empty or incomplete plans can be shared; if allowed, the receiving experience must not imply that missing medicine details were shared.

## Strategic Approach

#### Solution Direction
- Extend the existing static PWA flow with a share capability centered on the active local plan. The customer generates a link from the current saved plan, and another browser or session can open that link to restore the plan into the existing dashboard flow.
- Keep the feature aligned with the current architecture: no framework, no backend, no build step, browser-local persistence, and customer-facing behavior contained in the static app.
- Treat shared links as snapshot imports rather than synchronized references. This preserves the product's privacy and offline-oriented promise while meeting the requirement to move a plan across devices or users.
- Reuse the current business concepts for plan creation and dashboard display so the restored plan behaves like any locally created active plan from the customer's perspective.

#### Key Design Decisions
- **Where sharing lives in the customer journey**: The share action should be available when there is an active plan to share. This matches the requirement that a customer creates a plan and then shares it, and avoids introducing sharing before there is meaningful plan data.
- **Snapshot versus live plan**: Snapshot sharing is the recommended direction because the product has no backend and the requirement explicitly says changed plans need a new link. Live synchronization is out of scope and would conflict with the no-database constraint.
- **Open link behavior with existing local data**: The product must decide whether opening a valid shared link automatically replaces the current local plan or asks the customer to confirm. The safer strategic direction is to protect existing local data from accidental replacement while still allowing a customer to open the shared plan intentionally.
- **Empty plan handling**: The current app already prevents creating an active plan with no medicines, so the recommended direction is to keep sharing limited to active plans that contain at least one medicine. This makes AC5 easier to present clearly and avoids ambiguous empty-plan links.
- **Customer communication after changes**: The feature should make clear that generated links are snapshots. This matters because the existing app allows local changes through reset and plan recreation rather than live collaborative editing.

#### Alternatives Considered
- **Backend-hosted share records**: Rejected because the product and requirement explicitly state that there is no backend or database.
- **Live synchronized links**: Rejected because they require shared state outside the URL and contradict the requirement that changed plans need a new link.
- **Manual export and import files**: Rejected for this story because the requested customer workflow is a link that can be used in another browser, device, session, or user instance.
- **Sharing only the current dashboard view**: Rejected because the acceptance criteria require all plan settings to be visible after opening the link, not just a display-only summary.

## Risk & Gap Analysis

#### Requirement Ambiguities
- **Plan field completeness**: The story says "all settings" but the current app's plan settings are limited to periods and medicine details. Future settings, if added later, need to be included in the share concept to keep the completeness rule true.
- **Existing local plan replacement**: AC2 describes opening a shared link with no existing local copy, but does not define what happens when the receiving browser already has a local plan.
- **Empty plan behavior**: AC5 intentionally allows either preventing share generation or opening as a clearly empty plan. The current app behavior points toward preventing empty active-plan sharing, but product should confirm that stance.
- **Customer action wording and placement**: The requirement says the customer should be able to click somewhere, but does not define whether the action should copy automatically, show a link, use native sharing where available, or present both.
- **Sensitive health information awareness**: Medicine plans can contain personal health details. The requirement does not specify any customer warning that anyone with the link can see the encoded plan contents.

#### Edge Cases
- **Very long plans**: A plan with many medicines or long notes may create a URL too long for some browsers, apps, or messaging channels, which could make the link unreliable.
- **Malformed or partial links**: Customers may paste truncated links or links altered by a messaging app. The receiving experience needs a clear failure path.
- **Unsupported future plan versions**: A link generated by an older or newer version of the app may not match the current plan structure.
- **Special characters in customer-entered text**: Medicine names, units, and notes may include punctuation, accents, emoji, or line-like text that must survive sharing and restoring as customer-visible content.
- **PWA launch behavior**: Installed PWA launches and service worker behavior may interact with URLs differently from a normal browser tab, so the shared-link path needs validation in both contexts.
- **Session-only taken state**: The current dashboard lets customers mark medicine cards as taken for the session. The requirement focuses on plan settings, so taken state should not be treated as part of the shared plan unless product explicitly expands scope.

#### Technical Risks
- **URL size limit risk**: Encoding the entire plan into a URL can fail for larger plans, causing broken sharing in common channels. Mitigation direction: define practical limits and customer-facing failure behavior before implementation.
- **Data safety risk**: Opening a shared link could overwrite a receiving customer's existing local plan. Mitigation direction: preserve or confirm before replacement so invalid or unexpected links do not destroy local data.
- **Privacy expectation risk**: URL-encoded medicine details are shareable by anyone who receives the link and may appear in browser history or copied messages. Mitigation direction: provide clear customer-facing expectations without introducing backend security promises.
- **Robustness risk**: Invalid, malformed, or older shared links may fail during restoration. Mitigation direction: validate before accepting a shared plan and avoid changing local storage until the shared plan is known to be usable.
- **Compatibility risk**: Because the app is a static PWA with no build tooling, the solution must stay compatible with direct static hosting, installable PWA behavior, and local browser APIs.

#### Acceptance Criteria Coverage
| AC# | Description | Addressable? | Gaps/Notes |
|-----|-------------|--------------|------------|
| 1 | Generate a Share Link for the Current Plan | Yes | The app has an active local plan concept and can expose a customer action from the active-plan experience. Product should confirm the desired customer feedback after generation. |
| 2 | Open a Shared Plan in Another Browser or Device | Yes | Fully addressable for a browser or session with no existing local plan. Behavior when a local plan already exists needs confirmation. |
| 3 | Shared Links Preserve the Generated Snapshot | Yes | Matches the no-backend model and should be treated as a core rule of the feature. |
| 4 | Generate a New Link After Plan Changes | Yes | Addressable as long as generated links are independent snapshots and the share action always reflects the current active plan. |
| 5 | Empty or Incomplete Plans Are Not Shared as Complete Plans | Yes | The current app already prevents creating an active plan without medicines, so preventing empty active-plan sharing is the clearest direction. The alternate empty-link behavior remains a product choice. |
| 6 | Invalid Shared Link Cannot Restore a Plan | Yes | Requires validation and non-destructive handling before changing any existing local plan. Customer-facing failure messaging should be defined in the REASONS Canvas. |
