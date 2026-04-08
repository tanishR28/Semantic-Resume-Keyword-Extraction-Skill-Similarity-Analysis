"""Shared constants and skill catalog for resume matching."""

from __future__ import annotations

DEFAULT_EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DEFAULT_GROQ_MODEL = "llama3-8b-8192"
MAX_AI_OUTPUT_CHARS = 1200

SKILL_ALIASES: dict[str, list[str]] = {
    "Python": ["python"],
    "Java": ["java"],
    "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript", "ts"],
    "C++": ["c++", "cpp"],
    "C#": ["c#", "c sharp"],
    "SQL": ["sql", "structured query language"],
    "HTML": ["html"],
    "CSS": ["css"],
    "React": ["react", "reactjs", "react.js"],
    "Node.js": ["node.js", "nodejs", "node js"],
    "Django": ["django"],
    "Flask": ["flask"],
    "FastAPI": ["fastapi", "fast api"],
    "REST APIs": ["rest api", "restful api", "rest apis"],
    "Git": ["git"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "Linux": ["linux"],
    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure", "microsoft azure"],
    "GCP": ["gcp", "google cloud", "google cloud platform"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo db"],
    "Redis": ["redis"],
    "Kafka": ["kafka", "apache kafka"],
    "Airflow": ["airflow", "apache airflow"],
    "Spark": ["spark", "apache spark"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "TensorFlow": ["tensorflow", "tensor flow"],
    "PyTorch": ["pytorch", "py torch"],
    "spaCy": ["spacy", "spa cy"],
    "NLTK": ["nltk"],
    "Transformers": ["transformers", "hugging face transformers"],
    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning", "dl"],
    "Natural Language Processing": ["natural language processing", "nlp"],
    "MLOps": ["mlops", "machine learning operations"],
    "Data Analysis": ["data analysis", "analytical skills"],
    "Data Science": ["data science"],
    "Statistics": ["statistics"],
    "Communication": ["communication", "written communication", "verbal communication"],
    "Leadership": ["leadership", "team leadership"],
    "Problem Solving": ["problem solving", "problem-solving"],
}

SKILL_CATALOG = tuple(SKILL_ALIASES.keys())
