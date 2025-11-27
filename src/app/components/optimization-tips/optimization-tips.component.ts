import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimationResult } from '../../services/estimation.service';

@Component({
    selector: 'app-optimization-tips',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './optimization-tips.component.html',
    styleUrl: './optimization-tips.component.css'
})
export class OptimizationTipsComponent {
    @Input() result: EstimationResult | null = null;
}
