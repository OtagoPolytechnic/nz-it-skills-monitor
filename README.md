# NZ IT Skills Monitor

The **NZ IT Skills Monitor** is a full-stack web application that scrapes job postings from **Seek** in New Zealand, extracts skills, stores them in a database, and displays them through an interactive dashboard.  

This project is used for learning **web scraping, databases, backend APIs, and frontend visualisation**. It was originally built as a student project at **Otago Polytechnic** and is intended to help future students quickly understand how the system works and how to extend it.

---

##  Purpose

The goal is to analyse the New Zealand job market by:  
- Identifying **most in-demand programming languages, frameworks, and tools**.  
- Showing **salary distributions** and **job posting trends**.  
- Providing a **visual dashboard** instead of manually scanning hundreds of job listings.  

---

##  Tech Stack

- **Frontend**: React, TailwindCSS, Recharts  
- **Backend**: Python, Flask, SQLAlchemy, Scrapy  
- **Database**: PostgreSQL (Neon DB or local)  
- **Other**: Alembic (for migrations), venv for Python environment  

---

##  How the System Works

1. **Scrapy Spider** (`seekspider`)  
   - Crawls Seek job ads.  
   - Extracts title, company, location, salary, and skills.  
   - Normalises skills (`Python`, `PYTHON`, `python` → `python`).  

2. **Database (PostgreSQL)**  
   - Stores jobs and related skills.  
   - Prevents duplicates (same job ad is skipped).  

3. **Flask API**  
   - Provides endpoints like `/api/skills`, `/api/salaries`, `/api/jobs-over-time`.  
   - Runs SQL queries and returns JSON.  

4. **React Frontend**  
   - Fetches data from the Flask API.  
   - Renders charts (bar, pie, wordcloud) that users can expand and filter.  

---

##  Environment Variables Explained

- `DATABASE_URL` → Connection string for PostgreSQL.  
- `FLASK_APP` → Tells Flask which file contains the app.  
- `SECRET_KEY` → Security token for Flask sessions.  
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` → Login credentials for admin features.  
- `VITE_API_URL` (frontend) → The backend API address (usually `http://127.0.0.1:5000`).  

---

#  Setup Instructions

## Frontend Setup

1. Create `.env` in `frontend/`:
   ```env
   VITE_API_URL=http://127.0.0.1:5000
   ```

2. Install and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Runs at [http://localhost:5173](http://localhost:5173).

---

## Backend Setup

1. Create `.env` in `backend/`:
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   FLASK_APP=index.py
   SECRET_KEY='NZITSkillsMonitorApplication'
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="Password"
   ```

2. Setup and run:
   ```bash
   cd backend
   py -m venv .venv
   .venv\Scripts\activate     # Windows
   source .venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   python index.py
   ```
   API runs at [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

## Database Migrations

**Why?**  
When models change, the database must be updated. Instead of dropping everything, migrations apply changes safely.  

Run:
```bash
cd backend
.venv\Scripts\activate
flask db upgrade
```

---

## Run the Scraper

**Why?**  
The database starts empty. You need to run the spider to fetch job data.  

```bash
cd backend/itjobscraper/itjobscraper
scrapy crawl seekspider
```

This fills the database with fresh Seek job ads.

---

#  API Reference

### `GET /api/skills`
Returns skills and frequencies:
```json
[
  {"skill": "Python", "count": 523},
  {"skill": "JavaScript", "count": 417}
]
```

### `GET /api/salaries`
```json
{
  "average": 93000,
  "median": 92000,
  "min": 55000,
  "max": 150000
}
```

### `GET /api/jobs-over-time`
```json
[
  {"month": "2025-06", "count": 134},
  {"month": "2025-07", "count": 152}
]
```

---

##  Known Issues

- Only **Seek** spider is active (Trade Me not enabled).  
- Salary extraction can be inconsistent.  
- Charts may load slowly without precomputation.  

---

##  Roadmap

- Add Trade Me spider back  
- Precompute summaries for faster chart load  
- Extend synonym mapping for skills  
- Add timeframe filters  
- CSV/Excel export for all charts  

---

##  Notes for Future Students

- Always check `.env` files — most setup issues come from incorrect environment variables.  
- Run **`flask db upgrade`** whenever models are changed, or migrations won’t match the DB.  
- The spider must be run before charts show data. No jobs in DB = empty charts.  
- Skill normalisation is important: extend the synonym map as you find duplicates (e.g., `React.js` vs `React`).  
- If frontend can’t connect, verify `VITE_API_URL` in `frontend/.env` points to the backend.  
- For experiments, you can run the spider with `-O output.json` to quickly test without DB.  

---

##  License

This project was developed as part of an academic course at Otago Polytechnic.  
You may reuse for educational purposes.
