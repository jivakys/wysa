## 1. AI Tools Used

- **ChatGPT**: for architecture brainstorming and edge case discussion
- **Antigravity (Google Deepmind)**: Used for architecture design, boilerplate generation, refactoring, and logical troubleshooting.

## 2. Key Prompts Given

- "Break down the problem statement in small chuncks and explain to me and how I can proceed with this problem."
- "Migrate the system to MongoDB using Mongoose."
- "Refactor Flow Service from a class-based structure to a functional structure."
- "Implement Mongoose Transactions to ensure both [UserSession and History updates] happen or neither happens."
- "Add at least three questions in each module and add genuine questions [for Node, Express, MongoDB]."
- "Bonus: Allow users to go back to the previous question within the current module."

## 3. What I Modified from AI Output

- **Project Structure**: Mid-way through the project, I opted for a flatter directory structure (e.g., moving models/controllers/routes to the root instead of under a `src/` folder). The AI successfully adapted the import paths across all services and controllers to match this manual change.
- **Service Logic**: I adjusted the service functions to use specific authenticated user context (via JWT) rather than relying on `userId` passed in request bodies, enhancing security for production.

## 4. What AI Got Wrong

- **Question Ordering**: Initially, the `startModule` logic used `Question.findOne({ module_id })`. This caused an issue during testing where the system picked the `q_end` question as the starting point instead of `q1` because MongoDB does not guarantee insertion order.
- **Context Preservation**: Early iterations of the "Checkpoint" logic wiped all user context instead of just the module-specific context. I had to guide the AI to scope the reset to `context_by_module[moduleId]`.
- **Import Errors**: During a refactor, the AI initially commented out a service import in the controller which led to a `ReferenceError`. This was caught during the "Code Correctness Check" phase.

## 5. How I Verified Correctness

1. **Manual Integration Testing**: Used Postman to simulate user journeys (Start -> Respond -> Sync -> Back) to verify state transitions.
2. **Database Auditing**: Queried the MongoDB collection after each API call to ensure the `History` log matched the `UserSession` state.
3. **Transaction Stress-Test**: Purposely introduced errors in the History logging to verify that the `UserSession` update rolled back correctly (Atomic confirmation).
4. **Functional Paradigms**: Verified that the refactored code followed the "Single Responsibility Principle" by separating database schemas, service logic, and request handling.
