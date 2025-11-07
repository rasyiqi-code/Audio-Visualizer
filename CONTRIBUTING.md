# Contributing to Audio Visualizer Pro

First off, thank you for considering contributing to Audio Visualizer Pro! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and beginners
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+ or Node.js 18+
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React and TypeScript

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Audio-Visualizer.git
   cd Audio-Visualizer
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/rasyiqi-code/Audio-Visualizer.git
   ```

4. **Install dependencies**
   ```bash
   bun install
   ```

5. **Create .env file**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

6. **Start development server**
   ```bash
   # Web app
   bun run dev
   
   # Desktop app
   bun run dev:electron
   ```

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or animated GIFs** if possible
- **Include your environment details** (OS, browser, versions)

**Template:**
```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some examples** of how it would work
- **Include mockups or examples** if applicable

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- `good-first-issue` - Issues suitable for beginners
- `help-wanted` - Issues that need attention
- `documentation` - Documentation improvements

### Pull Requests

- Fill in the required template
- Follow the style guidelines
- Include screenshots for UI changes
- Update documentation as needed
- Add tests if applicable

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write your code
- Follow the style guidelines
- Test your changes
- Update documentation

### 3. Commit Changes

```bash
# Stage your changes
git add .

# Commit with meaningful message
git commit -m "feat: add new visualization mode"
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill in the PR template
- Wait for review

## 🎨 Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for complex functions

**Example:**
```typescript
/**
 * Calculate frequency data from audio analyser
 * @param analyser - Web Audio API AnalyserNode
 * @param dataArray - Uint8Array to store frequency data
 * @returns normalized frequency values
 */
function getFrequencyData(
  analyser: AnalyserNode | null,
  dataArray: Uint8Array
): number[] {
  if (!analyser) return [];
  analyser.getByteFrequencyData(dataArray);
  return Array.from(dataArray).map(value => value / 255);
}
```

### React Components

- One component per file
- Use PascalCase for component names
- Props interface should be defined above component
- Export default at the end

**Example:**
```typescript
interface VisualizerProps {
  audioData: Uint8Array;
  theme: Theme;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ 
  audioData, 
  theme, 
  isPlaying 
}) => {
  // Component logic
  return <canvas />;
};

export default Visualizer;
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Keep inline styles minimal
- Use theme colors from constants
- Mobile-first responsive design

### File Organization

```
components/
  ├── ComponentName/
  │   ├── ComponentName.tsx
  │   ├── ComponentName.test.tsx (if tests)
  │   └── index.ts (re-export)
```

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc)

### Examples

```bash
feat(visualizer): add spiral visualization mode

Add new spiral visualization that rotates based on audio frequency.
Includes customizable rotation speed and color gradient.

Closes #123

---

fix(desktop): resolve window controls hover issue

Fixed title bar controls not appearing on hover in Windows.
Updated opacity transition duration to 200ms.

---

docs: update installation guide

Add Bun installation instructions and troubleshooting section.

---

refactor(effects): extract common effect logic

Move shared effect utilities to separate module for better reusability.
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tested in development mode
- [ ] Tested in production build (if applicable)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested thoroughly
```

### Review Process

1. **Automated checks** - Must pass before review
2. **Code review** - Maintainer will review
3. **Changes requested** - Address feedback if needed
4. **Approval** - After successful review
5. **Merge** - Maintainer will merge

### After Merge

- Your changes will be in the next release
- Delete your feature branch
- Update your local main branch

```bash
git checkout main
git pull upstream main
git push origin main
```

## 🧪 Testing

### Manual Testing

Always test your changes:

1. **Web app**: `bun run dev`
2. **Desktop app**: `bun run dev:electron`
3. **Production build**: `bun run build`
4. **Desktop build**: `bun run package`

### Test Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Works on different themes
- [ ] Responsive on different screen sizes
- [ ] Performance is acceptable
- [ ] No memory leaks

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 💬 Getting Help

- Check [existing issues](https://github.com/rasyiqi-code/Audio-Visualizer/issues)
- Read the [documentation](README.md)
- Ask in discussions

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🙏

