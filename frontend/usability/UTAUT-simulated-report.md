# UTAUT Simulated Test Report — 10 Students

Date: 2026-06-18

Summary
- Participants: 10 (mix of clients and sellers)
- Method: Simulated run using the UTAUT questionnaire and task-based success measures
- Deliverables: `utaut_results_simulated.csv` and this report

Aggregate UTAUT construct means (1-7 scale)
- Performance Expectancy (PE): 5.5
- Effort Expectancy (EE): 5.2
- Social Influence (SI): 4.9
- Facilitating Conditions (FC): 5.6
- Behavioral Intention (BI): 5.5
- System Usability Scale (SUS): 76.0 (average)

Interpretation
- Overall acceptance is moderately positive: PE, FC and BI are above 5, indicating users find the system useful, supported, and intend to use it.
- EE (ease-of-use) is good but slightly lower than PE, suggesting minor learnability or discoverability friction.
- SI is the lowest construct (4.9), indicating limited perceived endorsement from peers — expected for a small/early-stage system.
- SUS of 76 maps to 'Good' usability; there are still actionable improvements.

Task success rates (out of 10)
- T1 Sign up (email): 10/10 (100%)
- T2 Sign in with Google (OAuth): 9/10 (90%) — one OAuth failure noted
- T3 Edit Profile (incl. image upload): 10/10 (100%)
- T4 Create Service (seller): 8/10 (80%) — some role ambiguity from clients
- T5 Explore & filter services: 10/10 (100%)
- T6 Book a service: 9/10 (90%)
- T7 Messaging: 9/10 (90%) — polling (5s) acceptable
- T8 Check earnings: 9/10 (90%)

Time-on-task (avg seconds, simulated)
- Average session time per participant: ~257s (4.3 min)
- Notable outliers: P04 took ~420s due to OAuth issues and booking confusion

Observed qualitative issues (from simulated comments)
1. Google OAuth occasionally failed (P04) — improve error handling and messaging.
2. Image upload feedback could be clearer; users felt it was slightly slow.
3. Booking flow had minor confusion for some participants; simplify steps and add inline guidance.
4. Some role ambiguity: clients saw seller-only tasks (create service) and were unsure — show role-appropriate flows and disable irrelevant actions.
5. Social proof features are limited — add testimonials, seller ratings visibility to boost SI.

Recommendations (prioritized)
1. Quick wins
   - Implement a central `formatCurrency` utility to ensure consistent `₦` formatting across all UI (already partly done).
   - Add loading/progress indicator and success toast for image uploads.
   - Improve Google OAuth error messages and retry paths.
2. Medium effort
   - Simplify booking steps and add inline helper text on each booking screen.
   - Hide or disable seller-only actions for client users (role-aware UI).
   - Add visible social elements (recent hires, ratings) to improve Social Influence.
3. Longer-term
   - Consider replacing polling with WebSocket or server-sent events for messaging if scaling to many concurrent users.
   - Add in-app help and onboarding flows to further increase Effort Expectancy and Facilitating Conditions.

Next steps I can take
- Generate a ready-to-use Google Form from the UTAUT questionnaire.
- Create the CSV template for real participant data collection (if you prefer to run with real students).
- Implement the `formatCurrency` utility and refactor other remaining components.

Files produced
- `frontend/usability/utaut_results_simulated.csv`
- `frontend/usability/UTAUT-simulated-report.md`

If you want the test to be real, provide participant contact info and method for running sessions, or I can prepare recruitment & script materials and forms for you to run the sessions.