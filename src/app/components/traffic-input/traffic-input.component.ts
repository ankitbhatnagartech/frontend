import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() traffic!: TrafficInput;
  @Output() trafficChange = new EventEmitter<TrafficInput>();

  onChange() {
    this.trafficChange.emit(this.traffic);
  }
}
