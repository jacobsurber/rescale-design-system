#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_FILE_KEY = 'B0H99zI9iTyU7vusGYP3rk';

async function makeRequest(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'X-Figma-Token': token
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function quickExtract(token) {
  console.log('🚀 Quick Figma Extract');
  console.log('======================\n');

  try {
    // 1. Get basic file info
    console.log('📁 Getting file info...');
    const fileUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}?depth=1`;
    const fileData = await makeRequest(fileUrl, token);
    
    console.log(`✅ File: ${fileData.name}`);
    console.log(`📅 Last modified: ${fileData.lastModified}`);
    console.log(`👥 Version: ${fileData.version}`);

    // Show pages
    if (fileData.document?.children) {
      console.log('\n📄 Pages found:');
      fileData.document.children.forEach(page => {
        console.log(`   • ${page.name} (${page.type})`);
      });
    }

    // 2. Get styles  
    console.log('\n🎨 Getting styles...');
    const stylesUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/styles`;
    const stylesData = await makeRequest(stylesUrl, token);
    
    console.log(`✅ Found ${Object.keys(stylesData.meta.styles).length} styles`);

    if (Object.keys(stylesData.meta.styles).length > 0) {
      console.log('\n🎨 Style List:');
      Object.values(stylesData.meta.styles).forEach(style => {
        console.log(`   • ${style.name} (${style.styleType})`);
      });
    }

    // 3. Get components
    console.log('\n🧩 Getting components...');
    const componentsUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/components`;
    const componentsData = await makeRequest(componentsUrl, token);
    
    console.log(`✅ Found ${Object.keys(componentsData.meta.components).length} components`);

    if (Object.keys(componentsData.meta.components).length > 0) {
      console.log('\n📦 Component List:');
      Object.values(componentsData.meta.components).forEach(component => {
        console.log(`   • ${component.name}`);
        if (component.description) {
          console.log(`     ${component.description}`);
        }
      });
    }

    // Save the data
    const extractedData = {
      file: {
        name: fileData.name,
        lastModified: fileData.lastModified,
        version: fileData.version,
        pages: fileData.document?.children || []
      },
      styles: stylesData.meta.styles,
      components: componentsData.meta.components
    };

    const outputPath = path.join(__dirname, '../figma-quick-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
    console.log(`\n💾 Data saved to: ${outputPath}`);

    console.log('\n🎯 SUMMARY:');
    console.log('===========');
    console.log(`• File: ${fileData.name}`);
    console.log(`• Pages: ${fileData.document?.children?.length || 0}`);
    console.log(`• Styles: ${Object.keys(stylesData.meta.styles).length}`);
    console.log(`• Components: ${Object.keys(componentsData.meta.components).length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

const token = process.env.FIGMA_TOKEN || process.argv[2];
if (!token) {
  console.log('❌ Need Figma token!');
  process.exit(1);
}

quickExtract(token);