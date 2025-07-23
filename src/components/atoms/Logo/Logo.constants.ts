import type { AntIconName } from '../Icon';

// Logo size definitions
export const logoSizes = {
  xs: {
    width: '16px',
    height: '16px',
    fontSize: 12,
  },
  sm: {
    width: '24px',
    height: '24px', 
    fontSize: 14,
  },
  md: {
    width: '32px',
    height: '32px',
    fontSize: 16,
  },
  lg: {
    width: '48px',
    height: '48px',
    fontSize: 20,
  },
  xl: {
    width: '64px',
    height: '64px',
    fontSize: 24,
  },
  '2xl': {
    width: '96px',
    height: '96px',
    fontSize: 32,
  },
} as const;

// Software logo mappings - fallback to icons when actual logos aren't available
export const softwareLogoMap: Record<string, { icon: AntIconName; color?: string }> = {
  // CAE/Simulation Software
  'ansys': { icon: 'ExperimentOutlined', color: '#ffb000' },
  'fluent': { icon: 'ExperimentOutlined', color: '#ffb000' },
  'abaqus': { icon: 'BuildOutlined', color: '#0066cc' },
  'star-ccm': { icon: 'ThunderboltOutlined', color: '#ff6b35' },
  'openfoam': { icon: 'CloudOutlined', color: '#2e86de' },
  'nastran': { icon: 'ApartmentOutlined', color: '#00a8ff' },
  'ls-dyna': { icon: 'RocketOutlined', color: '#ee5a24' },
  'comsol': { icon: 'ExperimentOutlined', color: '#0984e3' },
  
  // Computing Platforms
  'matlab': { icon: 'FunctionOutlined', color: '#0076a8' },
  'python': { icon: 'CodeOutlined', color: '#3776ab' },
  'r': { icon: 'BarChartOutlined', color: '#276dc3' },
  
  // Visualization & Analysis
  'paraview': { icon: 'EyeOutlined', color: '#46aef7' },
  'pymol': { icon: 'MedicineBoxOutlined', color: '#006400' },
  'gaussview': { icon: 'AtomicOutlined', color: '#ff7675' },
  
  // Other Engineering Tools
  'cst': { icon: 'RadarChartOutlined', color: '#a29bfe' },
  'hfss': { icon: 'WifiOutlined', color: '#fd79a8' },
  'wrf': { icon: 'CloudOutlined', color: '#00b894' },
  'gromacs': { icon: 'MedicineBoxOutlined', color: '#00cec9' },
  'ncl': { icon: 'BarChartOutlined', color: '#fdcb6e' },
  
  // Default fallbacks
  'default': { icon: 'AppstoreOutlined', color: undefined },
  'unknown': { icon: 'QuestionCircleOutlined', color: '#8c8c8c' },
};

export type LogoSize = keyof typeof logoSizes;
export type SoftwareLogoKey = keyof typeof softwareLogoMap;