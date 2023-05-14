const fs = require('fs');

const gitignore = fs.readFileSync('./.gitignore', 'utf8');
const easignore = gitignore.split('### EASINCLUDE! ###')[0];
fs.writeFileSync('./.easignore', easignore);
