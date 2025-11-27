const express = require('express');
const path = require('path');

const app = express();
const PORT = 4200;

// Serve localized builds
const locales = ['en', 'fr', 'de', 'es', 'zh', 'ja', 'hi', 'ar'];

locales.forEach(locale => {
    if (locale === 'en') {
        // Serve English at root
        app.use('/', express.static(path.join(__dirname, `dist/frontend/${locale}`)));
    } else {
        // Serve other locales at /{locale}/
        app.use(`/${locale}`, express.static(path.join(__dirname, `dist/frontend/${locale}`)));
    }
});

// Fallback to English for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/frontend/en/index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🌍 Localized app running at http://localhost:${PORT}`);
    console.log(`\nAvailable languages:`);
    console.log(`  English:  http://localhost:${PORT}/`);
    console.log(`  French:   http://localhost:${PORT}/fr/`);
    console.log(`  German:   http://localhost:${PORT}/de/`);
    console.log(`  Spanish:  http://localhost:${PORT}/es/`);
    console.log(`  Chinese:  http://localhost:${PORT}/zh/`);
    console.log(`  Japanese: http://localhost:${PORT}/ja/`);
    console.log(`  Hindi:    http://localhost:${PORT}/hi/`);
    console.log(`  Arabic:   http://localhost:${PORT}/ar/`);
});
