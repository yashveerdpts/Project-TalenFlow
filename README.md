# TalentFlow: A Mini Hiring Platform

TalentFlow is a comprehensive, client-side hiring and recruitment management application built with React. It provides a robust interface for managing job postings, tracking candidates through a Kanban-style pipeline, building custom skill assessments, and viewing key hiring metrics on a central dashboard. The entire application runs in the browser without needing a backend, using Dexie.js (IndexedDB) for persistent local storage.

![TalentFlow Screenshot](https://i.imgur.com/rS2hW2k.jpg)

---

## Key Features

* **Authentication**: Secure login page for a single user with persistent sessions.
* **Dashboard**: An "at-a-glance" view of key metrics (Total Jobs, Active Candidates, Hires) and lists of recent candidates and active jobs.
* **Collapsible Sidebar**: Modern navigation for a clean user experience.
* **Job Management**: Create, edit, and archive job postings. Search jobs by title or tags.
* **Candidate Pipeline**:
    * View candidates in a performant, virtualized list or a drag-and-drop Kanban board.
    * Track candidates through customizable stages (Applied, Screening, Interview, Offer, Hired, Rejected).
    * Add notes during stage changes for a complete hiring timeline.
* **Detailed Candidate View**: A comprehensive profile for each candidate, showing a chronological activity feed of stage changes and notes.
* **Assessment Builder**:
    * Create custom skill assessments for each job.
    * Supports multiple question types (short/long text, single/multi-choice, numeric, file upload).
    * Includes a live preview pane to see the form as you build it.
    * Supports validation rules (required, numeric range) and conditional logic.
* **Global Theming**: Seamless light and dark mode support across the entire application.

---

## Technology Stack

* **Frontend**: React (Create React App)
* **Routing**: React Router
* **State Management**: React Context API (`useContext`, `useReducer`)
* **Client-Side Database**: Dexie.js (A wrapper for IndexedDB)
* **Drag & Drop**: React Beautiful DnD
* **List Virtualization**: React Virtualized
* **Styling**: Plain CSS with CSS Variables for theming
* **Data Seeding**: `@faker-js/faker` for realistic sample data

---

## Getting Started

### Prerequisites

* Node.js (v16 or later)
* npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd talentflow-project
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm start
    ```

The application will open at `(https://talent-flow-omega-one.vercel.app)`. The first time it runs, the database will be automatically seeded with sample data.

**Login Credentials:**
* **Email:** `admin@talentflow.com`
* **Password:** `password123`

---

## Application Architecture

The application is designed with a clear separation of concerns, primarily managed through React Context and a component-based structure.

### State Management (React Context)

Global state is managed via multiple, domain-specific contexts to avoid a single, monolithic store.

* **`AuthContext`**: Manages the user's authentication state (`isAuthenticated`, `user`) and provides `login`/`logout` functions. It persists the session to `localStorage`.
* **`ThemeContext`**: Manages the global light/dark mode. It persists the user's choice to `localStorage` and applies a class to the `<body>` tag.
* **`JobsContext`**: Handles all state and asynchronous actions related to jobs (fetching, creating, updating).
* **`CandidatesContext`**: Handles all state and actions for candidates (fetching, updating stage, adding notes).

### Data Persistence (Dexie.js)

Instead of a traditional backend, the application uses **Dexie.js**, a powerful wrapper for the browser's IndexedDB. This allows for a full-featured, persistent experience that works offline.

* All jobs, candidates, and assessments are stored locally.
* A seeder script (`seedDB.js`) populates the database with realistic fake data on the first run, providing a rich out-of-the-box experience.

### Routing

Routing is handled by **React Router**.

* A `ProtectedRoute` component wraps the main application, redirecting unauthenticated users to the `/login` page.
* A `Layout` component provides the main top navbar to shared pages.
* The `DashboardPage` uses its own layout with a collapsible sidebar.

---

## Technical Decisions & Trade-offs

* **Client-Side Only Architecture**: The decision to use Dexie.js for persistence creates a fast, offline-capable application without the need for a backend server or network requests. The trade-off is that data is not shared between users or devices.
* **React Context for State**: The native Context API was chosen over libraries like Redux for its simplicity, lack of boilerplate, and sufficiency for this application's level of complexity. Using `useReducer` within contexts provides scalable state logic. The trade-off is that it can lead to performance issues in massive applications with very frequent updates, though this is mitigated here.
* **CSS Variables for Theming**: The light/dark mode is powered by CSS Custom Properties (variables). This is a modern, efficient approach that allows for instant theme changes without re-rendering React components, avoiding the need for a CSS-in-JS library.

---

## Known Issues & Future Improvements

* **Single-User Authentication**: The login system is hardcoded for one user. A future improvement would be to implement a proper user management system.
* **No Real File Uploads**: The "File Upload" question type in the assessment builder is a stub and does not actually handle file storage.
* **Limited Search/Filter**: Filtering is done client-side. For a larger dataset, server-side pagination and filtering would be more performant.
* **Basic Error Handling**: While the app handles some errors, it could be improved with more robust error boundaries and user-facing messages.
