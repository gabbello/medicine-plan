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
