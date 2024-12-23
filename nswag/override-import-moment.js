const fs = require('fs'); // Import the File System module
const path = require('path'); // Import the Path module

// Path to the generated file
const filePath = path.join(__dirname, '../src/shared/service-proxies/service-proxies.ts'); // Update the path as needed

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Replace the import statement for moment.js
if (content.includes("import moment from 'moment';")) {
  content = content.replace(
    "import moment from 'moment';",
    "import * as moment from 'moment';"
  );

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated the moment import!');
} else {
  console.log('No matching import statement found. File unchanged.');
}
