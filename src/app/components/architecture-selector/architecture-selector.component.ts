import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchitectureType } from '../../services/estimation.service';

@Component({
  selector: 'app-architecture-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './architecture-selector.component.html',
  styleUrl: './architecture-selector.component.css'
})
export class ArchitectureSelectorComponent {
  @Output() architectureSelected = new EventEmitter<ArchitectureType>();

  ArchitectureType = ArchitectureType;
  selected: ArchitectureType = ArchitectureType.MONOLITH;

  options = [
    { type: ArchitectureType.MONOLITH, label: 'Monolith', desc: 'Single server, simple scaling' },
    { type: ArchitectureType.MICROSERVICES, label: 'Microservices', desc: 'Containerized, complex scaling' },
    { type: ArchitectureType.SERVERLESS, label: 'Serverless', desc: 'Pay-per-use, infinite scaling' },
    { type: ArchitectureType.HYBRID, label: 'Hybrid', desc: 'Mix of traditional and modern' }
  ];

  select(type: ArchitectureType) {
    this.selected = type;
    this.architectureSelected.emit(type);
  }
}
