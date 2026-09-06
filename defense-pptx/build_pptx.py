"""Generate NewsMaker360 Final Defense PowerPoint."""
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor as RgbColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import nsmap
from lxml import etree

ROOT = Path(__file__).resolve().parent
SHOTS = ROOT / "screenshots"
OUT = ROOT / "NewsMaker360_Final_Defense.pptx"

NAVY = RgbColor(0x00, 0x1E, 0x35)
BLUE = RgbColor(0x00, 0x41, 0x70)
ACCENT = RgbColor(0x0F, 0x76, 0x6E)
LIGHT = RgbColor(0xF3, 0xF6, 0xF9)
WHITE = RgbColor(0xFF, 0xFF, 0xFF)
MUTED = RgbColor(0x5B, 0x6F, 0x82)
DARK = RgbColor(0x11, 0x18, 0x27)


def set_run(run, size=18, bold=False, color=DARK, font="Calibri"):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = font


def add_textbox(slide, left, top, width, height, text, size=18, bold=False, color=DARK, align=PP_ALIGN.LEFT, font="Calibri"):
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    set_run(run, size=size, bold=bold, color=color, font=font)
    return box


def add_bullets(slide, left, top, width, height, items, size=16, color=DARK):
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        p.level = 0
        p.space_after = Pt(8)
        run = p.add_run()
        run.text = item
        set_run(run, size=size, color=color)
    return box


def add_rect(slide, left, top, width, height, fill):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    return shape


def add_round_rect(slide, left, top, width, height, fill):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    return shape


def style_blank(slide):
    """Paint full slide light background."""
    add_rect(slide, Inches(0), Inches(0), Inches(13.333), Inches(7.5), LIGHT)


def add_footer(slide, page, total=16):
    add_rect(slide, Inches(0), Inches(7.15), Inches(13.333), Inches(0.35), NAVY)
    add_textbox(slide, Inches(0.4), Inches(7.18), Inches(8), Inches(0.3), "NewsMaker 360  |  Final Year Project Defense", size=11, color=WHITE)
    add_textbox(slide, Inches(11.2), Inches(7.18), Inches(1.8), Inches(0.3), f"{page} / {total}", size=11, color=WHITE, align=PP_ALIGN.RIGHT)


def add_title_bar(slide, title, subtitle=None):
    add_rect(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.15), NAVY)
    add_textbox(slide, Inches(0.5), Inches(0.25), Inches(12), Inches(0.5), title, size=28, bold=True, color=WHITE, font="Georgia")
    if subtitle:
        add_textbox(slide, Inches(0.5), Inches(0.7), Inches(12), Inches(0.35), subtitle, size=13, color=RgbColor(0xB8, 0xCF, 0xE0))


def fit_image(slide, path, left, top, max_w, max_h):
    from PIL import Image
    path = Path(path)
    if not path.exists():
        add_round_rect(slide, left, top, max_w, max_h, WHITE)
        add_textbox(slide, left, top + max_h / 2 - Inches(0.2), max_w, Inches(0.4), f"Missing: {path.name}", size=12, color=MUTED, align=PP_ALIGN.CENTER)
        return None
    with Image.open(path) as im:
        w, h = im.size
    aspect = w / h
    box_aspect = max_w / max_h
    if aspect > box_aspect:
        width = max_w
        height = max_w / aspect
    else:
        height = max_h
        width = max_h * aspect
    # center in box
    x = left + (max_w - width) / 2
    y = top + (max_h - height) / 2
    return slide.shapes.add_picture(str(path), x, y, width=width, height=height)


def caption_card(slide, left, top, width, height, title, path):
    add_round_rect(slide, left, top, width, height, WHITE)
    add_textbox(slide, left + Inches(0.15), top + Inches(0.08), width - Inches(0.3), Inches(0.3), title, size=13, bold=True, color=NAVY)
    fit_image(slide, path, left + Inches(0.15), top + Inches(0.4), width - Inches(0.3), height - Inches(0.55))


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]
    total = 16

    # 1 Title
    s = prs.slides.add_slide(blank)
    add_rect(s, Inches(0), Inches(0), Inches(13.333), Inches(7.5), NAVY)
    add_rect(s, Inches(0), Inches(0), Inches(0.25), Inches(7.5), ACCENT)
    add_textbox(s, Inches(0.9), Inches(1.6), Inches(11.5), Inches(0.5), "FINAL YEAR PROJECT DEFENSE", size=16, color=RgbColor(0x7E, 0xB8, 0xE0), bold=True)
    add_textbox(s, Inches(0.9), Inches(2.15), Inches(11.5), Inches(1.0), "NewsMaker 360", size=48, bold=True, color=WHITE, font="Georgia")
    add_textbox(s, Inches(0.9), Inches(3.2), Inches(11.5), Inches(0.6), "AI-Powered News Video Analysis Platform", size=22, color=RgbColor(0xB8, 0xCF, 0xE0))
    add_textbox(s, Inches(0.9), Inches(4.3), Inches(11.5), Inches(1.4),
                "Undertaken by:\nHaiqa Rauf\nLaiba Aslam\nSuniya Ehsan",
                size=16, color=WHITE)
    add_textbox(s, Inches(0.9), Inches(6.2), Inches(11.5), Inches(0.5), "Supervised by: Dr. Naeem Ahmed", size=16, bold=True, color=RgbColor(0x7E, 0xB8, 0xE0))

    # 2 Agenda
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Agenda")
    add_footer(s, 2, total)
    items = [
        "1. Introduction & Problem Statement",
        "2. Objectives & Scope",
        "3. System Architecture & Technology Stack",
        "4. AI Pipeline (Whisper, GPT-4o-mini, mT5)",
        "5. System Modules & User Interface Walkthrough",
        "6. Admin Panel, Activities & Analytics Graphs",
        "7. Results, Limitations & Future Work",
        "8. Conclusion & Q/A",
    ]
    add_bullets(s, Inches(1.0), Inches(1.6), Inches(11), Inches(5), items, size=20)

    # 3 Introduction
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Introduction", "What is NewsMaker 360?")
    add_footer(s, 3, total)
    add_round_rect(s, Inches(0.6), Inches(1.5), Inches(12.1), Inches(5.2), WHITE)
    add_textbox(s, Inches(0.95), Inches(1.8), Inches(11.4), Inches(1.2),
                "NewsMaker 360 is a web-based platform that converts YouTube news videos into structured English analysis reports.",
                size=18, color=DARK)
    add_bullets(s, Inches(0.95), Inches(3.1), Inches(11.4), Inches(3.2), [
        "Extracts audio from YouTube news clips",
        "Transcribes speech into English text using AI",
        "Generates abstractive summaries",
        "Analyzes entity frequency and contextual mentions",
        "Exports a downloadable PDF report for users",
        "Provides admin tools for users, activities, and analytics",
    ], size=17)

    # 4 Problem
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Problem Statement")
    add_footer(s, 4, total)
    cards = [
        ("Time-consuming", "Watching long multilingual news videos and manually extracting key points is slow."),
        ("Language barrier", "Urdu and other languages make quick English reporting difficult without translation."),
        ("No structured output", "Existing tools lack entity frequency, context extraction, and ready PDF reports."),
    ]
    for i, (t, d) in enumerate(cards):
        left = Inches(0.6 + i * 4.15)
        add_round_rect(s, left, Inches(1.8), Inches(3.9), Inches(4.2), WHITE)
        add_rect(s, left, Inches(1.8), Inches(3.9), Inches(0.15), ACCENT if i == 1 else BLUE)
        add_textbox(s, left + Inches(0.25), Inches(2.2), Inches(3.4), Inches(0.6), t, size=20, bold=True, color=NAVY)
        add_textbox(s, left + Inches(0.25), Inches(3.0), Inches(3.4), Inches(2.5), d, size=16, color=MUTED)

    # 5 Objectives
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Objectives")
    add_footer(s, 5, total)
    add_bullets(s, Inches(0.9), Inches(1.6), Inches(11.5), Inches(5), [
        "Automate speech-to-text conversion for YouTube news videos",
        "Produce clear English summaries from multilingual audio",
        "Enable entity-based frequency and contextual analysis",
        "Generate professional PDF reports for research and media use",
        "Provide secure user authentication and admin management",
        "Visualize system usage through admin analytics dashboards",
    ], size=19)

    # 6 Architecture
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "System Architecture", "MERN-style full-stack design")
    add_footer(s, 6, total)
    layers = [
        ("Frontend", "React.js\nUI, Auth, PDF\nDashboard"),
        ("Backend", "Node.js / Express\nREST APIs\nJWT Auth"),
        ("Database", "MongoDB\nUsers & Reports\nNewsMaker360 DB"),
        ("AI Services", "OpenAI Whisper\nGPT-4o-mini\nmT5 XLSum"),
    ]
    for i, (t, d) in enumerate(layers):
        left = Inches(0.55 + i * 3.2)
        add_round_rect(s, left, Inches(2.0), Inches(2.95), Inches(3.8), WHITE)
        add_rect(s, left, Inches(2.0), Inches(2.95), Inches(0.7), NAVY)
        add_textbox(s, left + Inches(0.1), Inches(2.15), Inches(2.75), Inches(0.45), t, size=18, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        add_textbox(s, left + Inches(0.2), Inches(3.0), Inches(2.55), Inches(2.4), d, size=15, color=DARK, align=PP_ALIGN.CENTER)

    # 7 Tech stack
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Technology Stack")
    add_footer(s, 7, total)
    cols = [
        ("Frontend", ["React 18", "React Router", "Axios", "jsPDF + html2canvas", "CanvasJS Charts", "Formik / Yup"]),
        ("Backend", ["Node.js", "Express", "JWT + bcrypt", "Mongoose", "FFmpeg", "yt-dlp"]),
        ("AI / Data", ["OpenAI Whisper-1", "GPT-4o-mini", "Hugging Face mT5", "MongoDB", "Regex entity match"]),
    ]
    for i, (title, items) in enumerate(cols):
        left = Inches(0.6 + i * 4.2)
        add_round_rect(s, left, Inches(1.55), Inches(3.95), Inches(5.2), WHITE)
        add_textbox(s, left + Inches(0.25), Inches(1.75), Inches(3.4), Inches(0.45), title, size=20, bold=True, color=NAVY)
        add_bullets(s, left + Inches(0.25), Inches(2.4), Inches(3.4), Inches(4), items, size=16)

    # 8 AI Pipeline
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "AI / Processing Pipeline")
    add_footer(s, 8, total)
    steps = [
        ("1", "YouTube Audio", "yt-dlp + FFmpeg"),
        ("2", "Speech → English", "Whisper-1"),
        ("3", "Fallback Translate", "GPT-4o-mini"),
        ("4", "Summarization", "mT5 XLSum"),
        ("5", "Entity Analysis", "Regex / sentences"),
        ("6", "PDF Report", "jsPDF + html2canvas"),
    ]
    for i, (n, t, d) in enumerate(steps):
        row = i // 3
        col = i % 3
        left = Inches(0.6 + col * 4.2)
        top = Inches(1.55 + row * 2.55)
        add_round_rect(s, left, top, Inches(3.95), Inches(2.25), WHITE)
        circle = s.shapes.add_shape(MSO_SHAPE.OVAL, left + Inches(0.25), top + Inches(0.35), Inches(0.55), Inches(0.55))
        circle.fill.solid()
        circle.fill.fore_color.rgb = BLUE
        circle.line.fill.background()
        add_textbox(s, left + Inches(0.25), top + Inches(0.42), Inches(0.55), Inches(0.4), n, size=16, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
        add_textbox(s, left + Inches(1.0), top + Inches(0.4), Inches(2.7), Inches(0.5), t, size=16, bold=True, color=NAVY)
        add_textbox(s, left + Inches(1.0), top + Inches(1.05), Inches(2.7), Inches(0.7), d, size=14, color=MUTED)

    # 9 Models note
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Models Used (No Custom Training)")
    add_footer(s, 9, total)
    rows = [
        ("Whisper-1 (OpenAI)", "Speech-to-text / translation to English"),
        ("GPT-4o-mini (OpenAI)", "Fallback text translation to English"),
        ("mT5 XLSum (Hugging Face)", "Abstractive news summarization"),
        ("Entity Finding", "No AI model — user input + regex matching"),
    ]
    for i, (a, b) in enumerate(rows):
        top = Inches(1.55 + i * 1.2)
        add_round_rect(s, Inches(0.7), top, Inches(12), Inches(1.05), WHITE)
        add_rect(s, Inches(0.7), top, Inches(0.15), Inches(1.05), ACCENT if i == 3 else BLUE)
        add_textbox(s, Inches(1.1), top + Inches(0.2), Inches(5), Inches(0.6), a, size=18, bold=True, color=NAVY)
        add_textbox(s, Inches(6.3), top + Inches(0.2), Inches(6), Inches(0.6), b, size=16, color=MUTED)

    # 10 UI: Home + Auth
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "User Interface — Homepage & Authentication")
    add_footer(s, 10, total)
    caption_card(s, Inches(0.35), Inches(1.4), Inches(4.15), Inches(5.4), "Homepage", SHOTS / "homepage.png")
    caption_card(s, Inches(4.6), Inches(1.4), Inches(4.15), Inches(5.4), "Sign Up", SHOTS / "signup.png")
    caption_card(s, Inches(8.85), Inches(1.4), Inches(4.15), Inches(5.4), "Login", SHOTS / "login.png")

    # 11 Generate dashboard
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "User Dashboard — Report Generation")
    add_footer(s, 11, total)
    caption_card(s, Inches(0.5), Inches(1.4), Inches(12.3), Inches(5.45), "Generate report from YouTube link + optional entities", SHOTS / "user-dashboard.png")

    # 12 Admin users + add user
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Admin Panel — Users & Add User")
    add_footer(s, 12, total)
    caption_card(s, Inches(0.4), Inches(1.4), Inches(6.2), Inches(5.4), "Admin Users Directory", SHOTS / "admin-users.png")
    caption_card(s, Inches(6.75), Inches(1.4), Inches(6.2), Inches(5.4), "Add User", SHOTS / "admin-add-user.png")

    # 13 Activities
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Recent Activities")
    add_footer(s, 13, total)
    caption_card(s, Inches(0.5), Inches(1.4), Inches(12.3), Inches(5.45), "Admin activity feed — all generated reports across users", SHOTS / "admin-activities.png")

    # 14 Graphs
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Analytics Graphs (Live System)")
    add_footer(s, 14, total)
    caption_card(s, Inches(0.35), Inches(1.35), Inches(6.3), Inches(5.5), "Activities over last 14 days", SHOTS / "admin-dashboard-graphs.png")
    caption_card(s, Inches(6.8), Inches(1.35), Inches(6.2), Inches(5.5), "Activities by user + activity share", SHOTS / "admin-dashboard-charts-detail.png")

    # 15 Homepage chart + results
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Homepage Insight Graph & Key Results")
    add_footer(s, 15, total)
    caption_card(s, Inches(0.4), Inches(1.4), Inches(7.4), Inches(5.4), "Language Based News Audience (Homepage)", SHOTS / "homepage-chart.png")
    add_round_rect(s, Inches(8.0), Inches(1.4), Inches(4.9), Inches(5.4), WHITE)
    add_textbox(s, Inches(8.25), Inches(1.65), Inches(4.4), Inches(0.4), "Key Outcomes", size=18, bold=True, color=NAVY)
    add_bullets(s, Inches(8.25), Inches(2.2), Inches(4.4), Inches(4.2), [
        "End-to-end YouTube → PDF pipeline",
        "Multilingual audio → English text",
        "Entity frequency + context reports",
        "Admin analytics with CanvasJS",
        "Secure JWT auth + role-based admin",
        "No model training — pre-trained APIs",
    ], size=14)

    # 16 Conclusion
    s = prs.slides.add_slide(blank)
    style_blank(s)
    add_title_bar(s, "Conclusion & Future Work")
    add_footer(s, 16, total)
    add_round_rect(s, Inches(0.5), Inches(1.5), Inches(6.0), Inches(5.2), WHITE)
    add_textbox(s, Inches(0.8), Inches(1.75), Inches(5.4), Inches(0.4), "Conclusion", size=20, bold=True, color=NAVY)
    add_bullets(s, Inches(0.8), Inches(2.35), Inches(5.4), Inches(4), [
        "NewsMaker 360 automates news video analysis",
        "Combines Whisper, GPT-4o-mini, and mT5",
        "Delivers summary, entity insights, and PDF",
        "Admin tools support monitoring and control",
    ], size=15)
    add_round_rect(s, Inches(6.8), Inches(1.5), Inches(6.0), Inches(5.2), WHITE)
    add_textbox(s, Inches(7.1), Inches(1.75), Inches(5.4), Inches(0.4), "Future Work", size=20, bold=True, color=NAVY)
    add_bullets(s, Inches(7.1), Inches(2.35), Inches(5.4), Inches(4), [
        "Automatic NER for entity detection",
        "Coreference resolution (spaCy/fastcoref)",
        "Speaker diarization & sentiment analysis",
        "Local/offline model options",
        "Queue-based scalable processing",
    ], size=15)

    # Thank you
    s = prs.slides.add_slide(blank)
    add_rect(s, Inches(0), Inches(0), Inches(13.333), Inches(7.5), NAVY)
    add_textbox(s, Inches(0.8), Inches(2.4), Inches(11.7), Inches(1), "Thank You", size=52, bold=True, color=WHITE, align=PP_ALIGN.CENTER, font="Georgia")
    add_textbox(s, Inches(0.8), Inches(3.5), Inches(11.7), Inches(0.6), "Questions & Answers", size=24, color=RgbColor(0x7E, 0xB8, 0xE0), align=PP_ALIGN.CENTER)
    add_textbox(s, Inches(0.8), Inches(4.6), Inches(11.7), Inches(1.2),
                "Haiqa Rauf  ·  Laiba Aslam  ·  Suniya Ehsan\nSupervisor: Dr. Naeem Ahmed",
                size=16, color=WHITE, align=PP_ALIGN.CENTER)

    prs.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    build()
