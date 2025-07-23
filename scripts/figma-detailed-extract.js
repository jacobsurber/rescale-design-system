#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_FILE_KEY = 'B0H99zI9iTyU7vusGYP3rk';

// Key pages to analyze for design system content
const KEY_PAGES = {
  'components': '1148:36314',      // Rescale Data Components
  'icons': '720:16162',            // illustrations, icons, and inspiration  
  'flow25js': '17724:173694',      // Rescale 2.5 Flow [JS] - target page
  'flow25': '13633:181938',        // Rescale 2.5 Flow
  'searchAI': '1318:9800',         // Search & Rescale AI
  'jobStatus': '10124:51910',      // Job Status
  'workflows': '1236:36768'        // Workflows
};

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

async function extractPageContent(token, pageId, pageName) {
  console.log(`🔍 Analyzing ${pageName} page...`);
  
  try {
    const nodeUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${pageId}&depth=2`;
    const nodeData = await makeRequest(nodeUrl, token);
    
    const page = nodeData.nodes[pageId];
    if (!page) {
      console.log(`   ❌ Could not fetch ${pageName}`);
      return null;
    }

    console.log(`   ✅ Found ${page.document?.children?.length || 0} top-level frames`);
    
    // Extract frame names and basic info
    const frames = page.document?.children?.map(frame => ({
      id: frame.id,
      name: frame.name,
      type: frame.type,
      width: frame.absoluteBoundingBox?.width,
      height: frame.absoluteBoundingBox?.height,
      childCount: frame.children?.length || 0,
      backgroundColor: frame.backgroundColor
    })) || [];

    return {
      id: pageId,
      name: pageName,
      frameCount: frames.length,
      frames: frames
    };

  } catch (error) {
    console.log(`   ❌ Error fetching ${pageName}: ${error.message}`);
    return null;
  }
}

async function extractDesignSystemData(token) {
  console.log('🎨 Extracting Design System Data from Key Pages');
  console.log('==============================================\n');

  const results = {};

  // Extract content from each key page
  for (const [key, pageId] of Object.entries(KEY_PAGES)) {
    const result = await extractPageContent(token, pageId, key);
    if (result) {
      results[key] = result;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save detailed results
  const outputPath = path.join(__dirname, '../figma-design-system-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed data saved to: ${outputPath}`);

  // Analyze and report findings
  analyzeDesignSystemContent(results);
  
  return results;
}

function analyzeDesignSystemContent(data) {
  console.log('\n📊 DESIGN SYSTEM ANALYSIS');
  console.log('=========================\n');

  // Components page analysis
  if (data.components) {
    console.log('🧩 RESCALE DATA COMPONENTS PAGE:');
    console.log(`   Frames found: ${data.components.frameCount}`);
    
    if (data.components.frames) {
      data.components.frames.forEach(frame => {
        console.log(`   📦 ${frame.name} (${frame.childCount} children)`);
      });
    }
    console.log('');
  }

  // Icons and illustrations
  if (data.icons) {
    console.log('🎨 ICONS & ILLUSTRATIONS PAGE:');
    console.log(`   Frames found: ${data.icons.frameCount}`);
    
    if (data.icons.frames) {
      data.icons.frames.forEach(frame => {
        console.log(`   🖼️ ${frame.name} (${frame.childCount} children)`);
      });
    }
    console.log('');
  }

  // Main flow pages
  if (data.flow25js) {
    console.log('🚀 RESCALE 2.5 FLOW [JS] PAGE (Target Page):');
    console.log(`   Frames found: ${data.flow25js.frameCount}`);
    
    if (data.flow25js.frames) {
      data.flow25js.frames.forEach(frame => {
        console.log(`   📱 ${frame.name} (${frame.childCount} children)`);
        if (frame.width && frame.height) {
          console.log(`      Size: ${Math.round(frame.width)}×${Math.round(frame.height)}px`);
        }
      });
    }
    console.log('');
  }

  // Job Status analysis
  if (data.jobStatus) {
    console.log('💼 JOB STATUS PAGE:');
    console.log(`   Frames found: ${data.jobStatus.frameCount}`);
    
    if (data.jobStatus.frames) {
      data.jobStatus.frames.forEach(frame => {
        console.log(`   📋 ${frame.name} (${frame.childCount} children)`);
      });
    }
    console.log('');
  }

  // Search & AI
  if (data.searchAI) {
    console.log('🔍 SEARCH & RESCALE AI PAGE:');
    console.log(`   Frames found: ${data.searchAI.frameCount}`);
    
    if (data.searchAI.frames) {
      data.searchAI.frames.forEach(frame => {
        console.log(`   🤖 ${frame.name} (${frame.childCount} children)`);
      });
    }
    console.log('');
  }

  console.log('🎯 RECOMMENDATIONS:');
  console.log('===================');
  console.log('1. Focus on "Rescale Data Components" page for component extraction');
  console.log('2. Use "Rescale 2.5 Flow [JS]" for layout and interaction patterns');
  console.log('3. Extract icons from "illustrations, icons, and inspiration"');
  console.log('4. Analyze job status patterns for StatusTag component updates');
  console.log('5. Review search/AI interfaces for AssistantChat improvements\n');
}

const token = process.env.FIGMA_TOKEN || process.argv[2];
if (!token) {
  console.log('❌ Need Figma token!');
  process.exit(1);
}

extractDesignSystemData(token);