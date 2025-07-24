export default {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'auto'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-transform-dynamic-import'
  ]
};