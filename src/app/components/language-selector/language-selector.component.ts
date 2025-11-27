import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Language {
    code: string;
    name: string;
    nativeName: string;
}

@Component({
    selector: 'app-language-selector',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="form-control w-full">
      <label class="label text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" i18n>Language</label>
      <div class="relative">
        <select [(ngModel)]="selectedLanguage" (change)="onLanguageChange()" 
          class="w-full appearance-none bg-slate-800 border border-slate-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 hover:bg-slate-700 transition-colors cursor-pointer">
          <option *ngFor="let lang of languages" [value]="lang.code">
            {{lang.nativeName}} ({{lang.name}})
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class LanguageSelectorComponent {
    languages: Language[] = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский' },
        { code: 'zh', name: 'Chinese', nativeName: '中文' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語' },
        { code: 'ko', name: 'Korean', nativeName: '한국어' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
        { code: 'pl', name: 'Polish', nativeName: 'Polski' },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
        { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' }
    ];

    selectedLanguage: string;

    constructor(@Inject(LOCALE_ID) public locale: string) {
        // Angular locales might be like 'en-US', so we take the first part
        this.selectedLanguage = locale.split('-')[0];

        // Check localStorage for saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');

        // If we have a saved language, and it's different from current, and we are at root (or default), 
        // we might want to redirect. But be careful of infinite loops.
        // For now, we just ensure the selector reflects the current locale.

        // If the current locale isn't in our list (e.g. during development), default to 'en'
        if (!this.languages.find(l => l.code === this.selectedLanguage)) {
            this.selectedLanguage = 'en';
        }
    }

    onLanguageChange() {
        // Save preference
        localStorage.setItem('preferredLanguage', this.selectedLanguage);

        // In a real Angular i18n setup, changing language usually requires a page reload 
        // to load the different build artifact.
        // We'll redirect to the corresponding localized path.
        // Assuming the app is served at / for en, /fr/ for French, etc.

        const newCode = this.selectedLanguage;
        const currentCode = this.locale.split('-')[0];

        if (newCode === currentCode) return;

        // Construct new URL
        // This logic depends on how the app is deployed. 
        // For local dev with 'ng serve --configuration=fr', we can't easily switch.
        // But for a production build served via Nginx/Apache with subdirectories:

        const currentPath = window.location.pathname;
        let newPath = currentPath;

        // Simple replacement logic for now. 
        // If we are at /fr/some-page, we want /de/some-page.
        // If we are at /some-page (default en), we want /de/some-page.

        // Check if current path starts with a known language code
        const pathParts = currentPath.split('/').filter(p => p);
        const firstPart = pathParts[0];

        const isFirstPartLang = this.languages.some(l => l.code === firstPart);

        if (isFirstPartLang) {
            // Replace the language part
            if (newCode === 'en') {
                // If switching to default (en), remove the lang prefix
                // e.g. /fr/foo -> /foo
                newPath = '/' + pathParts.slice(1).join('/');
            } else {
                // e.g. /fr/foo -> /de/foo
                pathParts[0] = newCode;
                newPath = '/' + pathParts.join('/');
            }
        } else {
            // Current path has no lang prefix (so it's 'en')
            if (newCode !== 'en') {
                // Add prefix
                // e.g. /foo -> /de/foo
                newPath = '/' + newCode + currentPath;
            }
        }

        // Clean up double slashes if any
        newPath = newPath.replace('//', '/');
        if (newPath === '') newPath = '/';

        window.location.href = newPath;
    }
}
