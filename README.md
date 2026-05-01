# Task Manager — Full-Stack Assessment

A simple full-stack task management app: a Node.js/Express REST API and a React (Vite) single-page client. Tasks are stored in an in-memory array on the server.

## Project Structure

```
assesment/
├── backend/        # Express REST API
│   ├── server.js
│   └── package.json
├── frontend/       # React (Vite) client
│   ├── src/
│   ├── index.html
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js **18+** and npm

## Setup & Running

Run the backend and frontend in two separate terminals.

### 1. Backend

```bash
cd backend
npm install
npm start
```

The API listens on **http://localhost:5050**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The client runs on **http://localhost:5173** and proxies `/tasks` requests to the backend (configured in `vite.config.js`), so no extra environment variable setup is needed in development.

Open http://localhost:5173 in your browser.

### Production Build (Frontend)

```bash
cd frontend
npm run build
npm run preview
```

If you serve the built frontend from a different origin than the API, set `VITE_API_URL` at build time, e.g. `VITE_API_URL=http://localhost:5050 npm run build`.

If port 5050 is taken on your machine, override it with `PORT=5060 npm start` (and update the proxy target in `frontend/vite.config.js` to match).

## API Reference

Base URL: `http://localhost:5050`

| Method | Endpoint      | Description                        | Body                                                   |
| ------ | ------------- | ---------------------------------- | ------------------------------------------------------ |
| GET    | `/tasks`      | List all tasks                     | —                                                      |
| GET    | `/tasks/:id`  | Get one task                       | —                                                      |
| POST   | `/tasks`      | Create a task                      | `{ "title": "...", "description": "...", "status": "pending" }` |
| PUT    | `/tasks/:id`  | Update title/description/status    | Any subset of `title`, `description`, `status`         |
| DELETE | `/tasks/:id`  | Delete a task                      | —                                                      |

**Task shape**

```json
{ "id": 1, "title": "Buy milk", "description": "2 liters", "status": "pending" }
```

`status` is one of `"pending"` or `"completed"`.

### Example

```bash
curl -X POST http://localhost:5050/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Write README","description":"Explain setup"}'

curl -X PUT http://localhost:5050/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{"status":"completed"}'

curl -X DELETE http://localhost:5050/tasks/1
```

## Architectural & Design Choices

- **In-memory store** — tasks live in a plain array in `server.js` keyed by an auto-incrementing `id`. No database or persistence layer was added since the brief explicitly allows it. Restarting the server resets state to a single seed task.
- **Single-file Express server** — at this scope, splitting into routes/controllers/services would be over-engineering. The four routes are short and live together for readability.
- **Validation at the boundary** — `POST` and `PUT` validate `title` (non-empty string) and `status` (enum). Other fields are coerced/trimmed. Errors return JSON with a `400` and a clear `error` message.
- **CORS enabled** — the API uses the `cors` middleware so the React dev server (or any frontend origin) can call it directly. The Vite dev server is also configured to proxy `/tasks`, so in development requests stay same-origin.
- **React with hooks, no global state library** — the app is small enough that local `useState` plus a single `useEffect` for initial load is the simplest correct solution. No Redux/Zustand/Context needed.
- **Optimistic-ish UI** — after each mutation, we update local state from the server's response (the canonical task), avoiding stale state without needing a refetch.
- **Vite + React** — chosen for fast install/startup. The dev proxy keeps API calls working without hardcoding a base URL; `VITE_API_URL` allows pointing to a different host in production builds.
- **Plain CSS** — one `styles.css` file. No CSS framework dependency keeps the install small and the styling transparent.

## Features

- Create, read, update, delete tasks
- Toggle task status via checkbox (pending ↔ completed)
- Edit task title and description in place
- Filter tasks by status (All / Pending / Completed)
- Live count of total and pending tasks
- Inline error display for failed API calls
- Responsive layout for narrow screens

## Assumptions & Limitations

- **No persistence**: the in-memory store is wiped on server restart. A real deployment would back this with Postgres/SQLite/Redis.
- **No authentication**: every client sees and edits the same task list. Multi-user support, auth, and per-user isolation are out of scope.
- **No tests**: given the assessment's "focus on functionality" guidance, automated tests were skipped. For a production build I'd add Jest/supertest for the API and React Testing Library for the components.
- **Single server instance**: because state is in-process memory, horizontally scaling the backend would lose consistency. Externalizing the store fixes this.
- **No pagination or search**: assumes a small task list. For larger lists, `/tasks` would need pagination, filtering, and sorting.
- **`id` is a numeric counter**: simple and predictable for a demo. UUIDs would be safer if any client ever became authoritative for IDs.
- **Description is optional and free-form**, capped to 500 chars on the client; the server only enforces type, not length.
