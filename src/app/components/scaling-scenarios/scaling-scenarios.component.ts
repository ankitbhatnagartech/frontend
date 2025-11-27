import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimationResult } from '../../services/estimation.service';

@Component({
    selector: 'app-scaling-scenarios',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './scaling-scenarios.component.html',
    styleUrl: './scaling-scenarios.component.css'
})
export class ScalingScenariosComponent {
    @Input() result: EstimationResult | null = null;
    @Input() currency: string = 'USD';
}
