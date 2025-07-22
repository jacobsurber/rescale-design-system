# Development Guide - Preventing Build Failures

This document outlines the preventive measures and best practices to avoid TypeScript build failures in the Rescale Design System.

## 🚨 Common Build Issues and Prevention

### 1. Type Import Issues (`verbatimModuleSyntax` enabled)

**Problem**: TypeScript requires type-only imports when `verbatimModuleSyntax` is enabled.

**Error Example**:
```
error TS1484: 'ChatMessage' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

**Solution**: Use `import type` for interfaces, types, and other type-only imports:

```typescript
// ❌ Wrong
import { ChatMessage, AssistantChat } from './AssistantChat';

// ✅ Correct
import { AssistantChat } from './AssistantChat';
import type { ChatMessage } from './AssistantChat';
```

**Automation**: Use the provided script:
```bash
npm run fix-types
```

### 2. Theme Property Access Issues

**Problem**: Styled components trying to access non-existent theme properties.

**Error Example**:
```
error TS2339: Property 'spacing' does not exist on type 'DefaultTheme'.
```

**Solution**: Use proper theme property paths defined in `src/theme/tokens.ts`:

```typescript
// ❌ Wrong
padding: ${({ theme }) => theme.spacing.lg};

// ✅ Correct  
padding: ${({ theme }) => theme.spacing.lg}; // Use semantic aliases
// or
padding: ${({ theme }) => theme.spacing[8]}px; // Use numeric spacing
```

**Prevention**: The theme structure is defined in:
- `src/theme/tokens.ts` - Design token definitions
- `src/theme/styled.d.ts` - Styled-components theme interface

### 3. Unused Variables and Imports

**Problem**: TypeScript and ESLint flag unused variables and imports.

**Solution**: Use underscore prefix for intentionally unused parameters:

```typescript
// ❌ Wrong
buttons.forEach((button, index) => {
  expect(button).toHaveAccessibleName();
});

// ✅ Correct
buttons.forEach((button, _index) => {
  expect(button).toHaveAccessibleName();
});

// Or remove if truly unused
buttons.forEach((button) => {
  expect(button).toHaveAccessibleName();
});
```

### 4. Component Prop Interface Mismatches

**Problem**: Tests or stories using props that don't exist on components.

**Error Example**:
```
Property 'showTimestamps' does not exist on type 'AssistantChatProps'.
```

**Solution**: Ensure all props match the component interface or add them to the interface if needed.

## 🛠️ Development Workflow

### Before Committing

1. **Run type check**:
   ```bash
   npm run typecheck
   ```

2. **Fix type imports automatically**:
   ```bash
   npm run fix-types
   ```

3. **Run build to catch issues early**:
   ```bash
   npm run build
   ```

4. **Fix linting issues**:
   ```bash
   npm run lint:fix
   ```

### During Development

1. **Use proper TypeScript patterns**:
   - Always use `import type` for types and interfaces
   - Define proper interfaces for component props
   - Use semantic theme properties from tokens

2. **Test components with proper types**:
   - Use the mock data generators in `src/test-utils/index.tsx`
   - Ensure test data matches component interfaces

3. **Update theme tokens when needed**:
   - Add new semantic aliases to `src/theme/tokens.ts`
   - Update the styled-components interface in `src/theme/styled.d.ts`

## 🔧 Scripts and Tools

### Automated Fixes

- `npm run fix-types` - Automatically converts imports to type-only where appropriate
- `npm run lint:fix` - Fixes automatically fixable ESLint issues
- `npm run format` - Formats code with Prettier

### Validation Scripts

- `npm run typecheck` - Run TypeScript compiler without emitting files
- `npm run build` - Full build to catch all issues
- `npm run lint` - Check for linting issues

### Pre-commit Hooks

The project uses Husky for pre-commit hooks that run:
1. TypeScript type checking
2. ESLint validation  
3. Prettier formatting

If hooks are failing, you can temporarily bypass with:
```bash
git commit --no-verify -m "message"
```
**Note**: Only use `--no-verify` in exceptional cases and ensure issues are fixed promptly.

## 📋 Build Error Categories

### Critical (Must Fix)
- TypeScript compilation errors
- Missing imports/exports
- Type mismatches

### Important (Should Fix)
- ESLint errors (unused variables, etc.)
- Theme property access issues
- Component prop interface mismatches

### Minor (Can Be Warnings)
- ESLint warnings
- Prettier formatting issues
- Performance optimization suggestions

## 🚀 CI/CD Integration

### GitHub Actions

The project should build successfully on GitHub Actions. Common CI failure patterns:

1. **Type imports not fixed locally** - Run `npm run fix-types` before pushing
2. **Theme properties don't exist** - Update theme tokens and styled.d.ts
3. **Node modules cache issues** - Clear cache and reinstall dependencies

### Monitoring Build Health

1. Check GitHub Actions regularly
2. Address failing builds immediately
3. Use automated tools to prevent regressions

## 📚 Additional Resources

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Styled Components TypeScript](https://styled-components.com/docs/api#typescript)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)

## 🔄 Continuous Improvement

This development guide will be updated as new patterns emerge and tooling improves. When adding new components or features:

1. Follow established patterns
2. Update this guide if new patterns are needed
3. Add automated tooling for common issues
4. Test thoroughly before committing

---

*This guide was created as part of systematically addressing build failures and establishing preventive measures for the Rescale Design System.*