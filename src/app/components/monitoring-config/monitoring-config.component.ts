import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoringConfig } from '../../services/estimation.service';

@Component({
  selector: 'app-monitoring-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-config.component.html',
  styleUrl: './monitoring-config.component.css'
})
export class MonitoringConfigComponent {
  @Input() config!: MonitoringConfig;
  @Output() configChange = new EventEmitter<MonitoringConfig>();

  providers = ['cloudwatch', 'datadog', 'newrelic'];

  onChange() {
    this.configChange.emit(this.config);
  }
}
