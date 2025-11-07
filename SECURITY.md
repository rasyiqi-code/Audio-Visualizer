# Security Policy

## 🔒 Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🐛 Reporting a Vulnerability

We take the security of Audio Visualizer Pro seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do NOT** open a public issue

Security vulnerabilities should not be publicly disclosed until they have been addressed.

### 2. Report privately

Send an email to the maintainers with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (if available)

**Email:** Create a security advisory on GitHub

Or use GitHub's [Security Advisory](https://github.com/rasyiqi-code/Audio-Visualizer/security/advisories/new) feature.

### 3. Wait for confirmation

We will:
- Acknowledge receipt within 48 hours
- Provide an initial assessment within 5 business days
- Keep you informed of progress
- Credit you in the security advisory (if desired)

## 🛡️ Security Best Practices

### For Users

#### Web Application
- Always use HTTPS when deploying
- Keep your Gemini API key secret
- Don't share your `.env` file
- Use latest stable version
- Keep your browser updated

#### Desktop Application
- Download only from official sources
- Verify file signatures (when available)
- Keep the app updated
- Don't run from untrusted sources

### For Contributors

#### Code Security
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize file uploads
- Use Content Security Policy (CSP)

#### Dependencies
- Keep dependencies updated
- Review dependency security advisories
- Use `bun audit` regularly
- Avoid unnecessary dependencies

#### Electron Security
- Never disable `contextIsolation`
- Never enable `nodeIntegration` in renderer
- Use `sandbox: false` carefully
- Validate all IPC messages
- Use preload scripts properly

## 🔐 Security Features

### Current Implementation

#### Web Application
- Content Security Policy (CSP) headers
- HTTPS enforced (in production)
- No inline scripts (except Tailwind CDN)
- CORS configuration
- Input validation

#### Desktop Application
- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC communication
- Sandboxed processes
- No remote code execution

#### API Security
- API keys stored in environment variables
- No hardcoded secrets
- Secure API communication (HTTPS)

## 📋 Known Security Considerations

### API Key Management

**Web App:**
- API keys must be kept server-side in production
- Current implementation is for development only
- Consider using a backend proxy for production

**Desktop App:**
- API keys in environment variables
- Not exposed to end users
- Secure storage recommended

### File Handling

- Audio files are processed client-side
- No files uploaded to servers
- Video export uses in-browser FFmpeg
- Desktop app has file system access (limited)

### Third-Party Services

- Google Gemini AI - for AI generation features
- FFmpeg.js - for video encoding
- Electron - for desktop framework

## 🚨 Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed. 

### Notification Channels
- GitHub Security Advisories
- GitHub Releases
- Repository Issues (after fix is deployed)

### Update Instructions

**Web App:**
```bash
git pull origin main
bun install
bun run build
```

**Desktop App:**
```bash
# Update source
git pull origin main
bun install

# Rebuild app
bun run package
```

Or download latest release from [Releases](https://github.com/rasyiqi-code/Audio-Visualizer/releases) page.

## 📜 Security Changelog

### v1.0.0 (2025-11-07)
- Initial security implementation
- Context isolation enabled
- Secure IPC communication
- Environment variable protection
- CSP headers configured

## 🤝 Security Acknowledgments

We appreciate security researchers and users who help keep Audio Visualizer Pro secure.

### Hall of Fame
<!-- Security researchers will be listed here -->

*No security issues reported yet.*

## 📞 Contact

For security issues only:
- Use [GitHub Security Advisories](https://github.com/rasyiqi-code/Audio-Visualizer/security/advisories/new)
- Or contact maintainers privately

For general questions:
- Use [GitHub Issues](https://github.com/rasyiqi-code/Audio-Visualizer/issues)
- Or [Discussions](https://github.com/rasyiqi-code/Audio-Visualizer/discussions)

---

**Thank you for helping keep Audio Visualizer Pro secure!** 🔒

