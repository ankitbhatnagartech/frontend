# Testing Language Switching Locally

## The Issue
Angular i18n requires **separate builds** for each language. The `ng serve` development server only serves ONE locale at a time, so the language dropdown won't work in development mode.

## Solution: Test with Production Build

Follow these steps to test language switching:

### Step 1: Build All Locales
```bash
cd frontend
ng build --localize
```

This creates separate builds in:
- `dist/frontend/en/` (English)
- `dist/frontend/fr/` (French)
- `dist/frontend/de/` (German)
- `dist/frontend/es/` (Spanish)
- `dist/frontend/zh/` (Chinese)
- `dist/frontend/ja/` (Japanese)
- `dist/frontend/hi/` (Hindi)
- `dist/frontend/ar/` (Arabic)

### Step 2: Install Express (if not already installed)
```bash
npm install express --save-dev
```

### Step 3: Serve Localized Builds
```bash
node serve-localized.js
```

### Step 4: Test Language Switching
Open `http://localhost:4200` in your browser and test:
1. English at `http://localhost:4200/`
2. French at `http://localhost:4200/fr/`
3. German at `http://localhost:4200/de/`
4. etc.

The language dropdown should now work correctly!

## Alternative: Test Single Locale in Dev Mode

If you want to test a specific language during development:

```bash
# Test French
ng serve --configuration=fr

# Test German  
ng serve --configuration=de
```

But you'll need to add these configurations to `angular.json` first (see below).

## Adding Dev Configurations (Optional)

To enable `ng serve --configuration=fr`, add to `angular.json`:

```json
"serve": {
  "configurations": {
    "fr": {
      "buildTarget": "frontend:build:development,fr"
    },
    "de": {
      "buildTarget": "frontend:build:development,de"
    }
    // etc for other locales
  }
}
```

## Production Deployment

For production, you'd typically:
1. Build with `ng build --localize --configuration=production`
2. Configure Nginx/Apache to serve different locales:
   - `/` → `en` folder
   - `/fr/` → `fr` folder
   - etc.

See the walkthrough.md for Nginx configuration examples.
