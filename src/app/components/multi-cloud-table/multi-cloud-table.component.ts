import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimationResult } from '../../services/estimation.service';

@Component({
    selector: 'app-multi-cloud-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './multi-cloud-table.component.html',
    styleUrl: './multi-cloud-table.component.css'
})
export class MultiCloudTableComponent {
    @Input() result: EstimationResult | null = null;
    @Input() currency: string = 'USD';

    getCheapestProvider(): string {
        if (!this.result || !this.result.multi_cloud_costs) return '';
        let cheapest = '';
        let minCost = Infinity;

        for (const [provider, cost] of Object.entries(this.result.multi_cloud_costs)) {
            if (cost < minCost) {
                minCost = cost;
                cheapest = provider;
            }
        }
        return cheapest;
    }
}
