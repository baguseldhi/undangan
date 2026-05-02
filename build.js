const fs = require('fs-extra');

const url = process.env.APP_URL || 'http://localhost:8080';
const files = ['assets', 'css', 'dist', 'index.html', 'dashboard.html'];
const dest = '../api-undangan/public';

fs.ensureDir(dest)
  .then(() => Promise.all(files.map((f) => fs.copy(f, dest + '/' + f))))
  .then(() => {
    // Replace data-url di index.html
    let idx = fs.readFileSync(dest + '/index.html', 'utf8');
    idx = idx.replace(/data-url="[^"]*"/g, `data-url="${url}"`);
    fs.writeFileSync(dest + '/index.html', idx);

    // Replace data-url di dashboard.html
    let dash = fs.readFileSync(dest + '/dashboard.html', 'utf8');
    dash = dash.replace(/data-url="[^"]*"/g, `data-url="${url}"`);
    fs.writeFileSync(dest + '/dashboard.html', dash);

    console.log('✅ Successfully! URL:', url);
  })
  .catch(err => console.error('❌ Error:', err));
