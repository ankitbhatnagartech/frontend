import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrafficInput } from '../../services/estimation.service';

@Component({
  selector: 'app-business-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-metrics.component.html',
  styleUrl: './business-metrics.component.css'
})
export class BusinessMetricsComponent {
  @Input() traffic!: TrafficInput;
  @Input() currencySymbol: string = '$';
  @Output() trafficChange = new EventEmitter<TrafficInput>();

  onChange() {
    this.trafficChange.emit(this.traffic);
  }
}
