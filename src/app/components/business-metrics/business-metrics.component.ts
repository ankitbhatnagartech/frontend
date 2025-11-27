import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimationResult } from '../../services/estimation.service';

@Component({
    selector: 'app-business-metrics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './business-metrics.component.html',
    styleUrl: './business-metrics.component.css'
})
export class BusinessMetricsComponent {
    @Input() result: EstimationResult | null = null;
    @Input() currency: string = 'INR';

    getCurrencySymbol(): string {
        const symbols: { [key: string]: string } = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹',
            'JPY': '¥'
        };
        return symbols[this.currency] || '$';
    }
}
