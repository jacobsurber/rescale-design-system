import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'Rescale Design System',
  brandUrl: 'https://rescale.com',
  brandTarget: '_self',

  colorPrimary: '#0066cc',
  colorSecondary: '#1890ff',

  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e8e9ea',
  appBorderRadius: 8,

  fontBase: '"Segoe UI", system-ui, -apple-system, "San Francisco", "Helvetica Neue", sans-serif',

  textColor: '#2c3e50',
  textInverseColor: '#ffffff',

  barTextColor: '#999999',
  barSelectedColor: '#0066cc',
  barHoverColor: '#0066cc',
  barBg: '#ffffff',
});

addons.setConfig({
  theme,
  panelPosition: 'bottom',
  selectedPanel: 'controls',
});