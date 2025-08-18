// check-docs-styleguide.js
// This script checks that every markdown file in /docs references the style guide as the UI/UX source of truth.

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs');
const STYLE_GUIDE_REF = /style[-_ ]guide\.md/i;
const UIUX_KEYWORDS = /source of truth|ui\/ux|visual|design/i;

function checkDocs() {
  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
  let allPass = true;
  files.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const hasStyleGuide = STYLE_GUIDE_REF.test(content);
    const hasUIUX = UIUX_KEYWORDS.test(content);
    if (!hasStyleGuide || !hasUIUX) {
      allPass = false;
      console.log(`❌ ${file} is missing a reference to the style guide as the UI/UX source of truth.`);
    } else {
      console.log(`✅ ${file} references the style guide for UI/UX.`);
    }
  });
  if (allPass) {
    console.log('\nAll documentation files are consistent with the style guide policy.');
    process.exit(0);
  } else {
    console.log('\nSome documentation files need updates to reference the style guide as the UI/UX source of truth.');
    process.exit(1);
  }
}

checkDocs();
