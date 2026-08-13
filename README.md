# 🚀 ATS-Friendly Resume Builder & Compatibility Auditor

An intelligent, ATS-optimized Resume Builder, Resume Compatibility Tester, and Industry Job Matcher built with **Vite, React, and Google Gemini AI**. Designed to help job seekers pass Applicant Tracking Systems (ATS) with 100% compliant formatting, accurate keyword analysis, and regional job suggestions across Tamil Nadu & South India.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5_Flash-8E75FF.svg?logo=google)

---

## ✨ Key Features

### 1. 📝 ATS-Compliant Resume Builder
- **Standard Single-Column Layout**: Guaranteed parseability by major ATS platforms (Workday, Taleo, Greenhouse, Lever).
- **Fresher vs. Experienced Mode**: Smart dropdown toggle hides work experience for freshers while allowing experienced candidates to add multiple positions dynamically.
- **Strict Contact Validation**:
  - **Phone**: Indian mobile format (`+91` followed by 10 digits).
  - **Email**: Mandatory `@` and valid top-level domain (`.com`, `.in`, etc.).
- **Regional Placeholders**: Pre-filled defaults formatted for Tamil Nadu, India (*Guru*, *user@gmail.com*, *+91 98765 43210*, *Chennai, Tamilnadu*, *Anna University*, *2024*).
- **One-Click Export**: Download high-quality PDF and plain text (`.txt`) ATS formats.

### 2. 🎯 ATS Compatibility Auditor & Tester
- **Multi-Format Text Parser**: Upload PDF, DOCX, or TXT resumes for instant ATS evaluation.
- **Standalone Document Readiness Score**: Evaluates structural layout, contact details, section completeness, and quantified bullet points (constant across all target job titles).
- **Job Match Score Gauge**: Industry-specific keyword density evaluation tailored to your selected target title.
- **Independent Role Suitability Recommendation**: Automatically scans all industries to suggest the single #1 best fitting job role for your resume skills.
- **Fine-Grained Sub-Role Dictionaries**: Specialized keyword requirements across 30+ role categories (Executive Chef, Line Cook, Kitchen Staff, Pastry Chef, Frontend/Backend Developer, QA Automation, Data Scientist, Doctor, Nurse, Teacher, Civil Engineer, Accountant, etc.).

### 3. 💼 Industry-Aware Regional Job Suggestions
- **Tamil Nadu Location Policy**: Enforces an 8:2 location ratio (8+ Tamil Nadu locations like Chennai, Coimbatore, Madurai, Trichy, Salem; max 2 neighboring South Indian hubs like Bengaluru or Kochi).
- **Authentic Industry Companies**: Suggests matching employers based on your role (*ITC Grand Chola* for Chef, *Apollo Hospitals* for Healthcare, *SRM/SASTRA* for Academic, *TVS/Hyundai* for Mechanical, *Zoho/Freshworks* for Software).
- **INR Salary Ranges**: Indian LPA CTC packages (`₹6.5 - ₹10.0 LPA`).

### 4. 🤖 Dual Engine (Gemini AI + Offline Smart Heuristics)
- Integrates seamlessly with **Google Gemini 1.5 Flash API** when an optional free API key is provided.
- Includes a full offline **Smart Local Heuristic NLP Engine** that runs 100% locally in your browser if no key is entered.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6
- **Styling**: Vanilla CSS (Dark Glassmorphism UI & Light Mode Toggle)
- **Document Generators & Parsers**: `jspdf`, `html2canvas`, `pdfjs-dist`, `mammoth`
- **AI Model**: `@google/generative-ai` (Gemini 1.5 Flash)
- **Icons**: Lucide React

---

## 💻 Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Dhinesh-Guru/Resume-Builder.git
   cd Resume-Builder
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to GitHub Pages

This project is configured for 1-click deployment to GitHub Pages using `gh-pages`:

```bash
npm run deploy
```

Your app will be live at:
`https://Dhinesh-Guru.github.io/Resume-Builder`

---

## 🔒 Privacy & Security

- **Zero Data Tracking**: All resume building and parsing operations happen client-side in your browser.
- **Secure Key Storage**: API keys are stored exclusively in your browser's `localStorage` and never transmitted to third-party servers.

---

## 👨‍💻 Author

**Made by Dhinesh Guru**  
- GitHub: [@Dhinesh-Guru](https://github.com/Dhinesh-Guru)
- Repository: [Resume-Builder](https://github.com/Dhinesh-Guru/Resume-Builder)
