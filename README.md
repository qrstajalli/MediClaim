# MediClaim: The Zero-UI Medical Claim Agent for Bharat 

**"No App. No English. No Rejections."**

Mediclaim is a "Zero-UI" AI agent designed to remove the friction of filing health insurance claims in India. Instead of complex apps, users interact via WhatsApp using voice notes in their native language and photos of physical bills.

---

## 🏥 The Problem
The claim filing process in India remains fundamentally broken for the average citizen due to several factors
* **High Cognitive Load**: Navigating complex apps and English-only insurance jargon.
* **Document Friction**: Messy, handwritten prescriptions and faded pharmacy bills.
* **Delayed Rejections**: Claims rejected after weeks due to missing stamps or signatures.
* **Language Barrier**: Most systems alienate non-English speaking demographics.

## ✨ Core Features
* **Multimodal Document Extraction**: Reads handwritten doctor prescriptions and thermal receipts.
* **Voice-First Conversational Interface**: Allows interaction via regional voice notes.
* **Instant Error Detection**: Scans for mandatory elements like doctor signatures and hospital stamps before submission.
* **Policy Rule Engine**: Cross-references expenses against specific policy limits and exclusions.
* **Auto-Claim Generation**: Compiles approved data into standardized PDF formats required by TPAs.

## 🛠 Tech Stack
| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **User Interface** | WhatsApp Business API | The "Zero-UI" frontend for interaction.
| **Core AI Engine** | Google Gemini 1.5 Pro API | Multimodal analysis and policy reasoning.
| **Voice & Language** | Google Cloud Translation & Speech APIs | Processing vernacular voice notes.
| **Backend & Logic** | Node.js / Express | Webhook server for messaging loops.
| **Database & Storage**| Firebase / Supabase | Secure storage for sessions and medical documents.

---

VITE_GEMINI_API_KEY="your_api_key_here"
VITE_SUPABASE_URL="..."
VITE_SUPABASE_ANON_KEY="..."
```
Run `npm install` and then `npm run dev` to start the simulated app.
