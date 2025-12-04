# Contributing to Mika

First off, thank you for considering contributing to Mika! It's people like you that make Mika such a great tool.

We welcome contributions of all kinds from anyone. Whether you are adding new features, fixing bugs, improving documentation, or just reporting an issue, your help is appreciated.

## 🛠️ Development Setup

Mika is a monorepo built with **Angular** and **Nx-style** workspace structure.

### Prerequisites

- **Node.js**: v18 or higher
    
- **npm**: v9 or higher
    
- **Git**
    

### 1. Clone the Repo

```
git clone [https://github.com/mikaverse/mika.git](https://github.com/mikaverse/mika.git)
cd mika
```

### 2. Install Dependencies

```
npm install
```

### 3. Start the Development Environment

We use a demo app to test the core library in real-time.

**Terminal 1: Start the Mock API** This runs `json-server` to simulate a backend.

```
npm run api
```

**Terminal 2: Start the Demo App** This builds `@mikaverse/core` and serves the demo application.

```
npm start
```

Open your browser to `http://localhost:4200`.

## 📂 Project Structure

```
mika/
├── projects/
│   ├── core/           # 🧠 The Main Engine (@mikaverse/core)
│   └── demo-app/       # 🎡 The Playground App used for testing
├── package.json        # Root dependencies
└── angular.json        # Workspace configuration
```

## 🐛 Found a Bug?

If you find a bug in the source code, you can help us by [submitting an issue](https://www.google.com/search?q=https://github.com/mikaverse/mika/issues "null") to our GitHub Repository. Even better, you can submit a Pull Request with a fix.

**Please include:**

1. A clear title and description.
    
2. Steps to reproduce the bug.
    
3. (Optional) A code sample or screenshot.
    

## 💡 Submitting a Pull Request (PR)

1. **Fork** the repo and create your branch from `main`.
    
2. If you've added code that should be tested, add tests.
    
3. Ensure the demo app runs without errors.
    
4. Make sure your code follows the existing style (Angular Style Guide).
    
5. Issue that Pull Request!
    

### Commit Message Guidelines

We follow the **Conventional Commits** specification. This allows us to generate changelogs automatically.

- `feat:` A new feature
    
- `fix:` A bug fix
    
- `docs:` Documentation only changes
    
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc)
    
- `refactor:` A code change that neither fixes a bug nor adds a feature
    
- `perf:` A code change that improves performance
    
- `test:` Adding missing tests or correcting existing tests
    
- `chore:` Changes to the build process or auxiliary tools
    

**Example:** `feat: add offline sync support for POST requests`

## Running Tests

(Coming Soon)

<!-- Currently, testing is done manually via the demo-app. Automated tests will be added in v0.1.0 -->

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
