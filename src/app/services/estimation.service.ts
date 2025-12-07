import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type ArchitectureType = 'monolith' | 'microservices' | 'serverless';

export interface DatabaseConfig {
  type: string;
  read_replicas: number;
  backup_enabled: boolean;
  multi_az: boolean;
  cache_type?: string;
  cache_size_gb: number;
}

export interface CDNConfig {
  enabled: boolean;
  provider: string;
  data_transfer_gb: number;
  edge_functions: boolean;
  video_streaming: boolean;
}

export interface MessageQueueConfig {
  enabled: boolean;
  type: string;
  messages_per_day: number;
  retention_days: number;
  dlq_enabled: boolean;
}

export interface SecurityConfig {
  waf_enabled: boolean;
  vpn_enabled: boolean;
  ddos_protection: boolean;
  ssl_certificates: number;
  compliance: string[];
  secrets_manager: boolean;
}

export interface MonitoringConfig {
  provider: string;
  log_retention_days: number;
  apm_enabled: boolean;
  distributed_tracing: boolean;
  alert_channels: number;
}

export interface CICDConfig {
  provider: string;
  builds_per_month: number;
  container_registry: boolean;
  security_scanning: boolean;
  artifact_storage_gb: number;
}

export interface MultiRegionConfig {
  enabled: boolean;
  regions: number;
  replication_type: string;
  cross_region_transfer_gb: number;
  rto_minutes: number;
  rpo_minutes: number;
}

export interface TrafficInput {
  daily_active_users: number;
  api_requests_per_user: number;
  storage_per_user_mb: number;
  peak_traffic_multiplier: number;
  growth_rate_yoy: number;
  revenue_per_user_monthly: number;
  funding_available: number;
  database: DatabaseConfig;
  cdn: CDNConfig;
  messaging: MessageQueueConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  cicd: CICDConfig;
  multi_region: MultiRegionConfig;
}

export interface MonthlyCost {
  compute: number;
  database: number;
  storage: number;
  networking: number;
  cdn: number;
  messaging: number;
  security: number;
  monitoring: number;
  cicd: number;
  multi_region: number;
  total: number;
}

export interface EstimationResult {
  architecture: ArchitectureType;
  traffic_input: TrafficInput;
  monthly_cost: MonthlyCost;
  yearly_cost: number;
  three_year_projection: { [key: string]: number };
  infrastructure_requirements: { [key: string]: string };
  multi_cloud_costs: { [key: string]: number };
  scaling_scenarios: { [key: string]: number };
  optimization_suggestions: Array<{ title: string; saving: string; description: string }>;
  business_metrics: { [key: string]: string };
}

export interface PricingStatus {
  source: string;
  last_updated: string;
  currency_count: number;
  using_database: boolean;
}

export interface CloudProvider {
  name: string;
  multiplier: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstimationService {
  private apiUrl = environment.apiUrl;

  // Client-side ETag cache: store {payloadHash → {etag, result, timestamp}}
  private etagCache: Map<string, { etag: string; result: EstimationResult; timestamp: number }> = new Map();
  private cacheMaxAge = 24 * 60 * 60 * 1000; // 24 hours TTL

  constructor(private http: HttpClient) {
    if (environment.production) {
      console.log("We are in Production mode!");
    }
    else {
      console.log("We are in Development mode!");
    }
  }

  /**
   * Generate a simple hash of the payload to use as cache key
   */
  private hashPayload(obj: any): string {
    const json = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'cache_' + Math.abs(hash).toString(16);
  }

  estimate(traffic: TrafficInput, architecture: ArchitectureType, currency: string): Observable<EstimationResult> {
    const payload = {
      traffic,
      architecture,
      currency
    };

    const payloadHash = this.hashPayload(payload);
    const cached = this.etagCache.get(payloadHash);

    // Check if we have a valid cached entry
    if (cached && (Date.now() - cached.timestamp) < this.cacheMaxAge) {
      // Build headers with If-None-Match to validate cache with server
      const headers = new HttpHeaders({
        'If-None-Match': cached.etag
      });

      return this.http.post<EstimationResult>(
        `${this.apiUrl}/estimate`,
        payload,
        { headers }
      ).pipe(
        // Handle 304 by returning cached result
        catchError((error: any) => {
          // 304 is treated as error by HttpClient, so we catch and return cached
          if (error.status === 304) {
            console.log('ETag matched; using cached result');
            return of(cached.result);
          }
          throw error;
        }),
        // On successful 200, update cache with new ETag and return result
        map((result: EstimationResult) => {
          const etag = this.extractETag(result);
          if (etag) {
            this.etagCache.set(payloadHash, {
              etag,
              result,
              timestamp: Date.now()
            });
          }
          return result;
        })
      );
    } else {
      // No cached entry; make fresh request
      return this.http.post<EstimationResult>(
        `${this.apiUrl}/estimate`,
        payload
      ).pipe(
        map((result: EstimationResult) => {
          // Store the ETag from response headers
          const etag = this.extractETag(result);
          if (etag) {
            this.etagCache.set(payloadHash, {
              etag,
              result,
              timestamp: Date.now()
            });
          }
          return result;
        })
      );
    }
  }

  /**
   * Extract ETag from HttpResponse headers (would be done via HttpObserve.response)
   * For now, we'll rely on the X-Cache-Key header if available in response body metadata
   * Note: To properly get ETag from response, modify the estimate call to observe: 'response'
   */
  private extractETag(result: any): string {
    // Placeholder: In a production setup, you'd modify the endpoint to return response headers
    // For now, we generate a simple hash-based pseudo-ETag from the result
    const resultJson = JSON.stringify(result);
    return this.generateSimpleHash(resultJson);
  }

  /**
   * Simple hash function for result serialization
   */
  private generateSimpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  getPricingStatus(): Observable<PricingStatus> {
    return this.http.get<PricingStatus>(`${this.apiUrl}/pricing/status`).pipe(
      catchError(() => of({
        source: 'Error',
        last_updated: new Date().toISOString(),
        currency_count: 0,
        using_database: false
      }))
    );
  }

  getCloudProviders(): Observable<{ providers: CloudProvider[] }> {
    return this.http.get<{ providers: CloudProvider[] }>(`${this.apiUrl}/providers`).pipe(
      catchError(() => of({ providers: [{ name: 'AWS', multiplier: 1.0, category: 'Major Global' }] }))
    );
  }
}
