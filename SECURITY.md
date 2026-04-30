# Security Policy

## Supported versions

This project is in active early development (0.x). Only the latest minor version receives security fixes.

| Version | Supported          |
|---------|--------------------|
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security issue — particularly anything related to API key handling, the local proxy, or upstream provider header leakage — report it privately:

1. Use GitHub's [private vulnerability reporting](https://github.com/KovalevAnton/llm-limits-tracker/security/advisories/new) for this repository, **or**
2. Email the maintainer directly: `kooovaaal@gmail.com` with subject `[security] llm-limits-tracker`.

Please include:

- A description of the issue and its potential impact.
- Steps to reproduce, or a proof-of-concept if you have one.
- Affected version (the output of `node -e "console.log(require('./package.json').version)"` is fine).
- Any suggested mitigation.

You should receive an acknowledgement within **3 business days**. We aim to provide an initial assessment within **7 days** and a patched release within **30 days** for confirmed high-severity issues.

## Scope

In scope:

- The local proxy (`server.js`) — request forwarding, header handling, key handling.
- The browser UI (`public/index.html`) — `localStorage` handling, key transport.
- Build/release artifacts published to npm.

Out of scope:

- Vulnerabilities in upstream provider APIs (report those to the provider).
- Issues that require an attacker to already have local code-execution on the user's machine.
- DoS via running the server on a public interface (this tool is local-only by design).

## Acknowledgements

Reporters who follow responsible disclosure will be credited in the relevant `CHANGELOG.md` entry unless they prefer to remain anonymous.
