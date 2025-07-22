# Figma to React Component Mapping

This document outlines the mapping between Figma design components and our React implementation in the Rescale Design System.

## Design Token Extraction Results

### Colors Extracted from Figma
- **Light Gray Backgrounds**: `#CCCCCC` - Used across most pages
- **Dark Blue-Gray**: `#555E69` - Used for workflow/integration pages  
- **Light Blue Background**: `#DEE4EC` - Used for job-related pages

### Generated Design Tokens

#### Color System
```typescript
colors: {
  brand: {
    blue: '#0066CC',
    'blue-light': '#E6F4FF', 
    'blue-dark': '#003D7A'
  },
  gray: {
    // 50-900 scale based on common design patterns
  },
  semantic: {
    success: '#52C41A',
    warning: '#FAAD14', 
    error: '#FF4D4F',
    info: '#1890FF'
  },
  surface: {
    white: '#FFFFFF',
    background: '#FAFAFA',
    'background-light': '#CCCCCC', // From Figma
    'background-dark': '#555E69',   // From Figma
  }
}
```

## Figma Pages and Component Mapping

### Pages Identified:
1. **Study Entity MS1-MS6** - Milestone pages
2. **Admin** - Administrative interfaces
3. **Search & Rescale AI** - AI-powered search functionality
4. **Integrations** - Third-party integrations
5. **Workflows** - Workflow management
6. **Job Setup** - Job configuration
7. **Job Status** - Job monitoring
8. **Rescale Data Components** ⭐ - Design system components
9. **Illustrations, Icons, and Inspiration** - Visual assets
10. **Rescale 2.0/2.5 Flow** - User journey flows

### Component Mapping Strategy

#### Core Components (Implemented)
| Figma Component | React Component | Status | Notes |
|----------------|-----------------|--------|--------|
| Navigation Bar | `NavigationBar` | ✅ Complete | Multi-level navigation support |
| Assistant Chat | `AssistantChat` | ✅ Complete | AI chat interface |
| Quick Actions | `QuickActions` | ✅ Complete | Action buttons with layouts |
| Data Cards | `DataCard` | ✅ Complete | Various card layouts |
| Status Indicators | `StatusIndicator` | ✅ Complete | Job status displays |
| Interactive Charts | `PerformanceChart` | ✅ Complete | Data visualization |

#### Form Components (Implemented)
| Figma Component | React Component | Status | Notes |
|----------------|-----------------|--------|--------|
| Form Fields | `Form.tsx` components | ✅ Complete | Enhanced Ant Design forms |
| Search Interface | `SearchInput` | ✅ Complete | Advanced search with filters |
| File Upload | `FileUpload` | ✅ Complete | Drag & drop support |

#### Layout Components (Implemented)  
| Figma Component | React Component | Status | Notes |
|----------------|-----------------|--------|--------|
| Page Layouts | `PageLayout` | ✅ Complete | Responsive layouts |
| Dashboard Grid | `DashboardGrid` | ✅ Complete | Flexible grid system |
| Sidebar | Part of `NavigationBar` | ✅ Complete | Collapsible sidebar |

### Missing Component Analysis

Based on the Figma pages, potential components that could be added:

#### Workflow Components
- **Workflow Builder** - Visual workflow creation
- **Pipeline Visualizer** - Data pipeline representation  
- **Step Progress** - Multi-step process indicator

#### Integration Components  
- **Integration Card** - Third-party service cards
- **API Connector** - API configuration interface
- **Sync Status** - Integration synchronization status

#### AI/Search Components
- **AI Chat Interface** - Already implemented as `AssistantChat`
- **Search Results** - Enhanced search result display
- **Recommendation Engine** - AI-powered recommendations

## Implementation Recommendations

### Phase 1: Token Integration ✅ Complete
- [x] Extract design tokens from Figma
- [x] Generate TypeScript token files
- [x] Update theme system

### Phase 2: Component Enhancement (Current)
- [ ] Update existing components to use new tokens
- [ ] Add missing semantic color variants
- [ ] Enhance typography scales

### Phase 3: New Components (Future)
- [ ] Workflow Builder components
- [ ] Advanced integration interfaces  
- [ ] Enhanced AI recommendation components

## Usage Guide

### Importing Design Tokens
```typescript
import { tokens, colors, typography, spacing } from '@/theme/tokens';

// Use in styled components
const StyledComponent = styled.div\`
  color: \${tokens.colors.brand.blue};
  font-size: \${tokens.typography.fontSize.base};
  padding: \${tokens.spacing[4]};
\`;
```

### Component Development Guidelines
1. **Always use design tokens** instead of hardcoded values
2. **Follow Figma naming conventions** when possible
3. **Implement responsive behavior** for all components
4. **Include accessibility features** (ARIA, keyboard nav)
5. **Write comprehensive stories** for Storybook

## Design System Evolution

The Rescale Design System successfully captures the key design patterns from the Figma file:
- ✅ **Color consistency** - Unified color palette
- ✅ **Typography hierarchy** - Consistent text styles  
- ✅ **Spacing system** - Rhythmic spacing scale
- ✅ **Component patterns** - Reusable UI components
- ✅ **Animation system** - Polished interactions
- ✅ **Performance optimization** - Production-ready code

This mapping ensures our React components align with the Figma designs while providing the flexibility and functionality needed for the Rescale platform.