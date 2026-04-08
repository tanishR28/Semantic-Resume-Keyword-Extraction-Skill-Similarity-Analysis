"""Streamlit application for semantic resume and job-description matching."""

from __future__ import annotations

import importlib
import os

import streamlit as st

try:
	load_dotenv = importlib.import_module("dotenv").load_dotenv
except Exception:  # pragma: no cover - optional dependency fallback
	def load_dotenv(*args, **kwargs):
		return False

from src.matching import analyze_match
from utils.constants import DEFAULT_GROQ_MODEL
from utils.pdf_parser import extract_text_from_pdf


load_dotenv()


st.set_page_config(
	page_title="Semantic Resume Matcher",
	page_icon="🧠",
	layout="wide",
	initial_sidebar_state="expanded",
)


GROQ_MODEL_OPTIONS = [
	"llama3-8b-8192",
	"llama3-70b-8192",
	"llama-3.1-8b-instant",
	"llama-3.3-70b-versatile",
	"mixtral-8x7b-32768",
	"gemma2-9b-it",
]


def inject_styles() -> None:
	st.markdown(
		"""
		<style>
		@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap');

		:root {
			--ink: #111827;
			--muted-ink: #334155;
			--card: rgba(255, 255, 255, 0.9);
			--line: rgba(15, 23, 42, 0.15);
			--primary: #0f766e;
			--accent: #fb923c;
		}

		html, body, [class*="css"], .stMarkdown, .stText, .stMetricLabel, .stMetricValue {
			font-family: 'Manrope', sans-serif;
			color: var(--ink);
		}

		.stApp {
			background:
				radial-gradient(circle at 10% 10%, rgba(251, 146, 60, 0.2), transparent 28%),
				radial-gradient(circle at 90% 5%, rgba(15, 118, 110, 0.2), transparent 30%),
				linear-gradient(180deg, #fffaf2 0%, #f9fafb 45%, #ecfeff 100%);
		}

		section[data-testid="stSidebar"] {
			background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
			border-right: 1px solid rgba(255, 255, 255, 0.08);
		}

		section[data-testid="stSidebar"] * {
			color: #f8fafc !important;
		}

		section[data-testid="stSidebar"] .stTextInput input,
		section[data-testid="stSidebar"] .stSelectbox div[data-baseweb="select"] > div {
			background: rgba(255, 255, 255, 0.08) !important;
			border: 1px solid rgba(255, 255, 255, 0.2) !important;
		}

		.hero {
			padding: 1.4rem 1.45rem;
			border: 1px solid var(--line);
			border-radius: 22px;
			background: var(--card);
			backdrop-filter: blur(8px);
			box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
			margin-bottom: 1rem;
		}

		.panel {
			background: var(--card);
			border: 1px solid var(--line);
			border-radius: 18px;
			padding: 0.9rem 1rem 0.6rem 1rem;
			box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
		}

		.panel h4 {
			margin-top: 0;
			margin-bottom: 0.6rem;
			font-weight: 800;
			color: var(--muted-ink);
		}

		.resume-upload-label {
			margin: 0 0 0.35rem 0;
			font-weight: 800;
			color: #b91c1c;
			font-size: 0.98rem;
		}

		.upload-drop-label {
			margin: 0.15rem 0 0.45rem 0;
			font-weight: 400;
			color: #de3163;
			font-size: 0.95rem;
		}

		div[data-testid="stMetric"] {
			background: rgba(255, 255, 255, 0.85);
			border: 1px solid var(--line);
			border-radius: 14px;
			padding: 0.65rem 0.8rem;
		}

		div[data-testid="stProgress"] > div > div {
			background: linear-gradient(90deg, var(--primary), var(--accent));
		}

		.stButton button {
			background: linear-gradient(135deg, #0f766e, #155e75);
			border: none;
			color: #ffffff;
			font-weight: 700;
			padding: 0.7rem 1rem;
			border-radius: 12px;
		}

		.stButton button:hover {
			filter: brightness(1.06);
		}

		.skill-badge {
			display: inline-block;
			margin: 0.15rem 0.35rem 0.15rem 0;
			padding: 0.35rem 0.7rem;
			border-radius: 999px;
			background: #0f172a;
			color: #fff;
			font-size: 0.82rem;
			line-height: 1.2rem;
		}

		.skill-badge.missing {
			background: #9a3412;
		}
		</style>
		""",
		unsafe_allow_html=True,
	)


def render_skill_badges(skills: list[str], missing: bool = False) -> None:
	if not skills:
		st.caption("None detected.")
		return

	class_name = "skill-badge missing" if missing else "skill-badge"
	badges = "".join(f'<span class="{class_name}">{skill}</span>' for skill in skills)
	st.markdown(f"<div>{badges}</div>", unsafe_allow_html=True)


def main() -> None:
	inject_styles()

	from src.agent import generate_ai_insight

	st.markdown(
		"""
		<div class="hero">
			<h1 style="margin-bottom:0.4rem;">Semantic Resume Matching System</h1>
			<p style="margin:0; color:#475569; font-size:1.02rem;">
				Upload a resume PDF and compare it against a job description using NLP, embeddings,
				skill extraction, and optional Groq-powered feedback.
			</p>
		</div>
		""",
		unsafe_allow_html=True,
	)

	with st.sidebar:
		st.header("Settings")
		api_key = st.text_input(
			"Groq API key (optional)",
			type="password",
			value=os.getenv("GROQ_API_KEY", ""),
			help="If provided, the app will generate a richer LLM-based insight; otherwise it uses a local fallback.",
		)
		default_index = GROQ_MODEL_OPTIONS.index(DEFAULT_GROQ_MODEL) if DEFAULT_GROQ_MODEL in GROQ_MODEL_OPTIONS else 0
		model_name = st.selectbox("Groq model", options=GROQ_MODEL_OPTIONS, index=default_index)
		show_extracted_text = st.checkbox("Show extracted resume text", value=True)

	left, right = st.columns([1, 1])
	with left:
		with st.container(border=True):
			st.markdown('<div class="panel"><h4>Resume Input</h4></div>', unsafe_allow_html=True)
			st.markdown('<p class="resume-upload-label">Upload resume PDF</p>', unsafe_allow_html=True)
			st.markdown('<p class="upload-drop-label">Drag and drop your resume PDF here</p>', unsafe_allow_html=True)
			uploaded_resume = st.file_uploader(
				"Upload resume file",
				type=["pdf"],
				help="You can drag and drop a PDF file here or click to browse.",
				label_visibility="collapsed",
			)

	with right:
		with st.container(border=True):
			st.markdown('<div class="panel"><h4>Job Description</h4></div>', unsafe_allow_html=True)
			job_description = st.text_area(
				"Paste job description",
				height=320,
				placeholder="Paste the job description here. Include responsibilities, required skills, and preferred qualifications.",
			)

	analyze_clicked = st.button("Analyze Match", type="primary", use_container_width=True)

	if not analyze_clicked:
		st.info("Upload a resume PDF and paste a job description to generate the analysis.")
		return

	if uploaded_resume is None:
		st.error("Please upload a resume PDF before running the analysis.")
		return

	if not job_description.strip():
		st.error("Please paste a job description before running the analysis.")
		return

	with st.spinner("Reading the resume and running the NLP pipeline..."):
		resume_text = extract_text_from_pdf(uploaded_resume)
		if not resume_text.strip():
			st.warning(
				"I could not extract selectable text from this PDF. If the file is scanned or image-based, "
				"you will need OCR to read it."
			)
		result = analyze_match(resume_text, job_description)
		ai_insight = generate_ai_insight(
			result,
			resume_text=resume_text,
			job_description=job_description,
			api_key=api_key,
			model=model_name or DEFAULT_GROQ_MODEL,
		)

	score_percent = round(result.similarity_score * 100, 2)
	coverage_percent = round(result.skill_coverage * 100, 2)

	metric_left, metric_mid, metric_right = st.columns(3)
	metric_left.metric("Semantic similarity", f"{score_percent:.2f}%")
	metric_mid.metric("Skill coverage", f"{coverage_percent:.2f}%")
	metric_right.metric("Detected JD skills", str(len(result.jd_skills)))

	st.progress(min(max(result.similarity_score, 0.0), 1.0))

	detail_left, detail_right = st.columns(2)
	with detail_left:
		st.subheader("Matched skills")
		render_skill_badges(result.matched_skills)

	with detail_right:
		st.subheader("Missing skills")
		render_skill_badges(result.missing_skills, missing=True)

	insight_panel = st.container()
	with insight_panel:
		st.subheader("AI insight")
		st.markdown(f"<div class='panel'><div style='color:#0f172a;'>{ai_insight}</div></div>", unsafe_allow_html=True)

	if result.analysis_notes:
		st.warning(" ".join(result.analysis_notes))

	st.caption(f"Embedding backend: {result.embedding_backend}")

	if show_extracted_text:
		st.subheader("Extracted resume text")
		if resume_text.strip():
			st.text_area("Resume text", value=resume_text, height=220)
		else:
			st.info("No selectable text was extracted from this PDF. This usually means the file is scanned or image-only.")


if __name__ == "__main__":
	main()

