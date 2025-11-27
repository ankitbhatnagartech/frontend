import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export enum ArchitectureType {
  MONOLITH = "monolith",
  MICROSERVICES = "microservices",
  SERVERLESS = "serverless",
  HYBRID = "hybrid"
}

export interface TrafficInput {
  daily_active_users: number;
  api_requests_per_user: number;
  storage_per_user_mb: number;
  peak_traffic_multiplier: number;
  growth_rate_yoy: number;
  revenue_per_user_monthly: number;
  funding_available: number;
}

export interface CostComponent {
  compute: number;
  database: number;
  storage: number;
  networking: number;
  monitoring: number;
  security: number;
  backup: number;
  total: number;
}

export interface EstimationResult {
  architecture: ArchitectureType;
  traffic_input: TrafficInput;
  monthly_cost: CostComponent;
  yearly_cost: number;
  three_year_projection: { [key: string]: number };
  infrastructure_requirements: { [key: string]: string };
  multi_cloud_costs: { [key: string]: number };
  scaling_scenarios: { [key: string]: number };
  optimization_suggestions: { title: string, saving: string, description: string }[];
  business_metrics: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class EstimationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  estimate(architecture: ArchitectureType, traffic: TrafficInput, currency: string = "USD"): Observable<EstimationResult> {
    return this.http.post<EstimationResult>(`${this.apiUrl}/estimate?currency=${currency}`, {
      architecture,
      traffic
    });
  }
}
