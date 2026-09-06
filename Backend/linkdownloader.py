import json
import os
import sys
from pathlib import Path

from yt_dlp import YoutubeDL

SCRIPT_DIR = Path(__file__).resolve().parent
DOWNLOADS_DIR = SCRIPT_DIR / "Downloads"
MARKER_FILE = DOWNLOADS_DIR / "last_download.json"


def fail(message: str) -> None:
    print(message, file=sys.stderr, flush=True)
    sys.exit(1)


if len(sys.argv) < 2:
    fail("Missing YouTube URL")

url = sys.argv[1].strip()
DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)

try:
    probe_opts = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
    }
    with YoutubeDL(probe_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        video_id = info.get("id") or "unknown"

    outtmpl = str(DOWNLOADS_DIR / f"audio_{video_id}.%(ext)s")
    ydl_opts = {
        "format": "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best",
        "outtmpl": outtmpl,
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "overwrites": True,
        "nopart": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        prepared = ydl.prepare_filename(info)

    candidates = []
    requested = info.get("requested_downloads") or []
    for item in requested:
        filepath = item.get("filepath")
        if filepath:
            candidates.append(filepath)
    if prepared:
        candidates.append(prepared)

    # Prefer any existing audio_<id>.* file yt-dlp may have produced.
    candidates.extend(str(path) for path in DOWNLOADS_DIR.glob(f"audio_{video_id}.*"))

    file_path = None
    for candidate in candidates:
        if candidate and os.path.exists(candidate) and not candidate.endswith(".part"):
            file_path = os.path.abspath(candidate)
            break

    if not file_path:
        fail(f"Downloaded audio not found for video id {video_id}. Tried: {candidates}")

    marker = {
        "path": file_path,
        "videoId": video_id,
        "url": url,
    }
    MARKER_FILE.write_text(json.dumps(marker), encoding="utf-8")

    # Keep path token on its own stdout line for Node parsing.
    sys.stdout.write(f"DOWNLOAD_PATH:{file_path}\n")
    sys.stdout.flush()
except Exception as error:
    fail(str(error))
