import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  EstimationService,
  TrafficInput,
  ArchitectureType,
  EstimationResult,
  PricingStatus,
  DatabaseConfig,
  CDNConfig,
  MessageQueueConfig,
  SecurityConfig,
  MonitoringConfig,
  CICDConfig,
  MultiRegionConfig
} from './services/estimation.service';
import { TrafficInputComponent } from './components/traffic-input/traffic-input.component';
import { BusinessMetricsComponent } from './components/business-metrics/business-metrics.component';
import { AdvancedConfigComponent } from './components/advanced-config/advanced-config.component';
import { CostSummaryCardsComponent } from './components/cost-summary-cards/cost-summary-cards.component';
import { CostChartComponent } from './components/cost-chart/cost-chart.component';
import { ExportService } from './services/export.service';

const defaultDatabase: DatabaseConfig = {
  type: 'rds',
  read_replicas: 0,
  backup_enabled: false,
  multi_az: false,
  cache_type: undefined,
  cache_size_gb: 0
};

const defaultCDN: CDNConfig = {
  enabled: false,
  provider: 'cloudfront',
  data_transfer_gb: 0,
  edge_functions: false,
  video_streaming: false
};

const defaultMessaging: MessageQueueConfig = {
  enabled: false,
  type: 'sqs',
  messages_per_day: 0,
  retention_days: 7,
  dlq_enabled: false
};

const defaultSecurity: SecurityConfig = {
  waf_enabled: false,
  vpn_enabled: false,
  ddos_protection: false,
  ssl_certificates: 0,
  compliance: [],
  secrets_manager: false
};

const defaultMonitoring: MonitoringConfig = {
  provider: 'cloudwatch',
  log_retention_days: 7,
  apm_enabled: false,
  distributed_tracing: false,
  alert_channels: 0
};

const defaultCICD: CICDConfig = {
  provider: 'github_actions',
  builds_per_month: 100,
  container_registry: false,
  security_scanning: false,
  artifact_storage_gb: 0
};

const defaultMultiRegion: MultiRegionConfig = {
  enabled: false,
  regions: 1,
  replication_type: 'active_passive',
  cross_region_transfer_gb: 0,
  rto_minutes: 60,
  rpo_minutes: 60
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TrafficInputComponent,
    BusinessMetricsComponent,
    AdvancedConfigComponent,
    CostSummaryCardsComponent,
    CostChartComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ArchCost';

  selectedArchitecture: ArchitectureType = 'serverless';
  selectedCurrency: string = 'USD';
  selectedProvider: string = 'AWS';
  cloudProviders: Array<{ name: string; multiplier: number; category: string }> = [];

  traffic: TrafficInput = {
    daily_active_users: 10000,
    api_requests_per_user: 50,
    storage_per_user_mb: 10,
    peak_traffic_multiplier: 1.5,
    growth_rate_yoy: 0.2,
    revenue_per_user_monthly: 0,
    funding_available: 0,
    database: defaultDatabase,
    cdn: defaultCDN,
    messaging: defaultMessaging,
    security: defaultSecurity,
    monitoring: defaultMonitoring,
    cicd: defaultCICD,
    multi_region: defaultMultiRegion
  };

  estimationResult: EstimationResult | null = null;
  pricingStatus: PricingStatus | null = null;
  isLoading: boolean = false;
  shareUrlCopied: boolean = false;

  constructor(
    private estimationService: EstimationService,
    private route: ActivatedRoute,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.loadCloudProviders();
    this.loadFromUrl();
    this.loadPricingStatus();
    this.calculateCost();
  }

  loadPricingStatus() {
    this.estimationService.getPricingStatus().subscribe(status => {
      this.pricingStatus = status;
    });
  }

  loadCloudProviders() {
    this.estimationService.getCloudProviders().subscribe(response => {
      this.cloudProviders = response.providers;
    });
  }

  calculateCost() {
    this.isLoading = true;
    this.estimationService.estimate(this.traffic, this.selectedArchitecture, this.selectedCurrency)
      .subscribe({
        next: (result) => {
          this.estimationResult = result;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error calculating cost:', err);
          this.isLoading = false;
        }
      });
  }

  onTrafficChange(newTraffic: TrafficInput) {
    this.traffic = newTraffic;
    this.calculateCost();
  }

  generateShareUrl() {
    const params = new URLSearchParams();
    params.set('arch', this.selectedArchitecture);
    params.set('provider', this.selectedProvider);
    params.set('dau', this.traffic.daily_active_users.toString());
    params.set('api', this.traffic.api_requests_per_user.toString());
    params.set('storage', this.traffic.storage_per_user_mb.toString());
    params.set('growth', this.traffic.growth_rate_yoy.toString());
    params.set('revenue', this.traffic.revenue_per_user_monthly.toString());
    params.set('funding', this.traffic.funding_available.toString());
    params.set('currency', this.selectedCurrency);

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    navigator.clipboard.writeText(url).then(() => {
      this.shareUrlCopied = true;
      setTimeout(() => {
        this.shareUrlCopied = false;
      }, 3000);
    });
  }

  loadFromUrl() {
    this.route.queryParams.subscribe(params => {
      if (params['arch']) {
        this.selectedArchitecture = params['arch'] as ArchitectureType;
      }
      if (params['provider']) {
        this.selectedProvider = params['provider'];
      }
      if (params['dau']) {
        this.traffic.daily_active_users = Number(params['dau']);
      }
      if (params['api']) {
        this.traffic.api_requests_per_user = Number(params['api']);
      }
      if (params['storage']) {
        this.traffic.storage_per_user_mb = Number(params['storage']);
      }
      if (params['growth']) {
        this.traffic.growth_rate_yoy = Number(params['growth']);
      }
      if (params['revenue']) {
        this.traffic.revenue_per_user_monthly = Number(params['revenue']);
      }
      if (params['funding']) {
        this.traffic.funding_available = Number(params['funding']);
      }
      if (params['currency']) {
        this.selectedCurrency = params['currency'];
      }
    });
  }

  getProviderData(provider: string): number | null {
    return this.estimationResult?.multi_cloud_costs?.[provider] || null;
  }

  getBestProvider(): string | null {
    if (!this.estimationResult?.multi_cloud_costs) return null;
    const costs = Object.entries(this.estimationResult.multi_cloud_costs);
    return costs.length > 0 ? costs.reduce((best, curr) => curr[1] < best[1] ? curr : best)[0] : null;
  }

  downloadPDF() {
    if (this.estimationResult) {
      this.exportService.exportToPDF(this.estimationResult, this.selectedArchitecture, this.selectedCurrency);
    }
  }

  downloadCSV() {
    if (this.estimationResult) {
      this.exportService.exportToCSV(this.estimationResult, this.selectedArchitecture, this.selectedCurrency);
    }
  }

  getProvidersList(): Array<{ provider: string; cost: number; multiplier: number; category: string }> {
    if (!this.estimationResult?.multi_cloud_costs) return [];

    return Object.entries(this.estimationResult.multi_cloud_costs).map(([provider, cost]) => {
      const providerInfo = this.cloudProviders.find(p => p.name === provider);
      return {
        provider,
        cost: cost as number,
        multiplier: providerInfo?.multiplier || 1.0,
        category: providerInfo?.category || 'Other'
      };
    }).sort((a, b) => a.cost - b.cost); // Sort by cost, cheapest first
  }

  getInfrastructureList(): Array<{ key: string; value: string }> {
    if (!this.estimationResult?.infrastructure_requirements) return [];
    return Object.entries(this.estimationResult.infrastructure_requirements).map(([key, value]) => ({
      key: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value as string
    }));
  }

  getYearProjections(): Array<{ year: string; cost: number }> {
    if (!this.estimationResult?.three_year_projection) return [];
    return Object.entries(this.estimationResult.three_year_projection).map(([year, cost]) => ({
      year: year.replace('year_', 'Year '),
      cost: cost as number
    }));
  }

  getBusinessMetrics(): Array<{ key: string; value: string }> {
    if (!this.estimationResult?.business_metrics) return [];
    return Object.entries(this.estimationResult.business_metrics).map(([key, value]) => ({
      key: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value as string
    }));
  }
}
