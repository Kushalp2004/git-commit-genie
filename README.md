# 🧙‍♂️ Git Commit Genie

> ⚡️ Generate smart Git commit messages from your staged code changes — powered by **Gemini AI** or offline **rule-based logic**.

---

## ✨ Features

- 🔍 Reads your `git diff --cached` (staged changes)
- 🧠 **AI mode** – Uses Gemini 2.5 to generate natural-language commit messages
- 📏 **Rule-based mode** – Infers messages based on file types, keywords, and diff size
- 💬 VS Code integration:
  - Copy to clipboard
  - Auto-insert into Source Control commit box
- 🌐 Dual mode: choose AI or offline anytime
- 🔐 Privacy: only sends data to Gemini if you choose AI mode

---

## 🚀 How to Use

1. Make and **stage** code changes (`git add .`)
2. Open VS Code, press `Ctrl+Shift+P`
3. Run one of the following commands:

📏 Generate Rule-Based Commit Message
🔮 Generate AI Commit Message


4. Choose:
- 💬 Use → inserts the message into the Git commit box
- 📋 Copy → copies message to your clipboard

---

## 🧪 Example Outputs

### Rule-based:
feat: Update HTML (index.html), Update logic (script.js) – 10 lines added, 2 removed

### AI (Gemini):
refactor: improve score reset logic and add match end condition


---

## 🔧 Configuration

1. **Install dependencies**:
```bash
npm install

Set your API key in a .env file:

ini
Copy
Edit
GEMINI_API_KEY=your-secret-key-here
Get your key from: https://makersuite.google.com/app/apikey

Compile the project:

bash
Copy
Edit
npm run compile
