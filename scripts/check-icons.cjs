const icons = require('@ant-design/icons');

const iconsToCheck = [
  'MenuFoldOutlined',
  'MenuUnfoldOutlined', 
  'LogoutOutlined',
  'QuestionCircleOutlined',
  'UserOutlined'
];

console.log('Checking icon availability:');
iconsToCheck.forEach(iconName => {
  const exists = typeof icons[iconName] !== 'undefined';
  console.log(`${iconName}: ${exists ? '✅' : '❌'}`);
});

console.log('\nMenu-related icons:');
Object.keys(icons).filter(k => k.toLowerCase().includes('menu')).forEach(name => {
  console.log(`  ${name}`);
});

console.log('\nLogout-related icons:');
Object.keys(icons).filter(k => k.toLowerCase().includes('logout')).forEach(name => {
  console.log(`  ${name}`);
});

console.log('\nFold-related icons:'); 
Object.keys(icons).filter(k => k.toLowerCase().includes('fold')).forEach(name => {
  console.log(`  ${name}`);
});