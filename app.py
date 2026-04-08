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


def inject_styles() -> None:
	st.markdown(
		"""
		<style>
		@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

		html, body, [class*="css"] {
			font-family: 'Space Grotesk', sans-serif;
		}

		.stApp {
			background:
				radial-gradient(circle at top left, rgba(248, 196, 133, 0.18), transparent 32%),
				radial-gradient(circle at top right, rgba(120, 146, 255, 0.16), transparent 28%),
				linear-gradient(180deg, #fcfbf7 0%, #f7f4ee 48%, #eef4ff 100%);
		}

		.hero {
			padding: 1.25rem 1.35rem;
			border: 1px solid rgba(55, 65, 81, 0.12);
			border-radius: 22px;
			background: rgba(255, 255, 255, 0.75);
			backdrop-filter: blur(8px);
			box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
			margin-bottom: 1rem;
		}

		.skill-badge {
			display: inline-block;
			margin: 0.15rem 0.35rem 0.15rem 0;
			padding: 0.35rem 0.7rem;
			border-radius: 999px;
			background: #111827;
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
		model_name = st.text_input("Groq model", value=DEFAULT_GROQ_MODEL)
		show_extracted_text = st.checkbox("Show extracted resume text", value=False)

	left, right = st.columns([1, 1])
	with left:
		with st.container(border=True):
			uploaded_resume = st.file_uploader("Upload resume PDF", type=["pdf"])

	with right:
		with st.container(border=True):
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
		st.write(ai_insight)

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

