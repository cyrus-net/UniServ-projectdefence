# UTAUT-based Usability Test Plan — UniServ

## Purpose
A lightweight usability study aligned to the UTAUT model to evaluate user acceptance (performance expectancy, effort expectancy, social influence, facilitating conditions) and actual task success across core flows: sign-up, edit profile (including image upload), create service (seller), explore & book service (client), messaging, and earnings view.

## Objectives
- Measure how users perceive usefulness and ease-of-use of primary features (UTAUT constructs).
- Observe task completion, time-on-task, and major usability issues.
- Collect quantitative UTAUT Likert ratings and qualitative feedback to prioritize fixes.

## Participants
- 6–10 participants (mixed: 50% sellers, 50% clients). Prefer students aged 18–35.
- Recruitment criteria: basic web experience, some experience hiring or offering small services preferred.

## Logistics
- Moderated remote or in-person sessions, ~45–60 minutes each.
- Tools: screen-recording, think-aloud encouraged, stopwatch, notes template (CSV).

## Tasks (scenarios)
Each task has: goal, success criteria, max time.
1. Sign up with email (client): create account, verify that you can sign in. Success: account created and signed in (2–4 mins).
2. Sign up / sign in with Google (if enabled): sign in via Google and reach dashboard. Success: OAuth flow completes (2–4 mins).
3. Edit profile (seller): update name, bio, upload profile image, save. Success: profile displays updated name and uploaded image after saving (3–5 mins).
4. Create a service (seller): add a new listing with title, price (₦), images, and publish. Success: service appears in `My Services` (5–8 mins).
5. Explore & filter services (client): apply price filter (Under ₦30) and open a service details page. Success: results filtered, details open (3–5 mins).
6. Book a service (client): complete booking flow up to confirmation (if payments not integrated, stop at confirmation screen). Success: booking confirmation screen shown (4–6 mins).
7. Messaging (both roles): open Messages, send a message to the other party. Success: message appears in thread within 10 seconds (3 mins).
8. Check earnings (seller): open `Earnings` and interpret Available Balance and Transaction list. Success: user locates balance and reads last transaction (2–4 mins).

## Success Metrics
- Task success rate (complete / partial / fail).
- Time-on-task per scenario.
- Error count and severity (critical/blocker, major, minor).
- UTAUT Likert scores (1–7) per construct.
- System Usability Scale (SUS) optional for overall usability.

## UTAUT Questionnaire (post-test)
Rate on 1 (Strongly Disagree) — 7 (Strongly Agree)
- Performance Expectancy
  - PE1: Using UniServ improves my productivity when hiring/offering services.
  - PE2: UniServ is useful for completing my work/tasks.
- Effort Expectancy
  - EE1: Learning to use UniServ is easy for me.
  - EE2: It is easy to become skillful at using UniServ.
- Social Influence
  - SI1: People who influence my behavior think I should use UniServ.
  - SI2: My peers would recommend UniServ to others.
- Facilitating Conditions
  - FC1: I have the resources (device, internet) to use UniServ.
  - FC2: Support documentation or help is available when I need it.
- Behavioral Intention
  - BI1: I intend to continue using UniServ in the near future.
  - BI2: I will recommend UniServ to others.

Also ask open questions:
- What did you like most?
- What frustrated you or caused confusion?
- Any missing features or suggestions?

## Moderator Script (brief)
1. Welcome + consent (2 min): explain purpose, record screen, encourage think-aloud.
2. Pre-test questions (2–3 min): background, role, prior experience.
3. Tasks: present scenarios one at a time; observe and take notes.
4. Post-task probing: ask why choices were made, any confusion.
5. Post-test questionnaire: UTAUT items + open feedback + optional SUS.
6. Closing: thank participant, any compensation details.

## Data Collection Templates
- CSV columns: participantId, role, taskId, taskName, startTime, endTime, timeOnTask(s), successStatus (complete/partial/fail), errorsObserved, comments, PE_score, EE_score, SI_score, FC_score, BI_score, SUS_score (optional), sessionNotes
- Transcript snippets and screen recordings linked by participantId.

## Analysis Plan
- Quantitative: compute task success rates, mean time-on-task, mean Likert scores per UTAUT construct; identify tasks with >25% failure or >mean time + 2SD.
- Qualitative: thematic coding of comments and observed problems, map to severity and frequency.
- Produce prioritized list of usability issues (severity × frequency) and recommendations (quick wins vs. architectural changes).

## Deliverables
- Test dataset (CSV), recordings, aggregated metrics, prioritized issue list, and recommendations report.
- Suggested quick fixes: unify currency display via `formatCurrency` util; consistent image upload feedback; shorten booking flow steps.

## Schedule & Sample Timeline
- Prepare materials: 1–2 days
- Recruit participants: 3–7 days
- Sessions: 1–2 weeks (parallel runs)
- Analysis & report: 2–4 days

---
Files created for the study:
- `frontend/usability/UTAUT-usability-test-plan.md` (this file)

If you want, I can also:
- Generate the CSV template file and a ready-to-use Google Forms or Typeform copy of the UTAUT questionnaire.
- Create a `formatCurrency` utility and refactor price displays to ensure consistent `₦` formatting.

Tell me which follow-up artifact you want next.