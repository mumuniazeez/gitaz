# Gitaz - AI Git Assistant

Gitaz is a modern, lightweight CLI tool that uses Artificial Intelligence to help you with your daily Git workflow. It helps you draft comprehensive commit messages, stages changes, and summarizes your git commits into clean, human-readable notes.

## Features

- **AI Generated Commits** : Generate git commit messages based on your staged or unstaged diffs.
- **Smart Staging & Pushing** : Stage, commit, and push your changes in a single command or review the message before applying it.
- **Clipboard Integration**: Easily copy the AI-generated commit message to your clipboard.
- **Summarize Git Log** : Automatically summarize Git Log into human-readable notes/summary.
- **AI Provider Agnostic** : Works with your own AI provider (e.g OpenAI, Google Gen AI, Hack Club AI, etc)
-

## Installation

You can install gitaz globally using npm:

```bash
npm install -g gitaz
```

## Setup

Before using gitaz, you need to configure your own AI provider, model and API key.

```bash
gitaz setup
```

## Commands Reference

### 1. `gitaz setup`

Configure your AI provider, model and API key.

```bash
gitaz setup
```

### 2. `gitaz commit`

Generate commit message based on your staged or unstaged diffs.

```bash
gitaz commit
```

The Above command will only generate a commit essage with option to copy the message to your clipboard or to apply the changes automatically.

You can use the `-p, --auto-apply` option to automatically stage, commit and push your changes.

```bash
gitaz commit -p
# or
gitaz commit --auto-apply
```

If you wish to only generate commit message for your staged changes only, you can use the `-s, --staged-changes` option.

```bash
gitaz commit -s
# or
gitaz commit --staged-changes
```

### 3. `gitaz summary`

Summarize your recent git commits into structured notes or summaries.

```bash
gitaz summary
```

You can use the `-d, --days <number>` option to define the timeframe in days to analyze. (default is 7 days)

```bash
gitaz summary -d 30
# or
gitaz summary --days 30
```

## Configuration

Gitaz stores configuration globally in your user home directory. (`~/gitaz.json`).

Config Format:

```json
{
  "model": "<model-name>",
  "serverUrl": "<server-url>",
  "apiKey": "<api-key>"
}
```

## Wanna work on Gitaz

You can contribute to Gitaz by following the same steps as any other open source project.

1. **Clone the repo**

   ```bash
   git clone https://github.com/mumuniazeez/gitaz.git
   cd gitaz
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Write your code**

   Make the improvement you wanna

4. **Test your code**
   Since the code is written in TypeScript, you'll need to build/compile the code into JavaScript before you can test it.

   ```bash
   # To watch for changes and automatically compile
   npm run dev
   # To only build
   npm run build
   ```
