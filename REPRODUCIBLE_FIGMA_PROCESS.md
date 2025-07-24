# Reproducible Figma-to-Code Process

## Overview
This document outlines a systematic, reproducible process for achieving high-fidelity Figma-to-code conversion using MCP (Model Context Protocol) integration.

## Why Current Extraction Falls Short

### Common Issues:
1. **Over-reliance on Generated Code**: MCP `get_code` produces overly complex, approximate implementations
2. **Generic Icon Usage**: Using library icons instead of exact Figma specifications
3. **Estimated Measurements**: Approximating spacing, colors, and typography instead of extracting precise values
4. **Missing Visual Analysis**: Not systematically analyzing the visual design
5. **Incomplete State Coverage**: Missing hover, selected, and interactive states

## The 5-Phase Reproducible Process

### Phase 1: Visual Documentation 📸
**Goal**: Capture and analyze the exact visual design

#### Steps:
1. **Get High-Quality Image**
   ```typescript
   mcp__figma-dev-mode-mcp-server__get_image({
     nodeId: "", // Current selection or specific node
     clientName: "claude code",
     clientLanguages: "typescript,javascript,css",
     clientFrameworks: "react"
   })
   ```

2. **Systematic Visual Analysis**
   - Create a detailed measurement grid
   - Identify every visual element
   - Document colors, typography, spacing
   - Note interactive states and variations
   - Map relationships between elements

3. **Create Visual Specification Document**
   - Screenshot with annotations
   - Element-by-element breakdown
   - Measurement specifications
   - Color and typography notes

### Phase 2: Design Token Extraction 🎨
**Goal**: Extract exact design variables and tokens

#### Steps:
1. **Get Design Variables**
   ```typescript
   mcp__figma-dev-mode-mcp-server__get_variable_defs({
     nodeId: "",
     clientName: "claude code",
     clientLanguages: "typescript,javascript,css", 
     clientFrameworks: "react"
   })
   ```

2. **Map Variables to Elements**
   - Match design tokens to specific components
   - Identify missing values that need custom definitions
   - Document color, typography, and spacing systems
   - Create token mapping table

3. **Validate Against Visual Analysis**
   - Cross-reference tokens with visual measurements
   - Identify gaps where custom values are needed
   - Document the complete design system

### Phase 3: Component Architecture 🏗️
**Goal**: Map Figma design to code component structure

#### Steps:
1. **Break Down Into Atomic Components**
   - Identify reusable patterns
   - Map Figma layers to React components
   - Define component hierarchy
   - Document props and state requirements

2. **Define Component Specifications**
   - List exact measurements for each element
   - Define all visual states (default, hover, selected, disabled)
   - Specify typography, colors, and spacing
   - Document interactions and animations

3. **Create Implementation Plan**
   - Priority order for development
   - Dependencies between components
   - Testing and validation approach

### Phase 4: Incremental Implementation 👨‍💻
**Goal**: Build with precise fidelity, validating each step

#### Steps:
1. **Start with Layout Structure**
   ```typescript
   // Extract exact measurements
   const SIDEBAR_WIDTH = 248; // From Figma measurement
   const COLLAPSED_WIDTH = 64; // From Figma measurement
   const HEADER_HEIGHT = 60; // From Figma measurement
   ```

2. **Apply Exact Typography**
   ```typescript
   // Use exact Figma specifications
   font-family: 'Roboto', sans-serif;
   font-size: 14px;
   font-weight: 400;
   line-height: 22px;
   ```

3. **Implement Precise Colors**
   ```typescript
   // From design tokens or visual analysis
   const BRAND_BLUE = '#1890FF';
   const BACKGROUND_LIGHT = '#F3F7FF';
   const TEXT_SECONDARY = '#8F99B8';
   ```

4. **Add Exact Icons**
   - Identify specific icons from Figma
   - Use exact matches or create custom SVGs
   - Match sizing and positioning precisely

5. **Implement Interactive States**
   - Hover effects with exact color changes
   - Selected states with proper highlighting
   - Transitions and animations as specified

### Phase 5: Validation & Iteration 🔍
**Goal**: Ensure pixel-perfect accuracy

#### Steps:
1. **Side-by-Side Comparison**
   - Place implementation next to Figma design
   - Identify any visual discrepancies
   - Document remaining gaps

2. **Measure and Adjust**
   - Use browser dev tools to verify measurements
   - Adjust spacing, colors, typography as needed
   - Test all interactive states

3. **Document Learnings**
   - Note what worked well
   - Identify areas for process improvement
   - Update process documentation

## Practical Implementation Example

### Sidebar Component Analysis

#### Visual Elements Identified:
- **Header**: Logo + collapse button (60px height)
- **New Button**: Outlined style with plus icon (specific padding/margins)
- **Workspace Item**: Special styling with folder icon + external link
- **Navigation Items**: Specific icons + blue text + hover states
- **Section Headers**: "Rescale Data/AI" with BETA badges
- **Footer**: Help + Disable UI + Submit Feedback button + User email

#### Exact Measurements Extracted:
- Sidebar width: 248px expanded, 64px collapsed
- Item height: 40px
- Padding: 16px horizontal, 8px vertical spacing
- Border radius: 4-6px for buttons/items
- Font: Roboto 400, 14px, 22px line-height

#### Color Specifications:
- Brand blue: #1890FF
- Background light: #F3F7FF  
- Text secondary: #8F99B8
- Beta badge: #8F99B8 background, white text

## Tools and Techniques

### Essential MCP Calls:
1. `get_image` - Visual reference (always start here)
2. `get_variable_defs` - Design tokens
3. `get_code` - Reference only (not primary implementation)

### Analysis Tools:
- Browser developer tools for measurement verification
- Color picker tools for exact color matching
- Typography comparison tools
- Icon identification and matching services

### Documentation Templates:
- Visual specification document
- Component breakdown table
- Design token mapping
- Implementation checklist

## Success Metrics

### High Fidelity Achieved When:
- ✅ Visual comparison shows no discernible differences
- ✅ All measurements match exactly
- ✅ Colors are pixel-perfect matches
- ✅ Typography renders identically
- ✅ Icons are exact matches or visually equivalent
- ✅ Interactive states behave as designed
- ✅ Responsive behavior matches intentions

## Common Pitfalls to Avoid

1. **Relying too heavily on generated code** - Use visual analysis first
2. **Approximating measurements** - Extract exact values
3. **Using generic icons** - Find exact matches or create custom
4. **Skipping interactive states** - Document and implement all states
5. **Not validating frequently** - Compare at each implementation step

## Process Evolution

This process should be continuously improved based on:
- Learnings from each implementation
- New MCP capabilities and tools
- Feedback from design and development teams
- Efficiency improvements and automation opportunities

The goal is to create a systematic, teachable process that consistently produces high-fidelity results and can be replicated by any team member.