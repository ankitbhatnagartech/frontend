import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ArchitectureSelectorComponent } from './components/architecture-selector/architecture-selector.component';
import { TrafficInputComponent } from './components/traffic-input/traffic-input.component';
import { CostDashboardComponent } from './components/cost-dashboard/cost-dashboard.component';
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector.component';
import { MultiCloudTableComponent } from './components/multi-cloud-table/multi-cloud-table.component';
import { ScalingScenariosComponent } from './components/scaling-scenarios/scaling-scenarios.component';
import { OptimizationTipsComponent } from './components/optimization-tips/optimization-tips.component';
import { BusinessMetricsComponent } from './components/business-metrics/business-metrics.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { EstimationService, ArchitectureType, TrafficInput, EstimationResult } from './services/estimation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ArchitectureSelectorComponent, TrafficInputComponent, CostDashboardComponent, CurrencySelectorComponent, LanguageSelectorComponent, MultiCloudTableComponent, ScalingScenariosComponent, OptimizationTipsComponent, BusinessMetricsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'ArchCost';
  date = new Date();

  selectedArchitecture: ArchitectureType = ArchitectureType.MONOLITH;
  selectedCurrency: string = 'INR';
  traffic: TrafficInput = {
    daily_active_users: 10000,
    api_requests_per_user: 50,
    storage_per_user_mb: 10,
    peak_traffic_multiplier: 1.5,
    growth_rate_yoy: 0.2,
    revenue_per_user_monthly: 0,
    funding_available: 0
  };

  estimationResult: EstimationResult | null = null;
  loading = false;
  error: string | null = null;

  constructor(private estimationService: EstimationService) { }

  ngOnInit() {
    // Initial calculation
    this.calculateCost();
  }

  onArchitectureSelected(type: ArchitectureType) {
    this.selectedArchitecture = type;
    this.calculateCost();
  }

  onTrafficChanged(traffic: TrafficInput) {
    this.traffic = traffic;
    this.calculateCost();
  }

  onCurrencyChanged(currency: string) {
    this.selectedCurrency = currency;
    this.calculateCost();
  }

  calculateCost() {
    if (!this.selectedArchitecture) return;

    this.loading = true;
    this.error = null;

    this.estimationService.estimate(this.selectedArchitecture, this.traffic, this.selectedCurrency).subscribe({
      next: (result) => {
        this.estimationResult = result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error calculating cost:', err);
        this.error = 'Failed to calculate costs. Please try again.';
        this.loading = false;
      }
    });
  }

  exportPdf() {
    window.print();
  }

  exportToCsv() {
    if (!this.estimationResult) return;

    const result = this.estimationResult;
    const rows = [
      ['Category', 'Value'],
      ['Architecture', result.architecture],
      ['Daily Active Users', result.traffic_input.daily_active_users],
      ['Monthly Cost (' + this.selectedCurrency + ')', result.monthly_cost.total.toFixed(2)],
      ['Yearly Cost (' + this.selectedCurrency + ')', result.yearly_cost.toFixed(2)],
      [],
      ['Cost Breakdown', ''],
      ['Compute', result.monthly_cost.compute.toFixed(2)],
      ['Database', result.monthly_cost.database.toFixed(2)],
      ['Storage', result.monthly_cost.storage.toFixed(2)],
      ['Networking', result.monthly_cost.networking.toFixed(2)],
      [],
      ['Multi-Cloud Comparison', ''],
      ...Object.entries(result.multi_cloud_costs).map(([k, v]) => [k, v.toFixed(2)]),
      [],
      ['Business Metrics', ''],
      ...Object.entries(result.business_metrics || {}).map(([k, v]) => [k, v])
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "archcost_estimation.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
