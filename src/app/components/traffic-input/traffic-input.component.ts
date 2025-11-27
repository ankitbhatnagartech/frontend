import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrafficInput } from '../../services/estimation.service';

@Component({
  selector: 'app-traffic-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './traffic-input.component.html',
  styleUrl: './traffic-input.component.css'
})
export class TrafficInputComponent {
  @Output() trafficChanged = new EventEmitter<TrafficInput>();

  traffic: TrafficInput = {
    daily_active_users: 1000,
    api_requests_per_user: 50,
    storage_per_user_mb: 0.1,
    peak_traffic_multiplier: 1.5,
    growth_rate_yoy: 0.2,
    revenue_per_user_monthly: 0,
    funding_available: 0
  };

  emitChange() {
    this.trafficChanged.emit(this.traffic);
  }
}
