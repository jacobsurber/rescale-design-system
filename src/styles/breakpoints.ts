// Responsive breakpoints for the Rescale design system
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1025px',
} as const;

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  mobileAndTablet: `@media (max-width: ${breakpoints.tablet})`,
  tabletAndDesktop: `@media (min-width: ${breakpoints.mobile})`,
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type MediaQuery = keyof typeof mediaQueries;