# SmartCode: An Interactive Multi-Language Programming Education Platform with Sandbox Compilation and Intelligent Pedagogical Feedback

SmartCode is an advanced, full-stack interactive learning web application designed for computer science education. It bridges the gap between theoretical programming concepts and hands-on practice by providing an in-browser development environment, sandbox code execution, automated system recommendations, and dual-tier artificial intelligence integration for code review and contextual scaffolding.

---

## 📸 Application Preview
*Below are visual previews of the SmartCode platform. Insert your screenshots in the placeholders below:*

### 1. Landing & Marketing Page
<!-- Replace the path below with your landing page screenshot -->
![SmartCode Landing Page](images/main.png)

### 2. Interactive Learning Environment (IDE & AI Chat)
<!-- Replace the path below with your IDE/lesson screen screenshot -->
![SmartCode IDE and AI Chat](images/ai.png)

### 3. Student Dashboard & Recommendations
<!-- Replace the path below with your dashboard screenshot -->
![SmartCode Student Dashboard](images/dashboard.png)

---

## 💡 Core Features

### 1. In-Browser Interactive IDE
* Powered by the **Monaco Editor** (the engine behind VS Code), providing students with syntax highlighting, automatic indentations, parentheses matching, and font ligatures.
* Supports **5 key languages**: Python, JavaScript, Java, C, and C++.

### 2. Isolated Code Execution Sandbox
* Connects to a secure **Judge0 Compilation Sandbox API** via Next.js backend proxy routes.
* Executes user code asynchronously and captures standard output (`stdout`), standard error (`stderr`), or compilation errors (`compile_output`) in real-time.

### 3. Dual-Tier Artificial Intelligence Integration
Powered by **Anthropic Claude Haiku (4.5)**, the system features:
* **The AI Code Reviewer (`/ai-review`):** Evaluates student solutions based on logical intent. It operates on a **pedagogical leniency protocol**—ignoring cosmetic elements (capitalization, whitespace, spelling, or specific string formats) and focusing strictly on algorithm correctness. It delivers a structured JSON payload containing a `CORRECT/INCORRECT` verdict, a reference solution, and concept-based advice.
* **The AI Conversational Tutor (`/hints`):** A real-time chat interface restricted by strict system prompts. It **never writes code** for the student. Instead, it acts as a Socratic guide—explaining syntax, asking clarifying questions, and pointing out logical errors in plain text without markdown or symbols.

### 4. Smart Curriculum Recommendation Engine
* Uses a high-performance **SQL-based recommendation query** to direct student flow.
* **Logic:** Prioritizes moving forwards through the syllabus structure. If a student skips lessons or has outstanding incomplete modules behind their furthest point, the engine backfills recommendation paths only after the main curriculum path is advanced.

### 5. Gamified Progression & Dashboard
* Displays completed modules, total syllabus progress, remaining exercises, and a dynamically computed **daily login streak** (using PostgreSQL timestamps).
* Includes a dynamic SVG progress ring to visualize completion rates.
* **Global Leaderboard:** Ranks students based on completion numbers. Users can toggle their leaderboard visibility and display name inside their account settings.

### 6. User Verification & Session Security
* Implements registration, login, JWT authentication, and session guards.
* Enforces email verification via a 6-digit OTP code and nodemailer SMTP transmission.
* Safe recovery routes for forgotten and reset passwords.

### 7. Administrative Panel
* Enables administrators to perform CRUD operations on user records and lessons.
* Administrators can construct, edit, and delete syllabus modules, including code examples, tasks, duration estimates, and category hints.

---

## 🛠 Tech Stack & System Architecture

SmartCode utilizes a modern decoupled micro-service layout:

```mermaid
graph TD
    A[Next.js 15 Client Frontend] <-->|HTTP / JWT Auth| B[FastAPI Python Backend]
    A <-->|HTTP POST /api/execute| C[Next.js Route Handler]
    C <-->|RapidAPI| D[Judge0 CE Sandbox API]
    B <-->|SQL Client Connection| E[PostgreSQL 17 Database]
    B <-->|Anthropic API Client| F[Claude Haiku AI Service]
    B <-->|SMTP Client| G[Nodemailer Mail Server]
```

### Frontend (Web Client)
* **Framework:** Next.js 15 (React 19, TypeScript)
* **Styling:** Tailwind CSS v4 & Custom CSS modules (Modern dark-mode glassmorphic theme)
* **Animations:** Framer Motion (page transitions, sidebar slides, cards staging)
* **Editor:** `@monaco-editor/react`

### Backend (REST API)
* **Framework:** FastAPI (Python 3.12)
* **Web Server:** Uvicorn (ASGI)
* **ORM / Database Driver:** PostgreSQL connection pool using `psycopg2`
* **Data Validation:** Pydantic v2

### Database & Operations
* **Database:** PostgreSQL 17 (managed via Docker)
* **Schema Migrations:** SQL migrations executed with `golang-migrate`

---

## 🗄 Database Schema Design

The database schema is migrated incrementally using a 26-step raw SQL system.

```mermaid
erDiagram
    USERS {
        int id PK
        varchar email
        varchar password_hash
        boolean is_admin
        boolean is_verified
        varchar verification_code
        timestamp verification_expires
        varchar username
        boolean show_on_leaderboard
    }
    LESSONS {
        int lesson_id PK
        varchar title
        text description
        text content
        varchar language
        varchar difficulty
        int duration
    }
    PROGRESS {
        int progress_id PK
        int user_id FK
        int lesson_id FK
        varchar status
        timestamp completed_at
    }
    TIPS {
        int tip_id PK
        int lesson_id FK
        varchar category
        text message
    }
    SUBMISSIONS {
        int submission_id PK
        int user_id FK
        int lesson_id FK
        text code
        varchar language
        timestamp submitted_at
    }

    USERS ||--o{ PROGRESS : tracks
    LESSONS ||--o{ PROGRESS : logs
    LESSONS ||--o{ TIPS : contains
    USERS ||--o{ SUBMISSIONS : registers
    LESSONS ||--o{ SUBMISSIONS : aggregates
```

---

## 🔒 Concurrency, Transaction Management & Safety

To handle multiple students submitting codes simultaneously, the FastAPI backend uses a custom connection pool manager:
* **Threaded Connection Pool (`psycopg2.pool.ThreadedConnectionPool`):** Pre-allocates between 2 and 20 database connections to safely execute parallel queries without resource deadlocks.
* **Contextual Cursor Handler (`get_cursor`):** Leverages a context manager to borrow connections. On success, it automatically commits modifications. If an operation fails mid-transaction, it rolls back the transaction state to protect database integrity and cleanly returns the connection to the pool.
* **Quality Assurance (`concurrency_test.py`):** Includes custom automated test suites executing concurrent database reads (50 parallel users executing 600 total queries simultaneously), transaction validation, and error recovery diagnostics.

---

## 🚀 Setup & Installation

### Prerequisites
* Docker & Docker Compose
* Python 3.12 or higher
* Node.js v18 or higher

### 1. Environment Configurations
Create a `.env` file in the root `smartcode` directory:

```env
# Database Settings
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=db_smartcode
DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/db_smartcode?schema=public"

# Encryption & Authentication Keys
JWT_SECRET=your_jwt_signing_key_here
SECRET_KEY=your_python_api_secret_key_here

# Automated System Mailer
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# External API integrations
GEMINI_API_KEY=optional_keys_if_any
ANTHROPIC_API_KEY=your_anthropic_api_key_here
JUDGE0_API_KEY=your_rapidapi_judge0_key_here
```

### 2. Run Database Container
Launch the PostgreSQL server container. Database migrations will automatically compile on initialization:
```bash
docker compose up -d
```

### 3. Run FastAPI Python Backend
1. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Unix/macOS:
   source .venv/bin/activate
   ```
2. Install python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the ASGI server:
   ```bash
   uvicorn app.api.main:app --reload
   ```
The backend server will run on `http://localhost:8000`.

### 4. Run Next.js Frontend Web Server
1. Navigate to the root of the project:
   ```bash
   npm install
   ```
2. Start the hot-reloading development server:
   ```bash
   npm run dev
   ```
The web app is accessible at `http://localhost:3000`.

### 5. Running Connection & Integrity Diagnostics
To test concurrent connection pooling under load:
```bash
python concurrency_test.py
```
