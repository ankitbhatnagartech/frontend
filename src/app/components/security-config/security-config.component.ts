import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecurityConfig } from '../../services/estimation.service';

@Component({
  selector: 'app-security-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-config.component.html',
  styleUrl: './security-config.component.css'
})
export class SecurityConfigComponent {
  @Input() config!: SecurityConfig;
  @Output() configChange = new EventEmitter<SecurityConfig>();

  complianceOptions = ['soc2', 'iso27001', 'hipaa', 'pci_dss'];

  toggleCompliance(standard: string) {
    const index = this.config.compliance.indexOf(standard);
    if (index > -1) {
      this.config.compliance.splice(index, 1);
    } else {
      this.config.compliance.push(standard);
    }
    this.onChange();
  }

  isComplianceChecked(standard: string): boolean {
    return this.config.compliance.includes(standard);
  }

  onChange() {
    this.configChange.emit(this.config);
  }
}
