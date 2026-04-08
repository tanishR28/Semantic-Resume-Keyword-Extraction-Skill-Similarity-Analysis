# 🧠 Semantic Resume Matching System with Agentic AI

## 📌 Overview

This project is an NLP-based system designed to perform **semantic matching between resumes and job descriptions**. Unlike traditional Applicant Tracking Systems (ATS) that rely on keyword matching, this system leverages **vector embeddings and similarity analysis** to understand contextual meaning.

An **Agentic AI layer powered by Groq LLMs** is integrated to provide **intelligent explanations, skill gap analysis, and personalized improvement suggestions**.

---

## 🚀 Features

* 📄 Resume parsing (PDF support)
* 🧹 Text preprocessing (tokenization, stopword removal, lemmatization)
* 🧠 Skill extraction using NLP techniques
* 🔗 Semantic embeddings using Sentence-BERT
* 📊 Cosine similarity-based matching
* 💡 Explainable AI (matched & missing skills)
* 🤖 Agentic AI insights using Groq (LLaMA models)
* 🌐 Interactive UI using Streamlit

---

## 🧠 System Architecture

```
Resume + Job Description
        ↓
Text Preprocessing (spaCy)
        ↓
Skill Extraction
        ↓
Embedding Generation (Sentence-BERT)
        ↓
Similarity Computation (Cosine Similarity)
        ↓
Skill Matching (Explainability)
        ↓
🤖 Agentic AI Layer (Groq LLM)
        ↓
Final Output (Score + Insights)
```

---

## 🛠️ Tech Stack

* **Language:** Python
* **NLP:** spaCy
* **Embeddings:** sentence-transformers (Sentence-BERT)
* **ML Utilities:** scikit-learn
* **UI:** Streamlit
* **PDF Parsing:** PyPDF2
* **Agentic AI:** Groq (LLaMA models)

---

## 📂 Data Handling

This system **does not require a pre-collected dataset**.

All inputs are provided dynamically by the user:

* Resume (PDF upload)
* Job description (text input)

The system processes inputs in real-time using pre-trained models.

---

## 📂 Project Workflow

1. Upload resume (PDF) and input job description
2. Extract and preprocess text using NLP
3. Identify relevant skills from both inputs
4. Convert text into vector embeddings
5. Compute similarity score using cosine similarity
6. Identify matched and missing skills
7. Generate AI-based insights using Groq-powered agent

---

## 🤖 Role of Agentic AI

The Agentic AI layer enhances the system by:

* Providing contextual explanations of similarity scores
* Identifying skill gaps
* Suggesting improvements for better job alignment
* Generating human-like feedback

⚠️ The agent **does not replace the NLP pipeline** and is used strictly as an enhancement layer.

---

## 📊 Sample Output

```
Similarity Score: 0.78

Matched Skills:
✔ Python
✔ SQL

Missing Skills:
✖ AWS
✖ Docker

AI Insight:
You are a strong candidate with solid programming skills.
However, adding cloud technologies like AWS and containerization
tools like Docker will significantly improve your profile.
```

---

## 🎯 Objectives

* Improve resume-job matching accuracy
* Reduce false rejection in ATS systems
* Provide explainable and interpretable results
* Enhance user guidance using AI

---

## ⚠️ Limitations

* Skill extraction is based on predefined or rule-based NLP methods
* Accuracy depends on input quality
* LLM responses may vary slightly

---

## 🚀 Future Scope

* Multi-resume ranking system
* Integration with vector databases (FAISS)
* Advanced skill extraction using KeyBERT
* Deployment as a web service
* Integration with job portals

---

## 🧪 How to Run

```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## 📁 Project Structure

```
semantic-resume-matcher/
│
├── app.py                      # Main Streamlit application
├── requirements.txt           # Dependencies
├── README.md                  # Documentation
│
├── src/                       # Core NLP pipeline
│   ├── preprocessing.py       # Text cleaning & lemmatization
│   ├── skill_extraction.py    # Skill extraction logic
│   ├── embeddings.py          # Sentence-BERT embeddings
│   ├── similarity.py          # Cosine similarity computation
│   ├── matching.py            # Matched & missing skills
│   └── agent.py               # Groq-based agentic AI logic
│
├── utils/                     # Utility functions
│   ├── pdf_parser.py          # Resume text extraction
│   └── constants.py           # Skill lists / configs
│
└── outputs/                   # Optional logs or results
```

---

## 🎤 Viva Explanation (Key Line)

> “This system uses NLP techniques and transformer-based embeddings for semantic resume matching, while Groq-powered agentic AI enhances interpretability through intelligent feedback and recommendations.”

---

## 👨‍💻 Authors
Tanish Rane
Heet Shah
Vikram Pimprikar
---

## 📚 References

* Sentence-BERT
* spaCy NLP
* Resume Matching Research Papers
* Groq LLM Documentation

---
