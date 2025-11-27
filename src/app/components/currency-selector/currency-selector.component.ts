import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  region: string;
}

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-control w-full">
      <label class="label text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Currency</label>
      <div class="relative">
        <select [(ngModel)]="selectedCurrency" (change)="onCurrencyChange()" 
          class="w-full appearance-none bg-slate-800 border border-slate-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 hover:bg-slate-700 transition-colors cursor-pointer">
          <optgroup *ngFor="let region of regions" [label]="region" class="bg-slate-800 text-gray-200">
            <option *ngFor="let curr of getCurrenciesByRegion(region)" [value]="curr.code">
              {{curr.symbol}} {{curr.code}} - {{curr.name}}
            </option>
          </optgroup>
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
export class CurrencySelectorComponent {
  @Output() currencyChanged = new EventEmitter<string>();

  currencies: Currency[] = [
    // Americas
    { code: 'USD', symbol: '$', name: 'US Dollar', region: 'Americas' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', region: 'Americas' },
    { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', region: 'Americas' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', region: 'Americas' },
    { code: 'ARS', symbol: 'ARS$', name: 'Argentine Peso', region: 'Americas' },
    { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso', region: 'Americas' },
    { code: 'COP', symbol: 'COL$', name: 'Colombian Peso', region: 'Americas' },
    { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', region: 'Americas' },

    // Europe
    { code: 'EUR', symbol: '€', name: 'Euro', region: 'Europe' },
    { code: 'GBP', symbol: '£', name: 'British Pound', region: 'Europe' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', region: 'Europe' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', region: 'Europe' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', region: 'Europe' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone', region: 'Europe' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', region: 'Europe' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', region: 'Europe' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', region: 'Europe' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu', region: 'Europe' },
    { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', region: 'Europe' },
    { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', region: 'Europe' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', region: 'Europe' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', region: 'Europe' },

    // Asia-Pacific
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', region: 'Asia-Pacific' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', region: 'Asia-Pacific' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', region: 'Asia-Pacific' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', region: 'Asia-Pacific' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', region: 'Asia-Pacific' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', region: 'Asia-Pacific' },
    { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', region: 'Asia-Pacific' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', region: 'Asia-Pacific' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', region: 'Asia-Pacific' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', region: 'Asia-Pacific' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso', region: 'Asia-Pacific' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', region: 'Asia-Pacific' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', region: 'Asia-Pacific' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', region: 'Asia-Pacific' },
    { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', region: 'Asia-Pacific' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', region: 'Asia-Pacific' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', region: 'Asia-Pacific' },

    // Middle East & Africa
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', region: 'Middle East & Africa' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', region: 'Middle East & Africa' },
    { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', region: 'Middle East & Africa' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', region: 'Middle East & Africa' },
    { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar', region: 'Middle East & Africa' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', region: 'Middle East & Africa' },
    { code: 'EGP', symbol: '£', name: 'Egyptian Pound', region: 'Middle East & Africa' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', region: 'Middle East & Africa' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', region: 'Middle East & Africa' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', region: 'Middle East & Africa' }
  ];

  regions: string[] = ['Americas', 'Europe', 'Asia-Pacific', 'Middle East & Africa'];

  @Input() selectedCurrency = 'INR';

  getCurrenciesByRegion(region: string): Currency[] {
    return this.currencies.filter(c => c.region === region);
  }

  onCurrencyChange() {
    this.currencyChanged.emit(this.selectedCurrency);
  }

  getCurrencySymbol(code: string): string {
    return this.currencies.find(c => c.code === code)?.symbol || '$';
  }
}
