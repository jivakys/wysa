# Wysa Backend Assignment: Conversation Flow System

Backend system for managing a modular, dynamic question-based conversation flow with state tracking and history management.

## 🚀 Key Features

- **State Machine Architecture**: Precisely tracks user progress across multiple modules.
- **Atomic Transactions**: Uses Mongoose Transactions to ensure data consistency between session updates and history logging.
- **JWT Authentication**: Secured endpoints to protect user progress and history.
- **Modular Switching**: Logic to jump between different content modules (e.g., from Node.js to Express.js).
- **Checkpoint Logic**: Capability to reset module-specific data while preserving overall chronological history.
- **Safe Deep-Linking**: Defensive "Sync" logic that prevents users from jumping to invalid or unvisited states.
- **Bonus - Go Back**: Ability for users to return to the previous question within their current module.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT (Authentication), Bcrypt (Password Hashing)
- **Development**: Nodemon (Auto-reload), Dotenv (Env management)

---

## 📂 Project Structure

```text
/
├── configs/            # Database connection setup
├── controllers/        # Request handlers (Auth & Flow)
├── middlewares/        # JWT Authentication logic
├── models/             # Mongoose Schemas (User, Question, Module, Session, History)
├── routes/             # API Route definitions
├── services/           # Core Business Logic (Flow Engine)
├── index.js            # Entry Point
├── seed.js             # Practice Quiz Seeding Utility
└── .env                # Environment Variables (MONGODB_URL, SECRET_KEY, etc.)
```

---

## ⚙️ Installation & Setup

1. **Clone the project** and navigate to the directory:

   ```bash
   cd dev
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root:

   ```env
   PORT=3000
   MONGODB_URL=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret
   SALT=10
   ```

4. **Seed Practice Data**:
   Populate the database with a Full-Stack Developer quiz (Node -> Express -> MongoDB):

   ```bash
   node seed.js
   ```

5. **Start the Server**:
   ```bash
   npm start
   ```

---

## 📡 API Reference

### 1. Authentication

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Authenticate and receive a JWT token.

### 2. Conversation Flow (Protected - Requires `Bearer <token>`)

- `POST /api/conversation/start`: Join a module. Body: `{ "moduleId": "mod_node" }`.
- `POST /api/conversation/respond`: Answer current question. Body: `{ "optionId": "n1_o1" }`.
- `POST /api/conversation/back`: Return to the previous question.
- `GET /api/conversation/sync?questionId=...`: Validate a deep link and sync state.
- `GET /api/conversation/history`: View complete interaction log for the user.

---

## 🛡️ Functional Logic Highlights

- **The Sync Lock**: When calling `GET /sync`, the system verifies the `History` table. If the user hasn't visited the requested question previously, it redirects them to their current "active" question to prevent flow breaks.
- **Checkpoint implementation**: When a question is flagged as `is_checkpoint: true`, the system wipes the `context_by_module` object for that module, satisfying the requirement to treat the user as "fresh" for future logic in that module.
- **Transaction Safety**: All state-changing operations in `flowServices.js` are wrapped in Mongoose sessions. If the history log fails, the session update is rolled back automatically.

---

## 👨‍💻 Author

**jivakys**
