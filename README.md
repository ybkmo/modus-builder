# MODUS Builder

AI-powered website builder SaaS. Create stunning websites with AI-generated blocks, manage projects, and deploy to the edge.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** 13+ (or use Docker)
- **npm** 8+ or **yarn**
- *(Optional)* **Docker** & **Docker Compose** for one-command infrastructure

---

## Quick Setup

```bash
git clone https://github.com/your-org/modus-builder.git
cd modus-builder
npm install
npm run setup   # runs scripts/setup.sh
```

`setup.sh` will:
1. Create required directories
2. Install root, frontend, and backend dependencies
3. Copy `.env.example` → `.env`
4. Initialise the PostgreSQL database (`db/schema.sql` + `db/seed.sql`)

> **Windows users:** Run the script inside Git Bash or WSL.

---

## Development

Start frontend and backend concurrently:

```bash
npm run dev
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:3001

---

## Build

```bash
npm run build
```

Compiles the frontend into `frontend/dist`.

---

## Test

```bash
npm run test
```

Runs the full test suite (frontend + backend).

---

## Deploy

```bash
npm run deploy   # runs scripts/deploy.sh
```

Or use Docker:

```bash
cd docker
docker-compose up --build
```

The app will be available on **http://localhost:3001**.

---

## Architecture

```text
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │◄───────►│   Backend API   │
│  (React/Vite)  │  HTTP   │   (Node/Express)│
│   :3000        │         │    :3001        │
└─────────────────┘         └────────┬────────┘
                                     │
                        ┌────────────┼────────────┐
                        ▼            ▼            ▼
                   ┌─────────┐  ┌─────────┐  ┌─────────┐
                   │  AI     │  │   DB    │  │  Redis  │
                   │ OpenAI  │  │Postgres │  │  Cache  │
                   │ Claude  │  │ :5432   │  │ :6379   │
                   └─────────┘  └─────────┘  └─────────┘
```

---

## Project Structure

```
modus-builder/
├── db/                  # PostgreSQL schema + seed
├── docker/              # Dockerfile + docker-compose
├── frontend/            # React SPA (other agent)
├── backend/             # Node API (other agent)
├── lib/
│   ├── ai/              # OpenAI / Anthropic wrappers + cache
│   └── deploy/          # Vercel / Netlify stubs
├── scripts/             # setup.sh + deploy.sh
├── .env.example         # Environment variables
├── package.json         # Root workspace scripts
└── README.md            # You are here
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your secrets.

See `.env.example` for the full list of variables (frontend, backend, AI keys, DB, Redis).

---

## License

MIT © MODUS Builder Team
