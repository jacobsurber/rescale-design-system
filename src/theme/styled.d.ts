/**
 * Styled Components Theme Type Declaration
 * Extends the default styled-components theme with Rescale design tokens
 */

import 'styled-components';
import type { DesignTokens } from './tokens';

declare module 'styled-components' {
  export interface DefaultTheme extends DesignTokens {
    // Add any additional theme properties here if needed
  }
}