# Contributing to Spatial OS React Native SDK

Thank you for considering contributing to Spatial OS! It's people like you that make Spatial OS such a great tool for the community.

## Code of Conduct

This project and everyone participating in it is governed by the [Spatial OS Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. When creating a bug report, please include:

- A clear description of the issue
- Steps to reproduce the bug
- Any relevant logs or screenshots
- Your environment details (React Native version, iOS/Android version)

### Suggesting Enhancements

Enhancements are also tracked as GitHub issues. Please provide:

- A clear title and description
- The use case for the enhancement
- Any technical implementation ideas

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes (`npm test`)
5. Make sure your code lints (`npm run lint`)
6. Issue that pull request!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/spatial-os/spatial-os-react-native.git
cd spatial-os-react-native

# Install dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint

# Build package
npm run build
```

### Project Structure

```
src/
├── index.tsx             # Main exports
├── SpatialProvider.tsx   # Context provider
├── hooks/                # React hooks (useAnchor, usePresence, etc.)
├── components/           # React Native components
└── lib/                  # API client and utilities
```

## Style Guide

- We use **Prettier** and **ESLint** for code formatting. Run `npm run format` before committing.
- Follow **Clean Code** principles: concise functions, clear naming, and modularity.
- Use TypeScript with strict mode enabled.
- Write JSDoc comments for public APIs.

## License

By contributing to Spatial OS, you agree that your contributions will be licensed under its [MIT License](LICENSE).
