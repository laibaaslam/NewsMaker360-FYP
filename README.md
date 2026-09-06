# NewsMaker360

AI-powered news video analysis platform. Paste a YouTube news clip, and NewsMaker360 downloads the audio, transcribes and translates it to English, summarizes the story, counts named entities, extracts supporting context, and exports a PDF report.

This repository is the **Final Year Project** of:

- Haiqa Rauf
- Laiba Aslam
- Suniya Ehsan

Supervised by **Dr. Naeem Ahmed**.

---

## Features

- **YouTube ingest** — download audio from a news video URL (`yt-dlp`)
- **Speech-to-text** — chunked transcription with OpenAI Whisper, translated to English (GPT-4o-mini fallback)
- **Summarization** — English summary via Hugging Face `mT5_multilingual_XLSum`
- **Entity analysis** — frequency counts and sentence-level context for people/places you name
- **PDF report** — downloadable analysis report in the browser
- **Auth** — signup, email OTP verification (Mailtrap), login (JWT), forgot/reset password
- **User history** — saved reports (auto-expire after 4 days)
- **Admin console** — manage users and view activity (`/admin`)

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Axios, Formik/Yup, jsPDF |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Nodemailer |
| AI / ML | OpenAI Whisper, GPT-4o-mini, Hugging Face mT5, spaCy, fastcoref |
| Media | Python `yt-dlp`, FFmpeg |
| Email | Mailtrap SMTP (OTP and password reset) |

---

## How it works

```
YouTube URL
    → yt-dlp (audio download)
    → FFmpeg (60s chunks)
    → Whisper (+ GPT-4o-mini if needed) → English transcript
    → mT5 summary
    → entity frequency + contextual sentences
    → PDF report + MongoDB save
```

---

## Project structure

```
├── Frontend/          React app (Create React App) — http://localhost:3000
├── Backend/           Express API — http://localhost:8080
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── linkdownloader.py
│   ├── corefres.py
│   └── requirements.txt
├── defense-pptx/      Defense slides
└── package.json       Root scripts to run client + server together
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ (`python` or `py -3` on PATH)
- **MongoDB** running locally (default `mongodb://localhost:27017/NewsMaker360`)
- **FFmpeg** available (the backend also uses `ffmpeg-static` where possible)
- Accounts / keys:
  - [OpenAI API key](https://platform.openai.com/api-keys)
  - [Hugging Face token](https://huggingface.co/settings/tokens) (summarization)
  - [Mailtrap](https://mailtrap.io) inbox (OTP emails)

---

## Setup

### 1. Clone and install Node packages

```bash
git clone <your-repo-url>
cd fyp

npm install
cd Backend && npm install && cd ..
cd Frontend && npm install && cd ..
```

### 2. Python dependencies

From `Backend/`:

```bash
pip install -r requirements.txt
```

This installs spaCy, `en_core_web_sm`, fastcoref, transformers, and yt-dlp.

### 3. Environment variables

Copy the example file and fill in your own secrets. **Never commit `.env`.**

```bash
cp Backend/.env.example Backend/.env
```

| Variable | Purpose |
|---|---|
| `PORT` | Backend port (default `8080`) |
| `MONGO_URI` | MongoDB connection string |
| `SECRET_KEY` | JWT signing secret |
| `OPENAI_API_KEY` | Whisper + GPT-4o-mini |
| `HUGGINGFACE_API_KEY` | mT5 summarization |
| `MAILTRAP_USERNAME` | SMTP user for OTP / reset emails |
| `MAILTRAP_PASSWORD` | SMTP password |
| `PYTHON_EXECUTABLE` | Optional. Force a Python binary (e.g. `python` or `py`) |

The frontend talks to the API at `http://localhost:8080`. Keep the backend on port **8080** unless you also change those URLs.

### 4. Run

From the project root:

```bash
npm start
```

This starts the Express server and the React app together.

Or run them separately:

```bash
# terminal 1
cd Backend && npm start

# terminal 2
cd Frontend && npm start
```

- App: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:8080](http://localhost:8080)

---

## Usage

1. Open the app and **Sign up**. Check Mailtrap for the 4-digit OTP and verify the email.
2. **Log in**, then open **Generate**.
3. Paste a YouTube news URL and a comma-separated list of entities (for example `Imran Khan, Pakistan`).
4. Wait for download → transcription → summary → analysis.
5. Download the PDF. Past runs appear under **Activities**.

### Admin access

Users have `role: 0` by default. To make an admin, set `role` to `1` on that user in MongoDB, then sign in and open `/admin/dashboard`.

```js
db.users.updateOne(
  { email: "your-admin@example.com" },
  { $set: { role: 1 } }
)
```

---

## API (high level)

| Prefix | Role |
|---|---|
| `/api/auth` | Signup, login, current user, email verify, password reset |
| `/user/generate` | Audio extract, transcribe, summarize, frequency, context |
| `/api/reports` | Save / fetch user reports |
| `/api/admin` | Users and all activities (admin JWT required) |

---

## Security notes before GitHub

- `Backend/.env` is gitignored. Do **not** force-add it.
- If this repo was ever pushed with keys in `.env` or in source, **rotate** OpenAI, Hugging Face, Mailtrap, and `SECRET_KEY`.
- Keep the license private if this is an assessed academic project (`UNLICENSED` in `package.json`).

---

## License

UNLICENSED — academic project. All rights reserved by the authors unless you add a license before publishing.
