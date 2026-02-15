## 1. AI Tools Used

- **ChatGPT**: - Used for architecture design and edge case discussion
- **Antigravity (Google DeepMind)**: boilerplate generation, refactoring, and logical troubleshooting.

## 2. Key Prompts Given

- "Explain the problem statement to me and how I can proceed with this problem."
- "Migrate the system to MongoDB using Mongoose."
- "Refactor the Flow Service from a class-based structure to a functional structure."
- "Implement Mongoose transactions to ensure both `UserSession` and `History` updates either succeed together or fail together."
- "Add at least three questions to each module and include genuine questions for Node.js, Express, and MongoDB."
- "Bonus: Allow users to go back to the previous question within the current module."
- Additionally, there were many smaller prompts containing code snippets to verify correctness and request improvements.

## 3. What I Modified from the AI Output

- **Schema Design**: I modified all model schemas to properly manage relationships between models using Mongoose `ref`. I also removed many unnecessary fields from the schemas.
- **Project Structure**: Midway through the project, I opted for a flatter directory structure (e.g., moving models, controllers, and routes to the root instead of keeping them under a `src/` folder). The AI successfully adapted the import paths across all services and controllers to align with this manual change.
- **Seed Script**: I modified the seed script to insert questions in the correct order.
- **Service Logic**: I adjusted the service functions to use the authenticated user context (via JWT) instead of relying on `userId` passed in request bodies, thereby enhancing production-level security.

## 4. What the AI Got Wrong

- **Schema Design**: The AI suggested using `module_id` to determine the first question in a module. However, MongoDB does not guarantee insertion order, making this approach unreliable.
- **Question Ordering**: Initially, the `startModule` logic used `Question.findOne({ module_id })`. During testing, this caused the system to select the `q_end` question as the starting point instead of `q1`, because MongoDB does not guarantee insertion order.
- **Context Preservation**: Early iterations of the "Checkpoint" logic wiped out all user context instead of only the module-specific context. I had to guide the AI to scope the reset to `context_by_module[moduleId]`.
- **Import Errors**: During a refactor, the AI mistakenly commented out a required service import in the controller, which resulted in a `ReferenceError`. This issue was identified during the "Code Correctness Check" phase.

## 5. How I Verified Correctness

1. **Manual Integration Testing**: Used Postman to simulate complete user journeys (Start → Respond → Sync → Back) and verify proper state transitions.
2. **Database Auditing**: Queried the MongoDB collections after each API call to ensure that the `History` log accurately reflected the `UserSession` state.
3. **Transaction Stress Testing**: Intentionally introduced errors in the History logging process to confirm that the `UserSession` update rolled back correctly (atomicity confirmation).
4. **Functional Paradigm Validation**: Verified that the refactored code adhered to the Single Responsibility Principle by clearly separating database schemas, service logic, and request handling.
