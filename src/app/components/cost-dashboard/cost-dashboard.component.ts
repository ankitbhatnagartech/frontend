import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimationResult } from '../../services/estimation.service';

@Component({
  selector: 'app-cost-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cost-dashboard.component.html',
  styleUrl: './cost-dashboard.component.css'
})
export class CostDashboardComponent {
  @Input() result: EstimationResult | null = null;
  @Input() currency: string = 'USD';
}
