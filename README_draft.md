# 🚀 Gitaz — AI-Powered Git Assistant

Gitaz is a modern, lightweight CLI tool that uses Artificial Intelligence to streamline your daily Git workflow. It helps you draft comprehensive commit messages, stages changes, and summarizes your commit logs into clean, human-readable release notes.

---

## ✨ Features

- **🤖 AI-Generated Commits:** Analyzes unstaged or staged diffs to write descriptive, context-aware commit messages.
- **⚡ Smart Staging & Pushing:** Stage, commit, and push your changes in a single command or review the message before applying it.
- **📋 Clipboard Integration:** Easily copy the AI-generated commit message directly to your clipboard.
- **📅 Activity Summarization:** Automatically compile your commit logs over the past $N$ days into neat summaries.
- **⚙️ Provider Agnostic:** Works with various AI providers (Google Gen AI, OpenRouter, Hack Club AI, etc.).

---

## 📦 Installation

Install Gitaz globally via npm:

```bash
npm install -g gitaz
```

---

## 🚀 Getting Started

Before using Gitaz, you need to configure your AI provider and API key.

```bash
gitaz setup
```

This interactive wizard will guide you through:
1. Selecting your AI Provider (Google Gen AI, Hack Club AI, etc.).
2. Choosing the model you wish to use.
3. Specifying your API key.

Your settings are securely saved in a global configuration file at `~/.gitaz.json`.

---

## 🛠️ Command Reference

### 1. `gitaz setup`
Configure your AI model, endpoint, and API key.

```bash
gitaz setup
```

---

### 2. `gitaz commit`
Analyze workspace changes and generate commit messages.

```bash
gitaz commit [options]
```

**Options:**
- `-s, --staged-changes`: Generate a commit message *only* for currently staged changes (default: includes all changes).
- `-p, --auto-apply`: Automatically stage (if not already staged), commit, and push changes without prompting for action.

**Interactive Actions (without `-p`):**
If ran without the `--auto-apply` flag, Gitaz will prompt you:
- **Copy to Clipboard:** Copies the message so you can run your own commit command.
- **Commit changes:** Commits and pushes the changes automatically.
- **Do both:** Copies the message and commits/pushes the changes.

---

### 3. `gitaz summary`
Summarize your recent git commits into structured release notes or summaries.

```bash
gitaz summary [options]
```

**Options:**
- `-d, --days <number>`: Define the timeframe in days to analyze (default: `7` days).

**Example Output:**
```markdown
### Summary of Changes (Last 7 Days)

- **Feature Updates:**
  - Implemented global configuration support using `~/.gitaz.json`.
  - Added interactive options menu to commit command.
- **Bug Fixes:**
  - Resolved unterminated quote syntax error during git commit execution.
```

---

## 🔒 Configuration

Gitaz stores configuration globally in your user home directory:

- **Path:** `~/.gitaz.json`
- **Format:**
  ```json
  {
    "model": "gemini-flash-3",
    "serverUrl": "https://ai.hackclub.com/proxy/v1",
    "apiKey": "your-secret-api-key"
  }
  ```

---

## 🛠️ Local Development

If you're building or extending Gitaz locally:

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/yourusername/gitaz.git
   cd gitaz
   npm install
   ```

2. **Build the source:**
   ```bash
   npm run build
   ```

3. **Link CLI for local testing:**
   ```bash
   npm link
   ```
