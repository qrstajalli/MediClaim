# [cite_start]ClaimSetu: The Zero-UI Medical Claim Agent for Bharat [cite: 1, 2]

[cite_start]**"No App. No English. No Rejections."** [cite: 22]

[cite_start]ClaimSetu is a "Zero-UI" AI agent designed to remove the friction of filing health insurance claims in India[cite: 12]. [cite_start]Instead of complex apps, users interact via WhatsApp using voice notes in their native language and photos of physical bills[cite: 13].

---

## [cite_start]🏥 The Problem [cite: 3]
[cite_start]The claim filing process in India remains fundamentally broken for the average citizen due to several factors: [cite: 4]
* [cite_start]**High Cognitive Load**: Navigating complex apps and English-only insurance jargon[cite: 5].
* [cite_start]**Document Friction**: Messy, handwritten prescriptions and faded pharmacy bills[cite: 8].
* [cite_start]**Delayed Rejections**: Claims rejected after weeks due to missing stamps or signatures[cite: 9].
* [cite_start]**Language Barrier**: Most systems alienate non-English speaking demographics[cite: 10].

## [cite_start]✨ Core Features [cite: 15]
* [cite_start]**Multimodal Document Extraction**: Reads handwritten doctor prescriptions and thermal receipts[cite: 16].
* [cite_start]**Voice-First Conversational Interface**: Allows interaction via regional voice notes[cite: 17].
* [cite_start]**Instant Error Detection**: Scans for mandatory elements like doctor signatures and hospital stamps before submission[cite: 18].
* [cite_start]**Policy Rule Engine**: Cross-references expenses against specific policy limits and exclusions[cite: 19].
* [cite_start]**Auto-Claim Generation**: Compiles approved data into standardized PDF formats required by TPAs[cite: 20].

## [cite_start]🛠 Tech Stack [cite: 24]
| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **User Interface** | WhatsApp Business API | [cite_start]The "Zero-UI" frontend for interaction[cite: 26]. |
| **Core AI Engine** | Google Gemini 1.5 Pro API | [cite_start]Multimodal analysis and policy reasoning[cite: 26]. |
| **Voice & Language** | Google Cloud Translation & Speech APIs | [cite_start]Processing vernacular voice notes[cite: 26]. |
| **Backend & Logic** | Node.js / Express | [cite_start]Webhook server for messaging loops[cite: 26]. |
| **Database & Storage**| Firebase / Supabase | [cite_start]Secure storage for sessions and medical documents[cite: 26]. |

## 📁 Project Structure
The project is organized as follows:
```text
claim-ease-main/
├── src/                
│   ├── components/     # UI elements (e.g., WhatsAppChat simulated UI, Claim Summary)
│   ├── lib/            # Utilities (`gemini.ts` AI chat integration)
│   └── docs/           # Any other project logic
├── supabase/           # Database configurations and edge functions (`analyze-bill`)
└── vite.config.ts      # Build tool configuration
```

---

## 🚀 Recent Implementation & Architecture Updates

To guarantee that this repository works properly when cloned to a new device or environment, here is a summary of the recently implemented features and workarounds:

### 1. Prototype Simulation Architecture
While the end-goal stack uses Node.js/Express, this repository currently acts as a **Vite + React prototype** to visually simulate the WhatsApp experience. Because it is a frontend prototype, there are no `/webhook` controllers inside this workspace.

### 2. Conversational Context Injection (No Database Overhead)
Instead of forcing a heavy backend database migration (like Firebase or Supabase Postgres tables) to remember the patient's context between messages, we implemented localized "flyweight" context passing:
- Whenever you upload a document, `analyze-bill` extracts the structured JSON (Hospital Name, Date, Amount, Missing Stamps).
- This JSON object (`ClaimData`) is kept in the UI state and dynamically injected as a hidden system instruction into **every single LLM chat payload**. 
- The AI natively remembers the document it's discussing without any backend database syncing.

### 3. Hinglish & Empathetic Agent Prompts
We completely rewrote the internal System Instructions for the ChatBot. The AI model is strictly commanded to:
- Acknowledge Hinglish inputs natively (e.g., *"Is bill ka claim kaise milega?"*).
- Show extreme empathy, shifting the cognitive load off the patient by taking ownership (*"Main check kar leta hoon"*).
- Cross-reference questions with the active document context provided.

### 4. Gemini API Integration (`lib/gemini.ts`)
We bypassed the remote Supabase Edge Function (`chat-bot`) for the chat system. Because deploying Supabase models remotely can cause CORS issues or versioning mismatches during local testing, we now directly call the Gemini API from the frontend via `src/lib/gemini.ts`.
- **Model Used:** We use the stable `gemini-2.5-flash` model. (Attempting to call legacy or preview strings like `gemini-1.5-flash` or `gemini-3.1-flash` will result in a 404 from Google's API).
- **History formatting:** The script intercepts the raw conversation array, flattens consecutive roles, and safely forces alternating `user` / `model` history so that the Gemini API avoids 400 Bad Request errors.

### Local Setup
Ensure you have the following in your `.env` file at the root:
```env
VITE_GEMINI_API_KEY="your_api_key_here"
VITE_SUPABASE_URL="..."
VITE_SUPABASE_ANON_KEY="..."
```
Run `npm install` and then `npm run dev` to start the simulated app.